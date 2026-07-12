import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  Plus,
  MoreVertical,
  Users,
  Network,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Layers,
  Contact,
  Tag,
  Settings2,
  Box,
  Edit2,
  X,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

interface Department {
  id: string;
  name: string;
  head: string;
  headEmail: string;
  parent: string | null;
  status: string;
  employeeCount: number;
}

interface DeptFormData {
  name: string;
  head: string;
  parent: string;
  status: string;
}

interface AssetCategory {
  id: string;
  name: string;
  description: string;
  customFields: string[];
  assetCount: number;
  status: string;
}

export default function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState("Departments");

  // --- Tab A States (Departments) ---
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Modal / CRUD States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState<DeptFormData>({
    name: "",
    head: "",
    parent: "",
    status: "Active",
  });

  // --- Tab B States (Categories) ---
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const [searchTermCategories, setSearchTermCategories] = useState("");

  // ==========================================
  // BACKEND INTEGRATION: Fetch Departments (Tab A)
  // ==========================================
  useEffect(() => {
    if (activeTab !== "Departments") return;

    const fetchDepartments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with your actual backend API call
        // const response = await fetch('/api/departments');

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockDepts: Department[] = [
          { id: "D-HQ", name: "Headquarters", head: "Admin Team", headEmail: "bhavesh.cool2005@gmail.com", parent: null, status: "Active", employeeCount: 120 },
          { id: "D-ENG", name: "Engineering", head: "Bhavesh Sabnani", headEmail: "bhavesh.sabnani2005@gmail.com", parent: "Headquarters", status: "Active", employeeCount: 45 },
          { id: "D-MKT", name: "Marketing", head: "Sarah Jenkins", headEmail: "sarah.j@example.com", parent: "Headquarters", status: "Active", employeeCount: 18 },
          { id: "D-LEG", name: "Legal & Compliance", head: "Unassigned", headEmail: "", parent: "Headquarters", status: "Inactive", employeeCount: 0 },
        ];

        setDepartments(mockDepts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load departments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [activeTab]);

  // ==========================================
  // BACKEND INTEGRATION: Fetch Categories (Tab B)
  // ==========================================
  useEffect(() => {
    if (activeTab !== "Categories") return;

    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setErrorCategories(null);

      try {
        // TODO: Replace with your actual backend API call
        // const response = await fetch('/api/categories');

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockCategories: AssetCategory[] = [
          { id: "CAT-01", name: "Electronics & IT", description: "Laptops, monitors, servers, and peripherals.", customFields: ["Warranty Expiry", "OS Version", "MAC Address"], assetCount: 450, status: "Active" },
          { id: "CAT-02", name: "Vehicles", description: "Company cars, delivery vans, and trucks.", customFields: ["License Plate", "Mileage", "Last Service Date"], assetCount: 24, status: "Active" },
          { id: "CAT-03", name: "Office Furniture", description: "Desks, ergonomic chairs, and conference tables.", customFields: ["Material", "Dimensions"], assetCount: 850, status: "Active" },
          { id: "CAT-04", name: "Heavy Machinery", description: "Warehouse forklifts and manufacturing equipment.", customFields: ["Load Capacity", "Safety Inspection Date"], assetCount: 12, status: "Inactive" },
        ];

        setCategories(mockCategories);
      } catch (err) {
        setErrorCategories(err instanceof Error ? err.message : "Failed to load categories.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [activeTab]);

  // ==========================================
  // CRUD ACTIONS (Departments)
  // ==========================================
  const handleOpenModal = (dept: Department | null = null) => {
    setEditingDept(dept);
    setFormData(
      dept
        ? { name: dept.name, head: dept.head, parent: dept.parent ?? "", status: dept.status }
        : { name: "", head: "", parent: "", status: "Active" }
    );
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return; // Prevent empty names
    if (editingDept) {
      // Update existing department
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editingDept.id
            ? { ...d, ...formData, parent: formData.parent || null }
            : d
        )
      );
    } else {
      // Create new department
      setDepartments((prev) => [
        ...prev,
        {
          id: `D-${Date.now()}`,
          name: formData.name,
          head: formData.head || "Unassigned",
          headEmail: "",
          parent: formData.parent || null,
          status: formData.status,
          employeeCount: 0,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "Active" ? "Inactive" : "Active" }
          : d
      )
    );
  };

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  const filteredDepartments = departments.filter(
    (dept) => dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(
    (cat) => cat.name.toLowerCase().includes(searchTermCategories.toLowerCase()) || cat.description.toLowerCase().includes(searchTermCategories.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-8">
      {/* --- Page Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-blue-500/20">Admin Only</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Organization Setup</h1>
          <p className="text-sm text-gray-400 mt-1">Manage master data, departments, and employee directory.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => activeTab === "Departments" ? handleOpenModal() : undefined}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
        >
          <Plus size={18} />
          {activeTab === "Departments" && "New Department"}
          {activeTab === "Categories" && "New Category"}
          {activeTab === "Employees" && "Invite Employee"}
        </motion.button>
      </div>

      {/* --- Global Tabs --- */}
      <div className="flex p-1 bg-[#161925] border border-zinc-800/80 rounded-xl w-full overflow-x-auto">
        {([{ id: "Departments", icon: Building2, label: "Departments" }, { id: "Categories", icon: Layers, label: "Asset Categories" }, { id: "Employees", icon: Contact, label: "Employee Directory" }] as const).map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-zinc-800 text-white shadow-sm" : "text-gray-400 hover:text-gray-200 hover:bg-zinc-800/50"}`}>
            <tab.icon size={16} className={activeTab === tab.id ? "text-blue-400" : "text-gray-500"} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================== */}
      {/* TAB A: DEPARTMENT MANAGEMENT               */}
      {/* ========================================== */}
      {activeTab === "Departments" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#161925] border border-zinc-800/80 rounded-2xl p-4 shadow-xl">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input type="text" placeholder="Search departments or heads..." className="w-full bg-[#0f111a] border border-zinc-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4 text-red-400">
              <AlertCircle size={20} /><p className="text-sm">{error}</p>
            </div>
          )}

          <div className="bg-[#161925] border border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-[#161925]/50">
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department Name</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department Head</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hierarchy</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Employees</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {isLoading && !error && Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="animate-pulse">
                      <td className="py-4 px-6"><div className="h-5 bg-zinc-800 rounded w-32"></div></td>
                      <td className="py-4 px-6 flex items-center gap-3"><div className="w-8 h-8 bg-zinc-800 rounded-full"></div><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                      <td className="py-4 px-6"><div className="h-4 bg-zinc-800 rounded w-28"></div></td>
                      <td className="py-4 px-6"><div className="h-4 bg-zinc-800 rounded w-8 mx-auto"></div></td>
                      <td className="py-4 px-6"><div className="h-6 bg-zinc-800 rounded-full w-16"></div></td>
                      <td className="py-4 px-6 text-right"><div className="h-6 w-6 bg-zinc-800 rounded-lg ml-auto"></div></td>
                    </tr>
                  ))}
                  {!isLoading && !error && (
                    <AnimatePresence>
                      {filteredDepartments.map((dept) => (
                        <motion.tr key={dept.id} variants={itemVariants} initial="hidden" animate="show" exit="hidden" layout className="hover:bg-zinc-800/30 transition-colors group">
                          <td className="py-4 px-6"><p className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">{dept.name}</p><p className="text-xs text-zinc-500 font-mono mt-0.5">{dept.id}</p></td>
                          <td className="py-4 px-6">{dept.headEmail ? (<div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-700 flex items-center justify-center text-xs font-bold text-blue-200">{dept.head.charAt(0)}</div><div><p className="text-sm font-medium text-gray-200">{dept.head}</p><p className="text-[10px] text-zinc-500">{dept.headEmail}</p></div></div>) : (<span className="text-sm text-gray-500 italic">Unassigned</span>)}</td>
                          <td className="py-4 px-6">{dept.parent ? (<div className="flex items-center gap-2 text-sm text-gray-400"><Network size={14} className="text-zinc-500" />{dept.parent}</div>) : (<span className="text-sm text-gray-600">- Top Level -</span>)}</td>
                          <td className="py-4 px-6 text-center"><div className="inline-flex items-center gap-1.5 bg-[#0f111a] border border-zinc-800 px-3 py-1 rounded-lg text-sm text-gray-300"><Users size={14} className="text-zinc-500" />{dept.employeeCount}</div></td>
                          <td className="py-4 px-6">
                            <button onClick={() => toggleStatus(dept.id)} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors ${dept.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"}`}>
                              {dept.status === "Active" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}{dept.status}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleOpenModal(dept)} className="text-gray-500 hover:text-blue-400 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors" title="Edit Department"><Edit2 size={16} /></button>
                              <button className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"><MoreVertical size={18} /></button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================== */}
      {/* TAB B: ASSET CATEGORY MANAGEMENT           */}
      {/* ========================================== */}
      {activeTab === "Categories" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#161925] border border-zinc-800/80 rounded-2xl p-4 shadow-xl">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input type="text" placeholder="Search categories..." className="w-full bg-[#0f111a] border border-zinc-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600" value={searchTermCategories} onChange={(e) => setSearchTermCategories(e.target.value)} />
            </div>
          </div>

          {errorCategories && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4 text-red-400">
              <AlertCircle size={20} /><p className="text-sm">{errorCategories}</p>
            </div>
          )}

          <div className="bg-[#161925] border border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-[#161925]/50">
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category Details</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/3">Custom Fields (Configured)</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Total Assets</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {isLoadingCategories && !errorCategories && Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={`cat-skeleton-${idx}`} className="animate-pulse">
                      <td className="py-4 px-6"><div className="h-5 bg-zinc-800 rounded w-32 mb-2"></div><div className="h-3 bg-zinc-800 rounded w-48"></div></td>
                      <td className="py-4 px-6 flex gap-2"><div className="h-6 w-20 bg-zinc-800 rounded-full"></div><div className="h-6 w-24 bg-zinc-800 rounded-full"></div></td>
                      <td className="py-4 px-6"><div className="h-4 bg-zinc-800 rounded w-8 mx-auto"></div></td>
                      <td className="py-4 px-6"><div className="h-6 bg-zinc-800 rounded-full w-16"></div></td>
                      <td className="py-4 px-6 text-right"><div className="h-6 w-6 bg-zinc-800 rounded-lg ml-auto"></div></td>
                    </tr>
                  ))}
                  {!isLoadingCategories && !errorCategories && (
                    <AnimatePresence>
                      {filteredCategories.map((cat) => (
                        <motion.tr key={cat.id} variants={itemVariants} initial="hidden" animate="show" exit="hidden" layout className="hover:bg-zinc-800/30 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 p-2 bg-zinc-800/50 rounded-lg text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors"><Layers size={18} /></div>
                              <div><p className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">{cat.name}</p><p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">{cat.description}</p><p className="text-[10px] text-zinc-600 font-mono mt-1">{cat.id}</p></div>
                            </div>
                          </td>
                          <td className="py-4 px-6">{cat.customFields && cat.customFields.length > 0 ? (<div className="flex flex-wrap gap-2">{cat.customFields.map((field, i) => (<span key={i} className="inline-flex items-center gap-1 bg-[#0f111a] border border-zinc-700 px-2.5 py-1 rounded-md text-[11px] text-gray-300"><Tag size={10} className="text-zinc-500" />{field}</span>))}</div>) : (<span className="text-xs text-zinc-600 italic">No custom fields</span>)}</td>
                          <td className="py-4 px-6 text-center"><div className="inline-flex items-center gap-1.5 bg-[#0f111a] border border-zinc-800 px-3 py-1 rounded-lg text-sm text-gray-300"><Box size={14} className="text-zinc-500" />{cat.assetCount}</div></td>
                          <td className="py-4 px-6"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cat.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>{cat.status === "Active" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}{cat.status}</span></td>
                          <td className="py-4 px-6 text-right"><button className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors" title="Configure Category"><Settings2 size={18} /></button></td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================== */}
      {/* DEPARTMENT MODAL                           */}
      {/* ========================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 24 }}
              className="bg-[#161925] border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">
                  {editingDept ? "Edit Department" : "Create Department"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Department Name
                  </label>
                  <input
                    className="w-full bg-[#0f111a] border border-zinc-700 text-white text-sm p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                    placeholder="e.g. Engineering"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Department Head
                  </label>
                  <input
                    className="w-full bg-[#0f111a] border border-zinc-700 text-white text-sm p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                    placeholder="e.g. John Doe"
                    value={formData.head}
                    onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Parent Department (Hierarchy)
                  </label>
                  <select
                    className="w-full bg-[#0f111a] border border-zinc-700 text-white text-sm p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  >
                    <option value="">No Parent (Top Level)</option>
                    {departments
                      .filter((d) => d.id !== editingDept?.id)
                      .map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    className="w-full bg-[#0f111a] border border-zinc-700 text-white text-sm p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSave}
                  disabled={!formData.name.trim()}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    formData.name.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  {editingDept ? "Save Changes" : "Create Department"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placeholder for Tab C */}
      {activeTab === "Employees" && (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-gray-500">
          <Contact size={40} className="mb-4 opacity-20" />
          <p>Employee Directory (Tab C) will be built here.</p>
        </div>
      )}
    </motion.div>
  );
}
