import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  MoreVertical,
  Activity,
  AlertCircle,
} from "lucide-react";

// Animation variants
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

interface MaintenanceRequest {
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

// Styling helpers
const getPriorityStyles = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "low":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "approved":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "in progress":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "resolved":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export default function Maintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // BACKEND INTEGRATION: Fetch Maintenance Data
  // ==========================================
  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with your actual backend API call
        // const response = await fetch('/api/maintenance');
        // if (!response.ok) throw new Error('Failed to fetch data');
        // const data = await response.json();
        // setRequests(data);

        // --- Simulated Backend Delay ---
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockRequests: MaintenanceRequest[] = [
          {
            id: "REQ-082",
            assetName: "Sony A7IV Camera",
            assetTag: "AF-005",
            issue:
              "Lens mount is loose and throwing error 0x99. Needs recalibration.",
            priority: "High",
            status: "Pending",
            requestedBy: "Raj Patel",
            date: "2026-07-12",
          },
          {
            id: "REQ-081",
            assetName: "Delivery Van (Ford Transit)",
            assetTag: "AF-002",
            issue:
              "Check engine light on, strange noise from transmission.",
            priority: "High",
            status: "In Progress",
            requestedBy: "Logistics Dept",
            date: "2026-07-10",
            technician: "Mike Auto Services",
          },
          {
            id: "REQ-079",
            assetName: "MacBook Pro M2",
            assetTag: "AF-001",
            issue: "Battery expanding slightly, trackpad getting stiff.",
            priority: "Medium",
            status: "Approved",
            requestedBy: "Priya Sharma",
            date: "2026-07-08",
          },
          {
            id: "REQ-075",
            assetName: "Conference Table",
            assetTag: "AF-006",
            issue: "One leg is wobbly, needs tightening.",
            priority: "Low",
            status: "Resolved",
            requestedBy: "Admin Team",
            date: "2026-07-01",
          },
        ];

        setRequests(mockRequests);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load maintenance requests."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, []);

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "All"
        ? true
        : req.status.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
    >
      {/* --- Page Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Maintenance Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track repair requests, approvals, and resolution workflows.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
        >
          <Plus size={18} />
          Raise Request
        </motion.button>
      </div>

      {/* --- Filters & Search Toolbar --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex p-1 bg-[#161925] border border-zinc-800/80 rounded-xl w-full lg:w-auto overflow-x-auto">
          {["All", "Pending", "Approved", "In Progress", "Resolved"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-zinc-800/50"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by asset, ID, or issue..."
            className="w-full bg-[#161925] border border-zinc-800/80 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- Error State --- */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4 text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="ml-auto underline text-sm hover:text-red-300"
          >
            Retry Fetch
          </button>
        </div>
      )}

      {/* --- Loading Skeletons --- */}
      {isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-[#161925] border border-zinc-800 rounded-2xl p-6 h-72 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
                  <div className="h-6 bg-zinc-800 rounded-full w-20"></div>
                </div>
                <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
                <div className="h-16 bg-[#0f111a] rounded-xl w-full mt-4"></div>
              </div>
              <div className="flex gap-3 mt-4 border-t border-zinc-800/50 pt-4">
                <div className="h-10 bg-zinc-800 rounded-lg w-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Data Grid --- */}
      {!isLoading && !error && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredRequests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500"
              >
                <Wrench size={48} className="mb-4 opacity-20" />
                <p>No maintenance requests found.</p>
              </motion.div>
            ) : (
              filteredRequests.map((req) => (
                <motion.div
                  key={req.id}
                  variants={cardVariants}
                  layout
                  className="relative overflow-hidden bg-[#161925] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between group transition-colors"
                >
                  {/* Subtle Background Glow based on Priority */}
                  <div
                    className={`absolute -top-10 -right-10 w-40 h-40 blur-[50px] opacity-10 rounded-full pointer-events-none transition-colors ${
                      req.priority === "High"
                        ? "bg-red-500"
                        : req.priority === "Medium"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                  ></div>

                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                            {req.assetName}
                          </h3>
                        </div>
                        <p className="text-xs text-zinc-500 font-mono mt-1">
                          {req.assetTag} • {req.id}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(req.status)}`}
                      >
                        {req.status === "Pending" && <Clock size={12} />}
                        {req.status === "Approved" && <CheckCircle2 size={12} />}
                        {req.status === "In Progress" && <Activity size={12} />}
                        {req.status === "Resolved" && <CheckCircle2 size={12} />}
                        {req.status}
                      </span>
                    </div>

                    {/* Issue Description Box */}
                    <div className="mt-4 bg-[#0f111a] p-4 rounded-xl border border-zinc-800/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Issue Description
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getPriorityStyles(req.priority)}`}
                        >
                          {req.priority === "High" && (
                            <AlertTriangle size={10} className="mr-1" />
                          )}
                          {req.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                        {req.issue}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-4 px-1">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <User size={14} className="text-zinc-500" />
                        <span className="truncate max-w-[120px]">
                          {req.requestedBy}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={14} className="text-zinc-500" />
                        <span>{req.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Action Buttons based on Workflow Status */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/50 flex gap-3">
                    {req.status === "Pending" && (
                      <>
                        <button className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 py-2 rounded-lg text-xs font-semibold transition-colors flex justify-center items-center gap-1">
                          Approve
                        </button>
                        <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-gray-300 border border-zinc-700 py-2 rounded-lg text-xs font-semibold transition-colors">
                          Reject
                        </button>
                      </>
                    )}

                    {req.status === "Approved" && (
                      <button className="w-full bg-[#0f111a] hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-gray-300 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                        <Wrench size={14} /> Assign Technician
                      </button>
                    )}

                    {req.status === "In Progress" && (
                      <button className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                        <CheckCircle2 size={14} /> Mark as Resolved
                      </button>
                    )}

                    {req.status === "Resolved" && (
                      <button className="w-full bg-[#0f111a] border border-zinc-800 text-zinc-500 py-2 rounded-lg text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-2">
                        Closed
                      </button>
                    )}

                    <button className="p-2 text-gray-500 hover:text-white hover:bg-zinc-800 rounded-lg border border-transparent hover:border-zinc-700 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
