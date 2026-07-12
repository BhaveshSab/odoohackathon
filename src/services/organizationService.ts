/**
 * Organization Service Layer
 * 
 * Centralized service for all Organization Setup CRUD operations.
 * Each function follows RESTful conventions and includes TODO comments
 * for backend integration.
 * 
 * Authentication: Every function should pass the user's auth token
 * to the backend. Since this is an Admin-only screen, the backend
 * must verify the user's role before allowing mutations.
 */

// =============================================
// TYPES
// =============================================

export interface Department {
  id: string;
  name: string;
  head: string;
  headEmail: string;
  parent: string | null;
  status: string;
  employeeCount: number;
}

export interface AssetCategory {
  id: string;
  name: string;
  description: string;
  customFields: string[];
  assetCount: number;
  status: string;
}

export interface DeptFormData {
  name: string;
  head: string;
  parent: string;
  status: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  customFields: string;
  status: string;
}

// =============================================
// DEPARTMENT API
// =============================================

/**
 * Fetches all departments.
 * GET /api/departments
 */
export async function fetchDepartments(): Promise<Department[]> {
  // TODO: Replace with: const token = getAuthToken();
  // const response = await axios.get('/api/departments', { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 1200));
  return [
    { id: "D-HQ", name: "Headquarters", head: "Admin Team", headEmail: "bhavesh.cool2005@gmail.com", parent: null, status: "Active", employeeCount: 120 },
    { id: "D-ENG", name: "Engineering", head: "Bhavesh Sabnani", headEmail: "bhavesh.sabnani2005@gmail.com", parent: "Headquarters", status: "Active", employeeCount: 45 },
    { id: "D-MKT", name: "Marketing", head: "Sarah Jenkins", headEmail: "sarah.j@example.com", parent: "Headquarters", status: "Active", employeeCount: 18 },
    { id: "D-LEG", name: "Legal & Compliance", head: "Unassigned", headEmail: "", parent: "Headquarters", status: "Inactive", employeeCount: 0 },
  ];
}

/**
 * Creates a new department.
 * POST /api/departments
 */
export async function createDepartment(data: DeptFormData): Promise<Department> {
  // TODO: Replace with:
  // const token = getAuthToken();
  // const response = await axios.post('/api/departments', data, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: `D-${Date.now()}`,
    name: data.name,
    head: data.head || "Unassigned",
    headEmail: "",
    parent: data.parent || null,
    status: data.status,
    employeeCount: 0,
  };
}

/**
 * Updates an existing department.
 * PATCH /api/departments/:id
 */
export async function updateDepartment(id: string, data: Partial<DeptFormData>): Promise<Department> {
  // TODO: Replace with:
  // const token = getAuthToken();
  // const response = await axios.patch(`/api/departments/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id,
    name: data.name ?? "",
    head: data.head ?? "Unassigned",
    headEmail: "",
    parent: data.parent ?? null,
    status: data.status ?? "Active",
    employeeCount: 0,
  };
}

/**
 * Toggles a department's status (Active <-> Inactive).
 * PATCH /api/departments/:id/status
 */
export async function toggleDepartmentStatus(id: string, currentStatus: string): Promise<string> {
  // TODO: Replace with:
  // const token = getAuthToken();
  // const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
  // const response = await axios.patch(`/api/departments/${id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data.status;

  await new Promise((resolve) => setTimeout(resolve, 300));
  return currentStatus === "Active" ? "Inactive" : "Active";
}

// =============================================
// ASSET CATEGORY API
// =============================================

/**
 * Fetches all asset categories.
 * GET /api/categories
 */
export async function fetchCategories(): Promise<AssetCategory[]> {
  // TODO: Replace with:
  // const token = getAuthToken();
  // const response = await axios.get('/api/categories', { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 1200));
  return [
    { id: "CAT-01", name: "Electronics & IT", description: "Laptops, monitors, servers, and peripherals.", customFields: ["Warranty Expiry", "OS Version", "MAC Address"], assetCount: 450, status: "Active" },
    { id: "CAT-02", name: "Vehicles", description: "Company cars, delivery vans, and trucks.", customFields: ["License Plate", "Mileage", "Last Service Date"], assetCount: 24, status: "Active" },
    { id: "CAT-03", name: "Office Furniture", description: "Desks, ergonomic chairs, and conference tables.", customFields: ["Material", "Dimensions"], assetCount: 850, status: "Active" },
    { id: "CAT-04", name: "Heavy Machinery", description: "Warehouse forklifts and manufacturing equipment.", customFields: ["Load Capacity", "Safety Inspection Date"], assetCount: 12, status: "Inactive" },
  ];
}

/**
 * Creates a new asset category.
 * POST /api/categories
 */
export async function createCategory(data: CategoryFormData): Promise<AssetCategory> {
  // TODO: Replace with:
  // const token = getAuthToken();
  // const response = await axios.post('/api/categories', { ...data, customFields: data.customFields.split(',').map(f => f.trim()).filter(Boolean) }, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: `CAT-${Date.now()}`,
    name: data.name,
    description: data.description || "",
    customFields: data.customFields.split(",").map((f) => f.trim()).filter(Boolean),
    assetCount: 0,
    status: data.status,
  };
}

/**
 * Updates an existing asset category.
 * PATCH /api/categories/:id
 */
export async function updateCategory(id: string, data: Partial<CategoryFormData>): Promise<AssetCategory> {
  // TODO: Replace with:
  // const token = getAuthToken();
  // const response = await axios.patch(`/api/categories/${id}`, { ...data, customFields: data.customFields?.split(',').map(f => f.trim()).filter(Boolean) }, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id,
    name: data.name ?? "",
    description: data.description ?? "",
    customFields: data.customFields?.split(",").map((f) => f.trim()).filter(Boolean) ?? [],
    assetCount: 0,
    status: data.status ?? "Active",
  };
}

/**
 * Toggles a category's status (Active <-> Inactive).
 * PATCH /api/categories/:id/status
 */
export async function toggleCategoryStatus(id: string, currentStatus: string): Promise<string> {
  // TODO: Replace with:
  // const token = getAuthToken();
  // const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
  // const response = await axios.patch(`/api/categories/${id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data.status;

  await new Promise((resolve) => setTimeout(resolve, 300));
  return currentStatus === "Active" ? "Inactive" : "Active";
}
