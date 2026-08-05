import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { api, getErrorMessage } from "../api/client";

export function Settings() {
  const { user, refreshUser, logout } = useAuth();
  
  // Status messages for both forms
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // --- 1. Profile Update Form ---
  const profileForm = useFormik({
    initialValues: {
      name: user?.name || "",
    },
    enableReinitialize: true, // Updates the form if 'user' data arrives slightly late
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required").min(2, "Name too short"),
    }),
    onSubmit: async (values) => {
      setProfileError("");
      setProfileSuccess("");
      try {
        await api.patch("/api/auth/me", { name: values.name });
        await refreshUser(); // Fetch the new name so the navbar updates instantly!
        setProfileSuccess("Profile updated successfully!");
        setTimeout(() => setProfileSuccess(""), 3000); // Hide success after 3 seconds
      } catch (err) {
        setProfileError(getErrorMessage(err));
      }
    },
  });

  // --- 2. Password Update Form ---
  const passwordForm = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(8, "Use at least 8 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .matches(/[\W_]/, "Must contain at least one special character")
        .required("New password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setPasswordError("");
      setPasswordSuccess("");
      try {
        await api.patch("/api/auth/password", values);
        setPasswordSuccess("Password updated successfully!");
        resetForm(); // Clear the password fields so they aren't sitting there
        setTimeout(() => setPasswordSuccess(""), 3000);
      } catch (err) {
        setPasswordError(getErrorMessage(err));
      }
    },
  });

  // --- 3. Delete Account ---
  async function handleDeleteAccount() {
    if (!window.confirm("DANGER: Are you sure you want to permanently delete your account? This action cannot be undone.")) return;
    
    try {
      await api.delete("/api/auth/me");
      await logout(); // Kick the user out to the login screen
    } catch (err) {
      alert("Failed to delete account: " + getErrorMessage(err));
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <h1 className="font-display text-2xl font-bold">Account Settings</h1>

      {/* --- Profile Section --- */}
      <div className="card space-y-4">
        <h2 className="font-display text-lg font-semibold">Profile</h2>
        
        <form onSubmit={profileForm.handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Email address</label>
            <input 
              type="text" 
              value={user?.email || ""} 
              disabled 
              className="field-input bg-ink/5 text-slate cursor-not-allowed" 
            />
            <p className="text-xs text-slate mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="field-label">Display Name</label>
            <input
              type="text"
              name="name"
              className="field-input"
              value={profileForm.values.name}
              onChange={profileForm.handleChange}
              onBlur={profileForm.handleBlur}
            />
            {profileForm.touched.name && profileForm.errors.name && (
              <div className="field-error">{profileForm.errors.name}</div>
            )}
          </div>

          {profileError && <div className="text-sm text-clay-dark">{profileError}</div>}
          {profileSuccess && <div className="text-sm text-leaf">{profileSuccess}</div>}

          <button
            type="submit"
            disabled={profileForm.isSubmitting || !profileForm.dirty}
            className="btn-primary"
          >
            {profileForm.isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* --- Password Section --- */}
      <div className="card space-y-4">
        <h2 className="font-display text-lg font-semibold">Change Password</h2>
        
        <form onSubmit={passwordForm.handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              className="field-input"
              value={passwordForm.values.currentPassword}
              onChange={passwordForm.handleChange}
              onBlur={passwordForm.handleBlur}
            />
            {passwordForm.touched.currentPassword && passwordForm.errors.currentPassword && (
              <div className="field-error">{passwordForm.errors.currentPassword}</div>
            )}
          </div>

          <div>
            <label className="field-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="field-input"
              value={passwordForm.values.newPassword}
              onChange={passwordForm.handleChange}
              onBlur={passwordForm.handleBlur}
            />
            {passwordForm.touched.newPassword && passwordForm.errors.newPassword && (
              <div className="field-error">{passwordForm.errors.newPassword}</div>
            )}
          </div>

          {passwordError && <div className="text-sm text-clay-dark">{passwordError}</div>}
          {passwordSuccess && <div className="text-sm text-leaf">{passwordSuccess}</div>}

          <button
            type="submit"
            disabled={passwordForm.isSubmitting || !passwordForm.dirty}
            className="btn-primary"
          >
            {passwordForm.isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* --- Danger Zone --- */}
      <div className="card border-clay-dark/20 bg-clay-dark/5 space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-clay-dark">Danger Zone</h2>
          <p className="text-sm text-slate mt-1">Once you delete your account, there is no going back. Please be certain.</p>
        </div>
        
        <button 
          onClick={handleDeleteAccount}
          className="btn-secondary text-clay-dark hover:bg-clay-dark/10 border-clay-dark/20"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}