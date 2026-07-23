import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";

const LoginSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            HabitTracker
          </h1>
          <p className="mt-2 text-sm text-slate">Log in to keep your streak going.</p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setFormError(null);
            try {
              await login(values.email, values.password);
              navigate("/dashboard");
            } catch (err) {
              setFormError(err instanceof Error ? err.message : "Login failed");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="field-label">Email</label>
                <Field id="email" name="email" type="email" className="field-input" placeholder="you@example.com" />
                <ErrorMessage name="email" component="p" className="field-error" />
              </div>

              <div>
                <label htmlFor="password" className="field-label">Password</label>
                <Field id="password" name="password" type="password" className="field-input" placeholder="••••••••" />
                <ErrorMessage name="password" component="p" className="field-error" />
              </div>

              {formError && (
                <p className="rounded-md bg-clay/10 px-3 py-2 text-sm text-clay-dark">
                  {formError}
                </p>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? "Logging in…" : "Log in"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-slate">
          New here?{" "}
          <Link to="/register" className="font-medium text-ink underline underline-offset-2">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}