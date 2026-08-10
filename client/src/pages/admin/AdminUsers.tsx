import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { AdminUserListItem } from "../../types";

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Debounce logic: wait 300ms after typing stops before hitting the API
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        // 2. Fetch users and pass the search string to the backend
        const res = await api.get<AdminUserListItem[]>("/api/admin/users", {
          params: { search },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    // 3. Cleanup: If the user types again before 300ms, cancel the old timer
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Header and Search Bar */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manage Users</h1>
        <div className="w-72">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="field-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden !p-0 border-clay/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-ink/5 text-slate">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Habits</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate">
                    No users found matching "{search}"
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-ink/5">
                    <td className="px-6 py-4 font-medium">{u.name}</td>
                    <td className="px-6 py-4 text-slate">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-sun/20 text-sun"
                            : "bg-ink/10 text-slate"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{u.habitCount}</td>
                    <td className="px-6 py-4 text-slate">
                      {new Date(u.joinDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}