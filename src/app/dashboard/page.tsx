import { requireUser } from "@/lib/auth/session";
import { logout } from "../(auth)/actions";

export const metadata = { title: "Dashboard · Taskflow" };

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="shell">
      <header className="topbar">
        <span className="brand">Taskflow</span>
        <div className="row">
          <span className="muted small">{user.email}</span>
          <form action={logout}>
            <button type="submit" className="btn ghost">
              Log out
            </button>
          </form>
        </div>
      </header>

      <main className="content">
        <h1>Hi, {user.name.split(" ")[0]}</h1>
        <div className="card empty">
          <h2>No teams yet</h2>
          <p className="muted">Creating teams and inviting members arrives in Stage 2.</p>
        </div>
      </main>
    </div>
  );
}
