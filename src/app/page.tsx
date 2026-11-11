import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function Home() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <main className="hero">
      <span className="brand">Taskflow</span>
      <h1>Plan, track and ship work with your team.</h1>
      <p className="muted">
        Boards, tasks, comments, roles and a full activity history, in one place.
      </p>
      <div className="row">
        <Link href="/signup" className="btn primary">
          Get started
        </Link>
        <Link href="/login" className="btn ghost">
          Log in
        </Link>
      </div>
    </main>
  );
}
