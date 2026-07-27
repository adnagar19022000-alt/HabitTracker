import { Insights } from "./pages/Insights";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/Dashboard";
import { AppLayout } from "./layout/AppLayout";
import { HabitForm } from "./pages/habits/HabitForm";
import { Settings } from "./pages/Settings";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminStats } from "./pages/admin/AdminStats";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import PublicRoute from "./routes/PublicRoute";
import { HabitDetail } from "./pages/habits/HabitDetail";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/habits/new" element={<HabitForm />} />
                  <Route path="/habits/:id/edit" element={<HabitForm />} />
                  <Route path="/habits/:id" element={<HabitDetail />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/insights" element={<Insights />} />

       <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/stats" element={<AdminStats />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;