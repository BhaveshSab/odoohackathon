import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import DashboardLayout, { type ViewName } from "@/components/dashboard/DashboardLayout";
import type { Role, SidebarProps } from "@/components/dashboard/Sidebar";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import AssetDirectory from "@/components/dashboard/AssetDirectory";
import AllocationsTransfers from "@/components/dashboard/AllocationsTransfers";
import ResourceBooking from "@/components/dashboard/ResourceBooking";
import Maintenance from "@/components/dashboard/Maintenance";
import AssetAudits from "@/components/dashboard/AssetAudits";
import ReportsAnalytics from "@/components/dashboard/ReportsAnalytics";
import OrganizationSetup from "@/components/dashboard/OrganizationSetup";
import { clearSession, getSession, type AuthResponse } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  Role resolver — email-based for now, replace with backend later    */
/* ------------------------------------------------------------------ */
const getUserRole = (email: string): Role => {
  if (email === "bhavesh.cool2005@gmail.com") return "ADMIN";
  if (email === "bhavesh.sabnani2005@gmail.com") return "ASSET_MANAGER";
  return "EMPLOYEE";
};

/* ------------------------------------------------------------------ */
/*  Navigation mapping — sidebar pageIds + quick-action strings       */
/* ------------------------------------------------------------------ */
const NAVIGATE_MAP: Record<string, ViewName> = {
  // Sidebar pageIds
  dashboard: "Dashboard",
  "asset-directory": "AssetDirectory",
  allocations: "AllocationsTransfers",
  booking: "ResourceBooking",
  maintenance: "Maintenance",
  audits: "AssetAudits",
  reports: "ReportsAnalytics",
  organization: "OrganizationSetup",
  activity: "AssetAudits",
  // Quick-action strings from dashboards
  transfers: "AllocationsTransfers",
  register: "AssetDirectory",
  assets: "AssetDirectory",
  "my-assets": "AssetDirectory",
  "my-bookings": "ResourceBooking",
  "my-maintenance": "Maintenance",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Dashboard() {
  const [session, setSession] = useState<AuthResponse | null>(getSession());
  const [currentView, setCurrentView] = useState<ViewName>("Dashboard");
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    setSession(getSession());
  }, []);

  if (!session) return <Navigate to="/signin" replace />;

  const handleSignOut = () => {
    clearSession();
    setSession(null);
  };

  /** Sidebar nav + quick-action strings → ViewName */
  const handleNavigate = (pageId: string) => {
    setActivePage(pageId);
    const view = NAVIGATE_MAP[pageId];
    if (view) setCurrentView(view);
  };

  /** Build sidebar props from session */
  const role = getUserRole(session.user.email);
  const sidebarProps: SidebarProps = {
    user: {
      name: session.user.name,
      email: session.user.email,
      role,
    },
    onSignOut: handleSignOut,
    activePage,
    onNavigate: handleNavigate,
    badges: {
      pendingTransfers: 0,
      maintenanceRequests: 0,
      overdueReturns: 0,
      notifications: 0,
    },
  };

  return (
    <DashboardLayout
      currentView={currentView}
      sidebarProps={sidebarProps}
    >
      {currentView === "Dashboard" && (
        session.user.email === "bhavesh.sabnani2005@gmail.com"
          ? <ManagerDashboard onNavigate={handleNavigate} onSignOut={handleSignOut} />
          : session.user.email === "bhavesh@gmail.com"
            ? <EmployeeDashboard onNavigate={handleNavigate} onSignOut={handleSignOut} />
            : <AdminDashboard onNavigate={handleNavigate} onSignOut={handleSignOut} />
      )}

      {currentView === "AssetDirectory" && <AssetDirectory />}
      {currentView === "AllocationsTransfers" && <AllocationsTransfers />}
      {currentView === "ResourceBooking" && <ResourceBooking />}
      {currentView === "Maintenance" && <Maintenance />}
      {currentView === "AssetAudits" && <AssetAudits />}
      {currentView === "ReportsAnalytics" && <ReportsAnalytics />}
      {currentView === "OrganizationSetup" && <OrganizationSetup />}
    </DashboardLayout>
  );
}
