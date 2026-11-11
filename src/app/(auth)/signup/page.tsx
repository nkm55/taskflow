import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AuthForm } from "../AuthForm";
import { signup } from "../actions";

export const metadata = { title: "Sign up · Taskflow" };

export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <AuthForm mode="signup" action={signup} />;
}
