import { Outlet } from "react-router-dom";

/**
 * Shared background for the /signin and /signup routes.
 * The actual card is rendered by <Outlet/> (-> AuthPage -> AuthSwitch).
 */
export default function AuthLayout() {
  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-slate-50 p-4 sm:p-6">
      {/* soft decorative blobs */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-purple-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl" />
      <div className="relative w-full max-w-5xl">
        <Outlet />
      </div>
    </main>
  );
}
