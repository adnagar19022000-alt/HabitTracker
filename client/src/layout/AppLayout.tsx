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
        <div className="mx-auto flex max-w-5xl flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4">
          {/* Top row on mobile: Logo + User actions */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <span className="font-display text-lg font-semibold tracking-tight">
              HabitTracker
            </span>
            <div className="flex items-center gap-4 md:hidden">
              <span className="text-sm text-slate truncate max-w-[100px]">{user?.name}</span>
              <button onClick={() => logout()} className="btn-secondary !py-1.5 !px-3 text-xs shrink-0">
                Log out
              </button>
            </div>
          </div>

          {/* Navigation links: Scrollable on mobile */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-none">
            <NavLink to="/dashboard" className={({ isActive }) => navClass(isActive) + " whitespace-nowrap shrink-0"}>
              Dashboard
            </NavLink>
            <NavLink to="/insights" className={({ isActive }) => navClass(isActive) + " whitespace-nowrap shrink-0"}>
              Insights
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => navClass(isActive) + " whitespace-nowrap shrink-0"}>
              Settings
            </NavLink>
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin/users" className={({ isActive }) => navClass(isActive) + " whitespace-nowrap shrink-0"}>
                  Admin · Users
                </NavLink>
                <NavLink to="/admin/stats" className={({ isActive }) => navClass(isActive) + " whitespace-nowrap shrink-0"}>
                  Admin · Stats
                </NavLink>
              </>
            )}
          </nav>

          {/* User actions: Desktop only */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <span className="text-sm text-slate truncate max-w-[150px]">{user?.name}</span>
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