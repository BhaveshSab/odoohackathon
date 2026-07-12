import { useState } from "react";
import {
  ArrowLeftRight,
  BarChart3,
  Building2,
  CalendarCheck,
  ChevronDown,
  ChevronLeft,
  ClipboardCheck,
  FolderTree,
  LayoutDashboard,
  ScrollText,
  Wrench,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  badge?: string;
  children?: { label: string; href: string }[];
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const SECTIONS: NavSection[] = [
  {
    heading: "MAIN",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/Dashboard" },
      { label: "Asset Directory", icon: FolderTree, href: "/asset-directory" },
    ],
  },
  {
    heading: "OPERATIONS",
    items: [
      { label: "Allocations & Transfers", icon: ArrowLeftRight, href: "/allocations" },
      { label: "Resource Booking", icon: CalendarCheck, href: "/resource-booking" },
      { label: "Maintenance", icon: Wrench, href: "/maintenance" },
    ],
  },
  {
    heading: "COMPLIANCE & DATA",
    items: [
      { label: "Asset Audits", icon: ClipboardCheck, href: "/audits" },
      { label: "Reports & Analytics", icon: BarChart3, href: "/reports" },
    ],
  },
  {
    heading: "SYSTEM",
    items: [
      { label: "Organization Setup", icon: Building2, href: "/org-setup", badge: "Admin" },
      { label: "Activity Logs", icon: ScrollText, href: "/activity-logs", badge: "Admin" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                  */
/* ------------------------------------------------------------------ */

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 500, damping: 30 },
  },
};

const dropdownVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.15 },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 20 },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: string;
  onNavigate?: (href: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({
  className,
  active = "/Dashboard",
  onNavigate,
  collapsed = false,
  onCollapsedChange,
  ...props
}: SidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) =>
    setOpenDropdown((prev) => (prev === label ? null : label));

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-zinc-800 bg-zinc-950 transition-[width] duration-200",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {/* ── Logo (spring-in) ──────────────────────────────────── */}
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        className="flex h-14 items-center gap-2.5 border-b border-zinc-800 px-4"
      >
        <motion.span
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white"
        >
          <Zap className="h-4 w-4" />
        </motion.span>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              key="brand-text"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-base font-semibold tracking-tight text-white"
            >
              AssetFlow
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Navigation (staggered items) ─────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {SECTIONS.map((section, sIdx) => (
          <motion.div
            key={section.heading}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 + sIdx * 0.06 }}
            className="mb-6 first:mb-4"
          >
            {/* Section heading — fade in / out with collapse */}
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.h3
                  key={section.heading}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-500"
                >
                  {section.heading}
                </motion.h3>
              )}
            </AnimatePresence>

            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = item.href === active;
                const hasChildren = item.children && item.children.length > 0;
                const isOpen = openDropdown === item.label;
                const Icon = item.icon;

                return (
                  <motion.li
                    key={item.label}
                    variants={itemVariants}
                    layout
                  >
                    <motion.button
                      type="button"
                      onClick={() => {
                        if (hasChildren) return toggleDropdown(item.label);
                        if (item.href) onNavigate?.(item.href);
                      }}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 8 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0",
                            isActive
                              ? "text-white"
                              : "text-zinc-500 group-hover:text-zinc-300"
                          )}
                        />
                      </motion.div>

                      <AnimatePresence mode="wait">
                        {!collapsed && (
                          <motion.span
                            key={`label-${item.label}`}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -4 }}
                            transition={{ duration: 0.12 }}
                            className="flex-1 text-left"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Badge */}
                      <AnimatePresence mode="wait">
                        {!collapsed && item.badge && (
                          <motion.span
                            key={`badge-${item.label}`}
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400"
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Chevron */}
                      <AnimatePresence mode="wait">
                        {!collapsed && hasChildren && (
                          <motion.div
                            key={`chev-${item.label}`}
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          >
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 text-zinc-500 transition-transform duration-200",
                                isOpen && "rotate-180"
                              )}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* ── Dropdown children (AnimatePresence) ──── */}
                    <AnimatePresence>
                      {hasChildren && isOpen && !collapsed && (
                        <motion.ul
                          key={`drop-${item.label}`}
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="mt-1 overflow-hidden space-y-0.5 pl-10"
                        >
                          {item.children!.map((child) => (
                            <motion.li
                              key={child.label}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => onNavigate?.(child.href)}
                                className="w-full rounded-md px-3 py-1.5 text-left text-sm text-zinc-500 transition-colors hover:bg-zinc-800/40 hover:text-zinc-200"
                              >
                                {child.label}
                              </button>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </nav>

      {/* ── Collapse toggle (spin on click) ─────────────────── */}
      <div className="border-t border-zinc-800 p-3">
        <motion.button
          type="button"
          onClick={() => onCollapsedChange?.(!collapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: 90 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex w-full items-center justify-center rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800/60 hover:text-zinc-200"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </motion.button>
      </div>
    </aside>
  );
}
