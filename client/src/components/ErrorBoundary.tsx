import { Component, type ReactNode } from "react";

// TypeScript types for the component's props and state
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  // Initial state — no error
  state: State = { hasError: false, error: null };

  // React calls this automatically when any CHILD component throws an error.
  // It's like a try-catch but for React components.
  // We return the new state — "yes there's an error, here it is."
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    // If an error was caught, show a friendly error screen
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-paper px-6">
          <div className="card max-w-md text-center">
            <p className="text-4xl">⚠️</p>
            <h2 className="mt-4 font-display text-xl font-semibold">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-slate">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-6"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    // If no error, render children normally (your entire app)
    return this.props.children;
  }
}