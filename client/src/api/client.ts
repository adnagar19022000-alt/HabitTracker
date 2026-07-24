import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required — Better Auth uses cookie-based sessions
  headers: {
    "Content-Type": "application/json",
  },
});

// Small helper so callers get a consistent error shape regardless of
// whether Express sent { error: { code, message } } or something else.
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.error?.message) return data.error.message;
    if (typeof data === "string") return data;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}