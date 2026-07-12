/**
 * Asset Services API
 *
 * This file contains all backend API calls for the AssetFlow application.
 * Each function is a placeholder ready to be connected to your real backend.
 *
 * To connect:
 * 1. Install axios:  npm install axios
 * 2. Import it:     import axios from 'axios';
 * 3. Replace the mock return with your real endpoint call.
 */

// =============================================
// ASSETS API
// =============================================

export interface Asset {
  id: string;
  name: string;
  assetTag: string;
  category: string;
  location: string;
  status: string;
}

/**
 * Fetches the full asset list from the backend.
 *
 * TODO: Replace the mock data below with:
 *   const response = await axios.get('YOUR_BACKEND_URL/api/assets');
 *   return response.data;
 */
export async function getAssets(): Promise<Asset[]> {
  // --- Simulated API call (remove when connecting real backend) ---
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    { id: "AF-001", name: "MacBook Pro M2", assetTag: "AF-001", category: "Electronics", location: "HQ - Floor 2", status: "Available" },
    { id: "AF-002", name: "Delivery Van (Ford Transit)", assetTag: "AF-002", category: "Vehicles", location: "Warehouse A", status: "Allocated" },
    { id: "AF-003", name: 'Dell UltraSharp 27"', assetTag: "AF-003", category: "Electronics", location: "HQ - Floor 3", status: "Under Maintenance" },
    { id: "AF-004", name: "Ergonomic Office Chair", assetTag: "AF-004", category: "Furniture", location: "HQ - Floor 2", status: "Available" },
    { id: "AF-005", name: "Sony A7IV Camera", assetTag: "AF-005", category: "Equipment", location: "Media Room", status: "Allocated" },
    { id: "AF-006", name: "Conference Table", assetTag: "AF-006", category: "Furniture", location: "Room B2", status: "Available" },
  ];
  // ----------------------------------------------------------------
}

// =============================================
// ALLOCATIONS API
// =============================================

/**
 * Fetches all asset allocations from the backend.
 *
 * TODO: Replace the mock data below with:
 *   const response = await axios.get('YOUR_BACKEND_URL/api/allocations');
 *   return response.data;
 */
export async function getAllocations() {
  // --- Simulated API call (remove when connecting real backend) ---
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: "AL-101",
      assetName: "MacBook Pro M2",
      assetTag: "AF-001",
      assignee: "Priya Sharma",
      role: "Frontend Eng",
      returnDate: "2026-08-15",
      status: "Allocated",
      avatar: "PS",
    },
    {
      id: "AL-102",
      assetName: "Delivery Van",
      assetTag: "AF-002",
      assignee: "Logistics Dept",
      role: "Department",
      returnDate: "2026-07-10",
      status: "Overdue",
      avatar: "LD",
    },
    {
      id: "AL-103",
      assetName: "Sony A7IV Camera",
      assetTag: "AF-005",
      assignee: "Raj Patel",
      role: "Media Team",
      returnDate: "2026-07-20",
      status: "Transfer Pending",
      requester: "Amit Kumar",
      avatar: "RP",
    },
  ];
  // ----------------------------------------------------------------
}

/**
 * Allocates an asset to a user.
 *
 * TODO: Replace with:
 *   const response = await axios.post('YOUR_BACKEND_URL/api/allocations', payload);
 *   return response.data;
 */
export async function allocateAsset(payload: {
  assetId: string;
  assignee: string;
  returnDate: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, ...payload };
}

/**
 * Returns an allocated asset.
 *
 * TODO: Replace with:
 *   const response = await axios.post('YOUR_BACKEND_URL/api/allocations/:id/return');
 *   return response.data;
 */
export async function returnAsset(allocationId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, allocationId };
}

/**
 * Transfers an asset from one assignee to another.
 *
 * TODO: Replace with:
 *   const response = await axios.post('YOUR_BACKEND_URL/api/allocations/:id/transfer', payload);
 *   return response.data;
 */
export async function transferAsset(allocationId: string, newAssignee: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, allocationId, newAssignee };
}

// =============================================
// RESOURCE BOOKING API
// =============================================

export interface BookableResource {
  id: string;
  name: string;
  type: string;
  capacity: string;
  location: string;
}

export interface ResourceSlot {
  id: string;
  time: string;
  status: string;
  bookedBy?: string;
}

/**
 * Fetches all bookable resources (rooms, vehicles, equipment).
 *
 * TODO: Replace the mock data below with:
 *   const response = await axios.get('YOUR_BACKEND_URL/api/resources/bookable');
 *   return response.data;
 */
export async function getBookableResources(): Promise<BookableResource[]> {
  // --- Simulated API call (remove when connecting real backend) ---
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    { id: "R-01", name: "Conference Room A", type: "room", capacity: "12 People", location: "Floor 2" },
    { id: "R-02", name: "Delivery Van (Transit)", type: "vehicle", capacity: "1000kg", location: "Loading Bay" },
    { id: "R-03", name: "4K Projector Cart", type: "equipment", capacity: "N/A", location: "IT Dept" },
  ];
  // ----------------------------------------------------------------
}

/**
 * Fetches available time slots for a specific resource on a given date.
 *
 * TODO: Replace the mock data below with:
 *   const response = await axios.get('YOUR_BACKEND_URL/api/bookings', {
 *     params: { resourceId, date }
 *   });
 *   return response.data;
 */
export async function getResourceSlots(
  resourceId: string,
  date: number
): Promise<ResourceSlot[]> {
  // --- Simulated API call (remove when connecting real backend) ---
  await new Promise((resolve) => setTimeout(resolve, 500));

  void resourceId;
  void date;

  return [
    { id: "S1", time: "09:00 AM - 10:00 AM", status: "available" },
    { id: "S2", time: "10:00 AM - 11:00 AM", status: "booked", bookedBy: "Priya Sharma" },
    { id: "S3", time: "11:00 AM - 12:00 PM", status: "booked", bookedBy: "Amit Kumar" },
    { id: "S4", time: "12:00 PM - 01:00 PM", status: "available" },
    { id: "S5", time: "01:00 PM - 02:00 PM", status: "available" },
    { id: "S6", time: "02:00 PM - 03:00 PM", status: "available" },
  ];
  // ----------------------------------------------------------------
}

// =============================================
// MAINTENANCE API
// =============================================

export interface MaintenanceRequest {
  id: string;
  assetName: string;
  assetTag: string;
  issue: string;
  priority: string;
  status: string;
  requestedBy: string;
  date: string;
  technician?: string;
}

/**
 * Fetches all maintenance requests with status, priority, and assignment info.
 *
 * TODO: Replace the mock data below with:
 *   const response = await axios.get('YOUR_BACKEND_URL/api/maintenance');
 *   return response.data;
 */
export async function getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
  // --- Simulated API call (remove when connecting real backend) ---
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    { id: "REQ-082", assetName: "Sony A7IV Camera", assetTag: "AF-005", issue: "Lens mount is loose and throwing error 0x99. Needs recalibration.", priority: "High", status: "Pending", requestedBy: "Raj Patel", date: "2026-07-12" },
    { id: "REQ-081", assetName: "Delivery Van (Ford Transit)", assetTag: "AF-002", issue: "Check engine light on, strange noise from transmission.", priority: "High", status: "In Progress", requestedBy: "Logistics Dept", date: "2026-07-10", technician: "Mike Auto Services" },
    { id: "REQ-079", assetName: "MacBook Pro M2", assetTag: "AF-001", issue: "Battery expanding slightly, trackpad getting stiff.", priority: "Medium", status: "Approved", requestedBy: "Priya Sharma", date: "2026-07-08" },
    { id: "REQ-075", assetName: "Conference Table", assetTag: "AF-006", issue: "One leg is wobbly, needs tightening.", priority: "Low", status: "Resolved", requestedBy: "Admin Team", date: "2026-07-01" },
  ];
  // ----------------------------------------------------------------
}

// =============================================
// AUDIT CYCLES API
// =============================================

export interface AuditProgress {
  total: number;
  verified: number;
  missing: number;
  damaged: number;
}

export interface AuditCycle {
  id: string;
  title: string;
  scope: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: AuditProgress;
  auditors: string[];
}

/**
 * Fetches all audit cycles with progress tracking and discrepancy data.
 *
 * TODO: Replace the mock data below with:
 *   const response = await axios.get('YOUR_BACKEND_URL/api/audits');
 *   return response.data;
 */
export async function getAuditCycles(): Promise<AuditCycle[]> {
  // --- Simulated API call (remove when connecting real backend) ---
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    { id: "AUD-2026-Q3-01", title: "Q3 IT Equipment Verification", scope: "HQ - Floors 2 & 3", startDate: "2026-08-01", endDate: "2026-08-15", status: "In Progress", progress: { total: 240, verified: 185, missing: 2, damaged: 4 }, auditors: ["PS", "AK"] },
    { id: "AUD-2026-Q3-02", title: "Logistics Vehicle Fleet Check", scope: "Warehouse A & B", startDate: "2026-08-10", endDate: "2026-08-12", status: "Draft", progress: { total: 18, verified: 0, missing: 0, damaged: 0 }, auditors: ["LD"] },
    { id: "AUD-2026-Q2-01", title: "Q2 Office Furniture Audit", scope: "All HQ Branches", startDate: "2026-04-01", endDate: "2026-04-20", status: "Completed", progress: { total: 450, verified: 445, missing: 5, damaged: 12 }, auditors: ["JD", "PS", "RP"] },
  ];
  // ----------------------------------------------------------------
}

// =============================================
// ANALYTICS API
// =============================================

export interface AnalyticsData {
  kpis: {
    totalAssets: number;
    utilizationRate: number;
    maintenancePending: number;
    activeBookings: number;
  };
  utilizationTrend: { month: string; rate: number }[];
  departmentAllocations: { dept: string; count: number }[];
  assetStatus: { name: string; value: number; color: string }[];
  bookingHeatmap: { day: string; hour: string; intensity: number }[][];
}

/**
 * Fetches analytics data for the Reports & Analytics dashboard.
 *
 * TODO: Replace the mock data below with:
 *   const response = await axios.get('YOUR_BACKEND_URL/api/analytics', {
 *     params: { range: timeRange }
 *   });
 *   return response.data;
 */
export async function getAnalytics(timeRange: string): Promise<AnalyticsData> {
  // --- Simulated API call (remove when connecting real backend) ---
  await new Promise((resolve) => setTimeout(resolve, 800));
  void timeRange;

  return {
    kpis: { totalAssets: 1248, utilizationRate: 78, maintenancePending: 14, activeBookings: 45 },
    utilizationTrend: [
      { month: "Mar", rate: 65 }, { month: "Apr", rate: 68 }, { month: "May", rate: 72 },
      { month: "Jun", rate: 75 }, { month: "Jul", rate: 82 }, { month: "Aug", rate: 78 },
    ],
    departmentAllocations: [
      { dept: "Engineering", count: 420 }, { dept: "Sales", count: 210 },
      { dept: "Design", count: 180 }, { dept: "Marketing", count: 150 }, { dept: "HR & Admin", count: 95 },
    ],
    assetStatus: [
      { name: "Allocated", value: 850, color: "#3b82f6" }, { name: "Available", value: 310, color: "#10b981" },
      { name: "Maintenance", value: 65, color: "#f59e0b" }, { name: "Lost/Retired", value: 23, color: "#ef4444" },
    ],
    bookingHeatmap: Array.from({ length: 5 }, (_, dayIdx) =>
      Array.from({ length: 8 }, (_, hourIdx) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri"][dayIdx],
        hour: `${hourIdx + 9}AM`,
        intensity: Math.floor(Math.random() * 10),
      }))
    ),
  };
  // ----------------------------------------------------------------
}

// =============================================
// ORGANIZATION SETUP APIs
// =============================================
// DEPRECATED: Department & Category CRUD operations have been
// moved to src/services/organizationService.ts
// Import from there: import { fetchDepartments, createDepartment, ... } from '@/services/organizationService';
