import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowUpRight,
  Briefcase,
  LogOut,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import DashboardLayout, { type ViewName } from "@/components/dashboard/DashboardLayout";
import SalesOverview from "@/components/dashboard/SalesOverview";
import AssetDirectory from "@/components/dashboard/AssetDirectory";
import AllocationsTransfers from "@/components/dashboard/AllocationsTransfers";
import ResourceBooking from "@/components/dashboard/ResourceBooking";
import Maintenance from "@/components/dashboard/Maintenance";
import AssetAudits from "@/components/dashboard/AssetAudits";
import ReportsAnalytics from "@/components/dashboard/ReportsAnalytics";
import { clearSession, getSession, type AuthResponse } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                  */
/* ------------------------------------------------------------------ */

const headingVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  },
};

const statsGridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  },
};

const placeholderVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.35, type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const [session, setSession] = useState<AuthResponse | null>(getSession());
  const [currentView, setCurrentView] = useState<ViewName>("Dashboard");

  useEffect(() => {
    setSession(getSession());
  }, []);

  if (!session) return <Navigate to="/signin" replace />;

  const handleSignOut = () => {
    clearSession();
    setSession(null);
  };

  const firstName = session.user.name.split(" ")[0];

  const stats = [
    { label: "Total Assets", value: "$1,284,930", delta: "+12.5%", icon: Wallet },
    { label: "Active Holdings", value: "37", delta: "+3", icon: Briefcase },
    { label: "Monthly Return", value: "+8.4%", delta: "+1.2%", icon: TrendingUp },
  ];

  return (
    <DashboardLayout
      currentView={currentView}
      onViewChange={setCurrentView}
    >
      {currentView === "Dashboard" && (
        <>
      {/* ── Heading ────────────────────────────────────────── */}
      <motion.div
        variants={headingVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Here&apos;s what&apos;s happening with your portfolio today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-zinc-400 sm:inline">
            Signed in as{" "}
            <span className="font-medium text-white">{session.user.email}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            asChild
          >
            <Link to="/signin">
              <LogOut className="h-4 w-4" />
              Sign out
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* ── Stat cards (staggered) ────────────────────────── */}
      <motion.div
        variants={statsGridVariants}
        initial="hidden"
        animate="visible"
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={statCardVariants}
            whileHover={{ y: -2, transition: { type: "spring", stiffness: 400 } }}
            className="cursor-default rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">{s.label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                  {s.value}
                </p>
              </div>
              <motion.span
                whileHover={{ scale: 1.15, rotate: 8 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-500"
              >
                <s.icon className="h-5 w-5" />
              </motion.span>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-400"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              {s.delta} vs last month
            </motion.p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Sales Overview Chart ──────────────────────────── */}
      <motion.div
        variants={placeholderVariants}
        initial="hidden"
        animate="visible"
        className="mt-6"
      >
        <SalesOverview />
      </motion.div>
        </>
      )}

      {currentView === "AssetDirectory" && <AssetDirectory />}

      {currentView === "AllocationsTransfers" && <AllocationsTransfers />}

      {currentView === "ResourceBooking" && <ResourceBooking />}

      {currentView === "Maintenance" && <Maintenance />}

      {currentView === "AssetAudits" && <AssetAudits />}

      {currentView === "ReportsAnalytics" && <ReportsAnalytics />}
    </DashboardLayout>
  );
}
