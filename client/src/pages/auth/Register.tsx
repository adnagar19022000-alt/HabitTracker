import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const RegisterSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Use at least 8 characters")
    .required("Password is required"),
});

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Start your ledger
          </h1>
          <p className="mt-2 text-sm text-slate">
            Track habits, build streaks, see your progress.
          </p>
        </div>

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setFormError(null);
            try {
              await register(values.name, values.email, values.password);
              toast.success("Account created successfully!");
              navigate("/dashboard");
            } catch (err) {
              const message = err instanceof Error ? err.message : "Registration failed";
              toast.error(message);
              setFormError(message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="field-label">Name</label>
                <Field id="name" name="name" type="text" className="field-input" placeholder="Jane Doe" />
                <ErrorMessage name="name" component="p" className="field-error" />
              </div>

              <div>
                <label htmlFor="email" className="field-label">Email</label>
                <Field id="email" name="email" type="email" className="field-input" placeholder="you@example.com" />
                <ErrorMessage name="email" component="p" className="field-error" />
              </div>

              <div>
                <label htmlFor="password" className="field-label">Password</label>
                <div className="relative">
                  <Field 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    className="field-input pr-12" 
                    placeholder="At least 8 characters" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate hover:text-ink focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <ErrorMessage name="password" component="p" className="field-error" />
              </div>

              {formError && (
                <p className="rounded-md bg-clay/10 px-3 py-2 text-sm text-clay-dark">
                  {formError}
                </p>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? "Creating account…" : "Create account"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-slate">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-ink underline underline-offset-2">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}