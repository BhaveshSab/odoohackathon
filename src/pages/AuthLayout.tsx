import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Shared background for the /signin and /signup routes.
 * The actual card is rendered by <Outlet/> (-> AuthPage -> AuthSwitch).
 */
export default function AuthLayout() {
  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-slate-50 p-4 sm:p-6">
      {/* Animated decorative blobs */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-purple-300/40 blur-3xl"
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl"
        animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative w-full max-w-5xl">
        <Outlet />
      </div>
    </main>
  );
}
