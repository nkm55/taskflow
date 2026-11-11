import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AuthForm } from "../AuthForm";
import { login } from "../actions";

export const metadata = { title: "Log in · Taskflow" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <AuthForm mode="login" action={login} />;
}
