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
