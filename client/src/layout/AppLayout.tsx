import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkBase =
  "px-3 py-2 text-sm font-medium rounded-md transition-colors";

function navClass(isActive: boolean) {
  return `${navLinkBase} ${
    isActive ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5"
  }`;
}

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <span className="font-display text-lg font-semibold tracking-tight">
              HabitTracker
            </span>
            <nav className="flex items-center gap-1">
              <NavLink to="/dashboard" className={({ isActive }) => navClass(isActive)}>
                Dashboard
              </NavLink>
              <NavLink to="/insights" className={({ isActive }) => navClass(isActive)}>
                Insights
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => navClass(isActive)}>
                Settings
              </NavLink>
              {user?.role === "admin" && (
                <>
                  <NavLink to="/admin/users" className={({ isActive }) => navClass(isActive)}>
                    Admin · Users
                  </NavLink>
                  <NavLink to="/admin/stats" className={({ isActive }) => navClass(isActive)}>
                    Admin · Stats
                  </NavLink>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate">{user?.name}</span>
            <button onClick={() => logout()} className="btn-secondary !py-1.5 !px-3 text-xs">
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}