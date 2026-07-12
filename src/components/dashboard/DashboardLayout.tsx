import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import Sidebar from "@/components/dashboard/Sidebar";
import TopHeader from "@/components/dashboard/TopHeader";

export type ViewName = "Dashboard" | "AssetDirectory" | "AllocationsTransfers" | "ResourceBooking";

/** Maps sidebar hrefs to internal view names. */
const VIEW_ROUTES: Record<string, ViewName> = {
  "/Dashboard": "Dashboard",
  "/asset-directory": "AssetDirectory",
  "/allocations": "AllocationsTransfers",
  "/resource-booking": "ResourceBooking",
};

export interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  /** Currently active internal view (drives sidebar active state). */
  currentView?: ViewName;
  /** Called when the user clicks a sidebar item that maps to an internal view. */
  onViewChange?: (view: ViewName) => void;
}

/**
 * Dark-mode dashboard shell with animated sidebar drawer, header, and children.
 *
 * Sidebar slides in/out on mobile via AnimatePresence.
 * Children animate with a fade+slide-up entrance keyed by the current route.
 */
export default function DashboardLayout({
  children,
  className,
  currentView = "Dashboard",
  onViewChange,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /** Resolve sidebar clicks: internal views switch state, others navigate. */
  const handleSidebarNavigate = (href: string) => {
    const view = VIEW_ROUTES[href];
    if (view && onViewChange) {
      onViewChange(view);
    } else {
      navigate(href);
    }
    setMobileOpen(false);
  };

  /** The href that should appear "active" in the sidebar. */
  const activeHref =
    Object.entries(VIEW_ROUTES).find(([, v]) => v === currentView)?.[0] ??
    location.pathname;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* ── Mobile backdrop ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar (slide on mobile, static on desktop) ─────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed inset-y-0 left-0 z-50 lg:hidden"
          >
            <Sidebar
              active={activeHref}
              onNavigate={handleSidebarNavigate}
              collapsed={false}
              onCollapsedChange={() => {}}
              className="h-screen"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar (always visible, animated width via CSS) */}
      <div className="hidden lg:block">
        <Sidebar
          active={activeHref}
          onNavigate={handleSidebarNavigate}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          className="h-screen"
        />
      </div>

      {/* ── Main area (header + content) ────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader onMobileMenuToggle={() => setMobileOpen((o) => !o)} />

        {/* ── Scrollable content (route-keyed transition) ───── */}
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 sm:p-6",
            className
          )}
        >
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring" as const, stiffness: 350, damping: 30 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
