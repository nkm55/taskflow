"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getDummyHash, hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { loginSchema, signupSchema } from "@/lib/validation";

export type AuthState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "password", string[]>>;
  values?: { name?: string; email?: string }; // echoed back so the form keeps what was typed
};

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const raw = {
    name: str(formData.get("name")),
    email: str(formData.get("email")),
    password: str(formData.get("password")),
  };
  const values = { name: raw.name, email: raw.email };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, values };
  }
  const { name, email, password } = parsed.data;

  let userId: string;
  try {
    const user = await db.user.create({
      data: { name, email, passwordHash: await hashPassword(password) },
      select: { id: true },
    });
    userId = user.id;
  } catch (err) {
    // Rely on the unique index instead of a "check then insert", which would race
    // if two sign-ups for the same email arrived at once. P2002 = unique violation.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { fieldErrors: { email: ["An account with this email already exists"] }, values };
    }
    throw err;
  }

  await createSession(userId);
  redirect("/dashboard"); // must stay outside try/catch: redirect() works by throwing
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const raw = { email: str(formData.get("email")), password: str(formData.get("password")) };
  const values = { email: raw.email };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, values };
  }
  const { email, password } = parsed.data;

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  // Always do one bcrypt compare so response time doesn't reveal whether the email exists.
  const ok = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));

  if (!user || !ok) {
    // Same message for both cases, for the same reason.
    return { error: "Incorrect email or password", values };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
