import { useState } from "react";

import { AuthSwitch, type AuthSwitchSubmitEvent } from "@/components/ui/auth-switch";

export default function App() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: AuthSwitchSubmitEvent) => {
    // Simulate a network request — replace with your real auth call.
    setLoading(true);
    try {
      console.log(`${data.mode} submitted`, {
        email: data.email,
        name: data.name,
      });
      await new Promise((r) => setTimeout(r, 900));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-slate-50 p-4 sm:p-6">
      {/* soft decorative blobs in the page background */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-purple-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl" />

      <AuthSwitch
        defaultMode="signup"
        loading={loading}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
