import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  Search,
  Plus,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  ArrowRight,
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

interface AuditProgress {
  total: number;
  verified: number;
  missing: number;
  damaged: number;
}

interface AuditCycle {
  id: string;
  title: string;
  scope: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: AuditProgress;
  auditors: string[];
}

const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case "in progress":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "completed":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "draft":
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export default function AssetAudits() {
  const [audits, setAudits] = useState<AuditCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // BACKEND INTEGRATION: Fetch Audit Cycles
  // ==========================================
  useEffect(() => {
    const fetchAudits = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with your actual backend API call
        // const response = await fetch('/api/audits');
        // if (!response.ok) throw new Error('Failed to fetch data');
        // const data = await response.json();
        // setAudits(data);

        // --- Simulated Backend Delay ---
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockAudits: AuditCycle[] = [
          {
            id: "AUD-2026-Q3-01",
            title: "Q3 IT Equipment Verification",
            scope: "HQ - Floors 2 & 3",
            startDate: "2026-08-01",
            endDate: "2026-08-15",
            status: "In Progress",
            progress: { total: 240, verified: 185, missing: 2, damaged: 4 },
            auditors: ["PS", "AK"],
          },
          {
            id: "AUD-2026-Q3-02",
            title: "Logistics Vehicle Fleet Check",
            scope: "Warehouse A & B",
            startDate: "2026-08-10",
            endDate: "2026-08-12",
            status: "Draft",
            progress: { total: 18, verified: 0, missing: 0, damaged: 0 },
            auditors: ["LD"],
          },
          {
            id: "AUD-2026-Q2-01",
            title: "Q2 Office Furniture Audit",
            scope: "All HQ Branches",
            startDate: "2026-04-01",
            endDate: "2026-04-20",
            status: "Completed",
            progress: { total: 450, verified: 445, missing: 5, damaged: 12 },
            auditors: ["JD", "PS", "RP"],
          },
        ];

        setAudits(mockAudits);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load audit cycles."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudits();
  }, []);

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  const filteredAudits = audits.filter((audit) => {
    const matchesSearch =
      audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.scope.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "All"
        ? true
        : audit.status.toLowerCase() === activeTab.toLowerCase();
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
            Asset Audits
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Schedule verification cycles and manage discrepancies.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
        >
          <Plus size={18} />
          Create Audit Cycle
        </motion.button>
      </div>

      {/* --- Filters & Search Toolbar --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex p-1 bg-[#161925] border border-zinc-800/80 rounded-xl w-full lg:w-auto overflow-x-auto">
          {["All", "In Progress", "Draft", "Completed"].map((tab) => (
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
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search audits by title, ID, or scope..."
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-[#161925] border border-zinc-800 rounded-2xl p-6 h-64 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
                  <div className="h-6 bg-zinc-800 rounded-full w-24"></div>
                </div>
                <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
                <div className="h-12 bg-[#0f111a] rounded-xl w-full mt-4"></div>
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {filteredAudits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500"
              >
                <ClipboardCheck size={48} className="mb-4 opacity-20" />
                <p>No audit cycles found.</p>
              </motion.div>
            ) : (
              filteredAudits.map((audit) => {
                const isCompleted = audit.status === "Completed";
                const progressPercentage =
                  audit.progress.total > 0
                    ? Math.round(
                        (audit.progress.verified / audit.progress.total) * 100
                      )
                    : 0;
                const hasDiscrepancies =
                  audit.progress.missing > 0 || audit.progress.damaged > 0;

                return (
                  <motion.div
                    key={audit.id}
                    variants={cardVariants}
                    layout
                    className="relative overflow-hidden bg-[#161925] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between group transition-colors"
                  >
                    {/* Subtle Background Glow based on Status */}
                    <div
                      className={`absolute -top-10 -right-10 w-40 h-40 blur-[60px] opacity-10 rounded-full pointer-events-none transition-colors ${
                        isCompleted
                          ? "bg-emerald-500"
                          : audit.status === "In Progress"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    ></div>

                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                            {audit.title}
                          </h3>
                          <p className="text-xs text-zinc-500 font-mono mt-1">
                            {audit.id}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(audit.status)}`}
                        >
                          {isCompleted && <CheckCircle2 size={12} />}
                          {audit.status}
                        </span>
                      </div>

                      {/* Info Pills */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#0f111a] px-2.5 py-1.5 rounded-lg border border-zinc-800">
                          <MapPin size={12} className="text-zinc-500" />{" "}
                          {audit.scope}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#0f111a] px-2.5 py-1.5 rounded-lg border border-zinc-800">
                          <Calendar size={12} className="text-zinc-500" />{" "}
                          {audit.startDate} to {audit.endDate}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#0f111a] px-2.5 py-1.5 rounded-lg border border-zinc-800">
                          <Users size={12} className="text-zinc-500" />
                          {audit.auditors.length}{" "}
                          {audit.auditors.length === 1
                            ? "Auditor"
                            : "Auditors"}
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="mt-6 p-4 rounded-xl border border-zinc-800/50 bg-[#0f111a]">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Audit Progress
                          </span>
                          <span className="text-sm font-bold text-white">
                            {progressPercentage}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-zinc-800 rounded-full h-2 mb-4 overflow-hidden flex">
                          <div
                            className="bg-blue-500 h-2 transition-all duration-1000"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>

                        {/* Stat Counters */}
                        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-zinc-800">
                          <div>
                            <p className="text-xs text-zinc-500">
                              Total / Scanned
                            </p>
                            <p className="text-sm font-bold text-gray-200 mt-0.5">
                              {audit.progress.total} / {audit.progress.verified}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500">Missing</p>
                            <p
                              className={`text-sm font-bold mt-0.5 ${
                                audit.progress.missing > 0
                                  ? "text-red-400"
                                  : "text-gray-400"
                              }`}
                            >
                              {audit.progress.missing}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500">Damaged</p>
                            <p
                              className={`text-sm font-bold mt-0.5 ${
                                audit.progress.damaged > 0
                                  ? "text-amber-400"
                                  : "text-gray-400"
                              }`}
                            >
                              {audit.progress.damaged}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Discrepancy Warning */}
                      {hasDiscrepancies && !isCompleted && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
                          <AlertTriangle size={14} />
                          Discrepancies found! Review required before closing
                          cycle.
                        </div>
                      )}
                    </div>

                    {/* Action Buttons based on Status */}
                    <div className="mt-6 pt-4 border-t border-zinc-800/50 flex gap-3">
                      {audit.status === "Draft" && (
                        <button className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 py-2.5 rounded-xl text-xs font-semibold transition-colors flex justify-center items-center gap-2">
                          Start Audit Cycle <ArrowRight size={14} />
                        </button>
                      )}

                      {audit.status === "In Progress" && (
                        <>
                          <button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-blue-900/20 flex justify-center items-center gap-2">
                            <ClipboardCheck size={14} /> Continue Audit
                          </button>
                          <button className="flex-[0.6] bg-zinc-800 hover:bg-zinc-700 text-gray-300 border border-zinc-700 py-2.5 rounded-xl text-xs font-semibold transition-colors flex justify-center items-center gap-2">
                            <Lock size={14} /> Close Cycle
                          </button>
                        </>
                      )}

                      {isCompleted && (
                        <button className="w-full bg-[#0f111a] hover:bg-zinc-800 border border-zinc-800 text-gray-300 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                          <FileText size={14} /> View Discrepancy Report
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
