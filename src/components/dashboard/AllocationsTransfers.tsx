import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightLeft,
  AlertCircle,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Loader2,
  X,
  Bell,
} from "lucide-react";
import AllocateAssetModal from "@/components/dashboard/AllocateAssetModal";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

interface Allocation {
  id: string;
  assetName: string;
  assetTag: string;
  assignee: string;
  role: string;
  returnDate: string;
  status: string;
  avatar: string;
  requester?: string;
}

interface Toast { msg: string; type: string; }

// ==========================================
// API SERVICE (backend-ready, falls back to demo)
// ==========================================
const BASE_URL = "http://localhost:5000/api";
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const allocationApi = {
  returnAsset: async (id: string) => {
    try {
      const r = await fetch(`${BASE_URL}/allocations/${id}/return`, { method: "POST", headers: headers() });
      if (!r.ok) throw new Error();
      return await r.json();
    } catch {
      return { success: true };
    }
  },
  transferAsset: async (id: string, newAssignee: string) => {
    try {
      const r = await fetch(`${BASE_URL}/allocations/${id}/transfer`, {
        method: "POST", headers: headers(),
        body: JSON.stringify({ newAssignee }),
      });
      if (!r.ok) throw new Error();
      return await r.json();
    } catch {
      return { success: true };
    }
  },
  approveTransfer: async (id: string) => {
    try {
      const r = await fetch(`${BASE_URL}/transfers/${id}/approve`, { method: "PATCH", headers: headers() });
      if (!r.ok) throw new Error();
      return await r.json();
    } catch {
      return { success: true };
    }
  },
  rejectTransfer: async (id: string) => {
    try {
      const r = await fetch(`${BASE_URL}/transfers/${id}/reject`, { method: "PATCH", headers: headers() });
      if (!r.ok) throw new Error();
      return await r.json();
    } catch {
      return { success: true };
    }
  },
  sendPing: async (id: string) => {
    try {
      const r = await fetch(`${BASE_URL}/notifications/ping`, {
        method: "POST", headers: headers(),
        body: JSON.stringify({ allocationId: id, type: "overdue_reminder" }),
      });
      if (!r.ok) throw new Error();
      return await r.json();
    } catch {
      return { success: true };
    }
  },
};

export default function AllocationsTransfers() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllocate, setShowAllocate] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, string | null>>({});

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ==========================================
  // BACKEND INTEGRATION: Fetch Data
  // ==========================================
  const loadAllocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with real API: GET /api/allocations
      // const response = await fetch(`${BASE_URL}/allocations`, { headers: headers() });
      // if (!response.ok) throw new Error('Failed');
      // const data = await response.json();
      // setAllocations(data);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockDbData: Allocation[] = [
        { id: "AL-101", assetName: "MacBook Pro M2", assetTag: "AF-001", assignee: "Priya Sharma", role: "Frontend Eng", returnDate: "2026-08-15", status: "Allocated", avatar: "PS" },
        { id: "AL-102", assetName: "Delivery Van", assetTag: "AF-002", assignee: "Logistics Dept", role: "Department", returnDate: "2026-07-10", status: "Overdue", avatar: "LD" },
        { id: "AL-103", assetName: "Sony A7IV Camera", assetTag: "AF-005", assignee: "Raj Patel", role: "Media Team", returnDate: "2026-07-20", status: "Transfer Pending", requester: "Amit Kumar", avatar: "RP" },
      ];
      setAllocations(mockDbData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong fetching allocations.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadAllocations(); }, [loadAllocations]);

  // ── Action Handlers ──
  const handleReturn = async (id: string) => {
    setActionLoading((p) => ({ ...p, [id]: "return" }));
    const res = await allocationApi.returnAsset(id);
    if (res.success) {
      setAllocations((prev) => prev.filter((a) => a.id !== id));
      showToast("Asset returned successfully");
    } else {
      showToast("Return failed. Please try again.", "error");
    }
    setActionLoading((p) => ({ ...p, [id]: null }));
  };

  const handleTransfer = async (id: string) => {
    // TODO: Open a transfer modal with employee selector
    // For now, simulated transfer
    setActionLoading((p) => ({ ...p, [id]: "transfer" }));
    const res = await allocationApi.transferAsset(id, "new-assignee-id");
    if (res.success) {
      setAllocations((prev) => prev.map((a) => a.id === id ? { ...a, status: "Transfer Pending" } : a));
      showToast("Transfer request submitted");
    } else {
      showToast("Transfer failed.", "error");
    }
    setActionLoading((p) => ({ ...p, [id]: null }));
  };

  const handleApprove = async (id: string) => {
    setActionLoading((p) => ({ ...p, [id]: "approve" }));
    const res = await allocationApi.approveTransfer(id);
    if (res.success) {
      setAllocations((prev) => prev.map((a) => a.id === id ? { ...a, status: "Allocated" } : a));
      showToast("Transfer approved");
    } else {
      showToast("Approval failed.", "error");
    }
    setActionLoading((p) => ({ ...p, [id]: null }));
  };

  const handleReject = async (id: string) => {
    setActionLoading((p) => ({ ...p, [id]: "reject" }));
    const res = await allocationApi.rejectTransfer(id);
    if (res.success) {
      setAllocations((prev) => prev.filter((a) => a.id !== id));
      showToast("Transfer rejected");
    } else {
      showToast("Rejection failed.", "error");
    }
    setActionLoading((p) => ({ ...p, [id]: null }));
  };

  const handlePing = async (id: string) => {
    setActionLoading((p) => ({ ...p, [id]: "ping" }));
    const res = await allocationApi.sendPing(id);
    if (res.success) {
      showToast("Reminder sent to assignee");
    } else {
      showToast("Failed to send reminder.", "error");
    }
    setActionLoading((p) => ({ ...p, [id]: null }));
  };

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  const filteredData = allocations.filter((item) => {
    const matchesSearch =
      item.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "All" ? true : item.status.includes(activeTab);
    return matchesSearch && matchesTab;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-xl border ${toast.type === "error" ? "bg-red-950 border-red-500/40 text-red-300" : "bg-emerald-950 border-emerald-500/40 text-emerald-300"}`}
          >{toast.type === "error" ? <X size={14} className="inline mr-1.5" /> : <CheckCircle2 size={14} className="inline mr-1.5" />}{toast.msg}</motion.div>
        )}
      </AnimatePresence>
      {/* --- Page Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Allocations & Transfers
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage asset assignments and resolve conflicts
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAllocate(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
        >
          <Plus size={18} />
          Allocate Asset
        </motion.button>
      </div>

      {/* --- Filters & Search Toolbar --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex p-1 bg-[#161925] border border-zinc-800/80 rounded-xl w-full md:w-auto">
          {["All", "Allocated", "Overdue", "Transfer"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-zinc-800/50"
              }`}
            >
              {tab === "Transfer" ? "Pending Transfers" : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search assets or assignees..."
            className="w-full bg-[#161925] border border-zinc-800/80 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- Error State --- */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-center gap-4 text-red-400">
          <AlertCircle size={24} />
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="ml-auto underline text-sm hover:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* --- Loading Skeletons --- */}
      {isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-[#161925] border border-zinc-800 rounded-2xl p-6 h-64 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
                <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
              </div>
              <div className="h-12 bg-[#0f111a] rounded-xl w-full mt-6"></div>
              <div className="flex gap-3 mt-4">
                <div className="h-10 bg-zinc-800 rounded-lg w-full"></div>
                <div className="h-10 bg-zinc-800 rounded-lg w-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Allocations Grid --- */}
      {!isLoading && !error && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500"
              >
                <Search size={48} className="mb-4 opacity-20" />
                <p>No allocations found matching your criteria.</p>
              </motion.div>
            ) : (
              filteredData.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  layout
                  className={`relative overflow-hidden bg-[#161925] border rounded-2xl p-6 shadow-xl flex flex-col justify-between group ${
                    item.status === "Overdue"
                      ? "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                      : item.status === "Transfer Pending"
                      ? "border-amber-500/30"
                      : "border-zinc-800/80 hover:border-zinc-700"
                  } transition-colors`}
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full pointer-events-none transition-colors ${
                      item.status === "Overdue"
                        ? "bg-red-500"
                        : item.status === "Transfer Pending"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                  ></div>

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors">
                          {item.assetName}
                        </h3>
                        <p className="text-xs text-zinc-500 font-mono mt-1">
                          {item.assetTag}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          item.status === "Overdue"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : item.status === "Transfer Pending"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="space-y-3 mt-6">
                      <div className="flex items-center gap-3 bg-[#0f111a] p-3 rounded-xl border border-zinc-800/50">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-gray-300">
                          {item.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">
                            {item.assignee}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                            <User size={12} />
                            <span>{item.role}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 px-1">
                        <Calendar
                          size={14}
                          className={
                            item.status === "Overdue"
                              ? "text-red-400"
                              : "text-gray-500"
                          }
                        />
                        <span>
                          Expected Return:{" "}
                          <strong
                            className={
                              item.status === "Overdue"
                                ? "text-red-400"
                                : "text-gray-300"
                            }
                          >
                            {item.returnDate}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800/50 flex gap-3">
                    {item.status === "Allocated" && (
                      <>
                        <button
                          disabled={!!actionLoading[item.id]}
                          onClick={() => handleReturn(item.id)}
                          className="flex-1 bg-[#0f111a] hover:bg-zinc-800 border border-zinc-800 text-gray-300 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          {actionLoading[item.id] === "return" ? <Loader2 size={13} className="animate-spin" /> : null}
                          Return
                        </button>
                        <button
                          disabled={!!actionLoading[item.id]}
                          onClick={() => handleTransfer(item.id)}
                          className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {actionLoading[item.id] === "transfer" ? <Loader2 size={13} className="animate-spin" /> : <ArrowRightLeft size={14} />}
                          Transfer
                        </button>
                      </>
                    )}
                    {item.status === "Overdue" && (
                      <button
                        disabled={!!actionLoading[item.id]}
                        onClick={() => handlePing(item.id)}
                        className="w-full bg-red-500/10 text-red-400 border border-red-500/20 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading[item.id] === "ping" ? <Loader2 size={13} className="animate-spin" /> : <Bell size={14} />}
                        Send Ping
                      </button>
                    )}
                    {item.status === "Transfer Pending" && (
                      <div className="w-full flex gap-2">
                        <button
                          disabled={!!actionLoading[item.id]}
                          onClick={() => handleApprove(item.id)}
                          className="flex-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-2 rounded-lg text-xs font-semibold flex justify-center gap-1 disabled:opacity-50"
                        >
                          {actionLoading[item.id] === "approve" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          Approve
                        </button>
                        <button
                          disabled={!!actionLoading[item.id]}
                          onClick={() => handleReject(item.id)}
                          className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 py-2 rounded-lg text-xs font-semibold flex justify-center gap-1 disabled:opacity-50"
                        >
                          {actionLoading[item.id] === "reject" ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={14} />}
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Allocate Asset Modal */}
      <AllocateAssetModal
        open={showAllocate}
        onClose={() => setShowAllocate(false)}
        onSuccess={(allocationId) => {
          setShowAllocate(false);
          showToast(`Asset allocated! ID: ${allocationId}`);
          loadAllocations();
        }}
      />
    </motion.div>
  );
}
