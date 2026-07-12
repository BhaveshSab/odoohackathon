import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import DashboardLayout, { type ViewName } from "@/components/dashboard/DashboardLayout";
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

/* Quick-action string → ViewName mapping */
const NAVIGATE_MAP: Record<string, ViewName> = {
  organization: "OrganizationSetup",
  booking: "ResourceBooking",
  maintenance: "Maintenance",
  allocations: "AllocationsTransfers",
  transfers: "AllocationsTransfers",
  register: "AssetDirectory",
  assets: "AssetDirectory",
  activity: "AssetAudits",
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

  /** Map quick-action strings from AdminDashboard to ViewName. */
  const handleNavigate = (screen: string) => {
    const view = NAVIGATE_MAP[screen];
    if (view) setCurrentView(view);
  };

  return (
    <DashboardLayout
      currentView={currentView}
      onViewChange={setCurrentView}
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
