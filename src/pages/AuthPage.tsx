import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthSwitch, type AuthSwitchSubmitEvent } from "@/components/ui/auth-switch";
import {
  apiSignIn,
  apiSignUp,
  saveSession,
  type AuthPayload,
} from "@/lib/auth";

type AuthMode = "signin" | "signup";

/**
 * Route component for /signin and /signup.
 *
 * On a successful auth call it navigates to /Dashboard using `useNavigate`,
 * as requested. The toggle between the two screens is done with <Link>
 * (handled inside <AuthSwitch> via the `otherTo` prop).
 */
export default function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (data: AuthSwitchSubmitEvent) => {
    setError(undefined);
    setLoading(true);
    try {
      const payload: AuthPayload = {
        email: data.email,
        password: data.password,
        name: data.name,
      };

      // Call the backend. The returned token is the "code from backend"
      // you mentioned — it gets persisted so /Dashboard stays guarded.
      const session =
        data.mode === "signin" ? await apiSignIn(payload) : await apiSignUp(payload);

      saveSession(session);

      // Redirect to the dashboard after sign in / sign up.
      navigate("/Dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSwitch
      mode={mode}
      otherTo={mode === "signin" ? "/signup" : "/signin"}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
