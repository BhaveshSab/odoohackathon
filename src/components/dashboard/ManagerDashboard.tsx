import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, ArrowLeftRight, CalendarCheck, Wrench, Clock, AlertTriangle,
  CheckCircle2, Boxes, Activity, Bell, LogOut, RefreshCw, ChevronRight,
  X, Zap, Plus, ClipboardCheck, ShieldCheck, Hourglass, FileWarning,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { getSession, type AuthResponse } from "@/lib/auth";
import AllocateAssetModal from "@/components/dashboard/AllocateAssetModal";

// =============================================
// CONFIG
// =============================================
const BASE_URL = "http://localhost:5000/api";
const MANAGER_EMAIL = "bhavesh.sabnani2005@gmail.com";

// =============================================
// TYPES
// =============================================
interface ManagerKPI {
  assetsAvailable: number;
  assetsAllocated: number;
  maintenanceToday: number;
  activeBookings: number;
  pendingTransfers: number;
  upcomingReturns: number;
  overdueReturns: number;
  kpiTrends: Record<string, string>;
}

interface ChartPoint { date: string; allocated: number; available: number; }
interface PieSlice { name: string; value: number; color: string; }
interface PendingTransfer { id: number; assetTag: string; assetName: string; from: string; to: string; dept: string; requested: string; }
interface MaintenanceReq { id: number; assetTag: string; assetName: string; issue: string; priority: string; requestedBy: string; status: string; }
interface OverdueAsset { id: number; assetTag: string; assetName: string; employee: string; daysOverdue: number; dept: string; }
interface ActivityItem { id: number; text: string; time: string; status: "success" | "danger" | "warning" | "info"; }
interface Toast { msg: string; type: string; }

interface ManagerDashboardProps {
  onNavigate: (screen: string) => void;
  onSignOut: () => void;
}

// =============================================
// DUMMY / FALLBACK DATA
// =============================================
const DUMMY_KPI: ManagerKPI = {
  assetsAvailable: 142, assetsAllocated: 87, maintenanceToday: 6, activeBookings: 23,
  pendingTransfers: 9, upcomingReturns: 14, overdueReturns: 5,
  kpiTrends: {
    assetsAvailable: "+8 vs last week", assetsAllocated: "+3 vs last week",
    maintenanceToday: "Active repairs today", activeBookings: "+5 vs last week",
    pendingTransfers: "Awaiting your approval", upcomingReturns: "Next 7 days",
    overdueReturns: "Needs immediate action",
  },
};

const DUMMY_CHART: ChartPoint[] = [
  { date: "16/07", allocated: 340, available: 260 }, { date: "17/07", allocated: 410, available: 220 },
  { date: "18/07", allocated: 300, available: 290 }, { date: "19/07", allocated: 320, available: 210 },
  { date: "20/07", allocated: 390, available: 240 }, { date: "21/07", allocated: 290, available: 170 },
  { date: "22/07", allocated: 410, available: 250 }, { date: "23/07", allocated: 370, available: 230 },
];

const DUMMY_PIE: PieSlice[] = [
  { name: "Available", value: 142, color: "#10b981" }, { name: "Allocated", value: 87, color: "#3b82f6" },
  { name: "Under Maintenance", value: 12, color: "#f59e0b" }, { name: "Reserved", value: 18, color: "#8b5cf6" },
  { name: "Lost / Retired", value: 4, color: "#ef4444" },
];

const DUMMY_TRANSFERS: PendingTransfer[] = [
  { id: 1, assetTag: "AF-0114", assetName: "Dell Laptop", from: "Priya Sharma", to: "Raj Mehta", dept: "Engineering", requested: "2h ago" },
  { id: 2, assetTag: "AF-0078", assetName: "Canon Camera", from: "Sara Ali", to: "Vikram Nair", dept: "Marketing", requested: "5h ago" },
  { id: 3, assetTag: "AF-0033", assetName: "HP Printer", from: "Amit Verma", to: "Pooja Singh", dept: "HR", requested: "1d ago" },
  { id: 4, assetTag: "AF-0091", assetName: "iPad Pro", from: "Kiran Das", to: "Ananya Das", dept: "Sales", requested: "1d ago" },
  { id: 5, assetTag: "AF-0055", assetName: "Projector", from: "Ravi Kumar", to: "Meera Joshi", dept: "Operations", requested: "2d ago" },
];

const DUMMY_MAINTENANCE: MaintenanceReq[] = [
  { id: 1, assetTag: "AF-0022", assetName: "AC Unit", issue: "Not cooling", priority: "High", requestedBy: "Amit V.", status: "Pending" },
  { id: 2, assetTag: "AF-0047", assetName: "Laser Printer", issue: "Paper jam error", priority: "Medium", requestedBy: "Sara A.", status: "Pending" },
  { id: 3, assetTag: "AF-0011", assetName: "Server Rack #3", issue: "Overheating", priority: "High", requestedBy: "Kiran D.", status: "InProgress" },
  { id: 4, assetTag: "AF-0063", assetName: "Office Desk Fan", issue: "Making noise", priority: "Low", requestedBy: "Pooja S.", status: "Pending" },
];

const DUMMY_OVERDUE: OverdueAsset[] = [
  { id: 1, assetTag: "AF-0052", assetName: "Dell Monitor", employee: "Raj Mehta", daysOverdue: 3, dept: "Engineering" },
  { id: 2, assetTag: "AF-0078", assetName: "Canon Camera", employee: "Sara Ali", daysOverdue: 7, dept: "Marketing" },
  { id: 3, assetTag: "AF-0101", assetName: "iPad Pro", employee: "Kiran Das", daysOverdue: 1, dept: "Sales" },
  { id: 4, assetTag: "AF-0033", assetName: "HP Laptop", employee: "Amit Verma", daysOverdue: 5, dept: "HR" },
  { id: 5, assetTag: "AF-0066", assetName: "Office Chair", employee: "Pooja Singh", daysOverdue: 2, dept: "Operations" },
];

const DUMMY_ACTIVITY: ActivityItem[] = [
  { id: 1, text: "Laptop AF-0114 allocated to Priya Sharma", time: "2 min ago", status: "success" },
  { id: 2, text: "Monitor AF-0052 overdue \u2014 Raj Mehta (3 days late)", time: "15 min ago", status: "danger" },
  { id: 3, text: "Maintenance approved for Printer AF-0033", time: "1 hr ago", status: "warning" },
  { id: 4, text: "Transfer request: Tablet AF-0091 awaiting approval", time: "2 hr ago", status: "warning" },
  { id: 5, text: "Camera AF-0017 returned by Vikram Nair", time: "5 hr ago", status: "success" },
  { id: 6, text: "New asset AF-0145 registered \u2014 MacBook Pro", time: "6 hr ago", status: "info" },
];

// =============================================
// API SERVICE (falls back to dummy data)
// =============================================
const apiService = {
  getKPIs: async (): Promise<ManagerKPI> => { try { const r = await fetch(`${BASE_URL}/dashboard/manager/kpis`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); if (!r.ok) throw new Error(); return await r.json(); } catch { return DUMMY_KPI; } },
  getChartData: async (): Promise<ChartPoint[]> => { try { const r = await fetch(`${BASE_URL}/dashboard/manager/chart`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); if (!r.ok) throw new Error(); return await r.json(); } catch { return DUMMY_CHART; } },
  getPieData: async (): Promise<PieSlice[]> => { try { const r = await fetch(`${BASE_URL}/dashboard/manager/asset-status`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); if (!r.ok) throw new Error(); return await r.json(); } catch { return DUMMY_PIE; } },
  getPendingTransfers: async (): Promise<PendingTransfer[]> => { try { const r = await fetch(`${BASE_URL}/transfers?status=Pending`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); if (!r.ok) throw new Error(); return await r.json(); } catch { return DUMMY_TRANSFERS; } },
  getMaintenanceRequests: async (): Promise<MaintenanceReq[]> => { try { const r = await fetch(`${BASE_URL}/maintenance?status=Pending,InProgress`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); if (!r.ok) throw new Error(); return await r.json(); } catch { return DUMMY_MAINTENANCE; } },
  getOverdueAssets: async (): Promise<OverdueAsset[]> => { try { const r = await fetch(`${BASE_URL}/dashboard/manager/overdue`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); if (!r.ok) throw new Error(); return await r.json(); } catch { return DUMMY_OVERDUE; } },
  getActivity: async (): Promise<ActivityItem[]> => { try { const r = await fetch(`${BASE_URL}/dashboard/manager/activity`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); if (!r.ok) throw new Error(); return await r.json(); } catch { return DUMMY_ACTIVITY; } },
  approveTransfer: async (id: number): Promise<boolean> => { try { const r = await fetch(`${BASE_URL}/transfers/${id}/approve`, { method: "PATCH", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); if (!r.ok) throw new Error(); return true; } catch { return false; } },
  rejectTransfer: async (id: number): Promise<boolean> => { try { const r = await fetch(`${BASE_URL}/transfers/${id}/reject`, { method: "PATCH", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); if (!r.ok) throw new Error(); return true; } catch { return false; } },
  approveMaintenance: async (id: number): Promise<boolean> => { try { const r = await fetch(`${BASE_URL}/maintenance/${id}/approve`, { method: "PATCH", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); if (!r.ok) throw new Error(); return true; } catch { return false; } },
};

// =============================================
// HELPERS
// =============================================
const statusDot: Record<string, string> = { success: "bg-emerald-400", danger: "bg-red-400", warning: "bg-amber-400", info: "bg-blue-400" };
const priorityStyle: Record<string, string> = {
  High: "bg-red-500/20 text-red-400 border border-red-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  Low: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div className="bg-[#1e2235] border border-[#333] rounded-xl p-3 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((e: any, i: number) => <p key={i} style={{ color: e.color }} className="font-semibold">{e.name}: {e.value}</p>)}
    </div>
  );
  return null;
};

const PieLegend = ({ data }: { data: PieSlice[] }) => (
  <div className="flex flex-col gap-2 mt-2">
    {data.map((e) => (
      <div key={e.name} className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: e.color }} /><span className="text-gray-400">{e.name}</span></div>
        <span className="font-semibold text-white">{e.value}</span>
      </div>
    ))}
  </div>
);

// =============================================
// SUB-COMPONENTS
// =============================================
const KPICard = ({ title, value, trend, icon: Icon, color, iconBg, isOverdue, isPending, delay = 0 }: {
  title: string; value: number | undefined; trend: string; icon: any; color: string; iconBg: string; isOverdue?: boolean; isPending?: boolean; delay?: number;
}) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
    className={`relative rounded-2xl p-5 border flex flex-col gap-3 overflow-hidden ${isOverdue ? "bg-red-950/40 border-red-500/40 shadow-[0_0_24px_rgba(239,68,68,0.15)]" : isPending ? "bg-amber-950/30 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "bg-[#1a1d2e] border-[#2a2d3e]"}`}
  >
    {(isOverdue || isPending) && (
      <div className="absolute top-2 right-2"><span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${isOverdue ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}><AlertTriangle size={9} />{isOverdue ? "CRITICAL" : "ACTION NEEDED"}</span></div>
    )}
    <div className="flex items-start justify-between">
      <div><p className={`text-xs font-medium tracking-wide uppercase ${isOverdue ? "text-red-400" : isPending ? "text-amber-400" : "text-gray-400"}`}>{title}</p><p className={`text-3xl font-bold mt-1 ${isOverdue ? "text-red-400" : isPending ? "text-amber-400" : "text-white"}`}>{value ?? "\u2014"}</p></div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}><Icon size={20} className={color} /></div>
    </div>
    <p className={`text-[11px] ${isOverdue ? "text-red-400/70" : isPending ? "text-amber-400/70" : "text-gray-500"}`}>{trend}</p>
  </motion.div>
);

const QuickAction = ({ icon: Icon, label, desc, color, badge, onClick, delay }: {
  icon: any; label: string; desc: string; color: string; badge: number; onClick: () => void; delay: number;
}) => (
  <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.3 }}
    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick}
    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-[#2a2d3e] bg-[#1a1d2e] hover:border-[#3a3d4e] hover:bg-[#1e2235] transition-all text-left group"
  >
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color} flex-shrink-0`}><Icon size={17} /></div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-white flex items-center gap-2">{label}
        {badge > 0 && <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">{badge}</span>}
      </p>
      <p className="text-xs text-gray-500 truncate">{desc}</p>
    </div>
    <ChevronRight size={15} className="text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
  </motion.button>
);

const NotifPanel = ({ activity, overdueCount, pendingCount, onClose }: {
  activity: ActivityItem[]; overdueCount: number; pendingCount: number; onClose: () => void;
}) => (
  <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
    className="absolute top-14 right-0 w-80 bg-[#1a1d2e] border border-[#2a2d3e] rounded-2xl shadow-2xl z-50 overflow-hidden"
  >
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2d3e]"><span className="text-sm font-semibold text-white">Notifications</span><button onClick={onClose}><X size={14} className="text-gray-400 hover:text-white" /></button></div>
    {(overdueCount > 0 || pendingCount > 0) && (
      <div className="px-4 py-2 bg-[#0f111a] border-b border-[#2a2d3e] flex flex-col gap-1">
        {overdueCount > 0 && <div className="flex items-center gap-2 text-xs text-red-400"><AlertTriangle size={11} />{overdueCount} assets overdue for return</div>}
        {pendingCount > 0 && <div className="flex items-center gap-2 text-xs text-amber-400"><Hourglass size={11} />{pendingCount} transfers awaiting your approval</div>}
      </div>
    )}
    <div className="max-h-64 overflow-y-auto divide-y divide-[#2a2d3e]">
      {activity.slice(0, 6).map((a) => (
        <div key={a.id} className="px-4 py-3 hover:bg-[#22253a] transition-colors"><div className="flex items-start gap-2"><span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${statusDot[a.status]}`} /><div><p className="text-xs text-gray-300 leading-snug">{a.text}</p><p className="text-[10px] text-gray-500 mt-0.5">{a.time}</p></div></div></div>
      ))}
    </div>
    <div className="px-4 py-2 border-t border-[#2a2d3e]"><button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all notifications</button></div>
  </motion.div>
);

// =============================================
// MAIN COMPONENT
// =============================================
export default function ManagerDashboard({ onNavigate, onSignOut }: ManagerDashboardProps) {
  const [session] = useState<AuthResponse | null>(getSession());
  const [kpi, setKpi] = useState<ManagerKPI | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [pieData, setPieData] = useState<PieSlice[]>([]);
  const [pendingTransfers, setPendingTransfers] = useState<PendingTransfer[]>([]);
  const [maintenanceReqs, setMaintenanceReqs] = useState<MaintenanceReq[]>([]);
  const [overdue, setOverdue] = useState<OverdueAsset[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [actionLoading, setActionLoading] = useState<Record<string, string | null>>({});
  const [toast, setToast] = useState<Toast | null>(null);
  const [showAllocate, setShowAllocate] = useState(false);

  const isManager = session?.user?.email === MANAGER_EMAIL;

  const showToast = (msg: string, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchAll = useCallback(async () => {
    setRefreshing(true);
    try {
      const [k, chart, pie, transfers, maint, ov, act] = await Promise.all([
        apiService.getKPIs(), apiService.getChartData(), apiService.getPieData(),
        apiService.getPendingTransfers(), apiService.getMaintenanceRequests(),
        apiService.getOverdueAssets(), apiService.getActivity(),
      ]);
      setKpi(k); setChartData(chart); setPieData(pie);
      setPendingTransfers(transfers); setMaintenanceReqs(maint);
      setOverdue(ov); setActivity(act); setLastUpdated(new Date());
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    if (!isManager) return;
    fetchAll();
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, [isManager, fetchAll]);

  // Inline transfer approve/reject
  const handleTransferAction = async (id: number, action: string) => {
    setActionLoading((p) => ({ ...p, [id]: action }));
    const ok = action === "approve" ? await apiService.approveTransfer(id) : await apiService.rejectTransfer(id);
    if (ok) {
      setPendingTransfers((p) => p.filter((t) => t.id !== id));
      setKpi((p) => p ? { ...p, pendingTransfers: Math.max(0, (p.pendingTransfers || 1) - 1) } : p);
      showToast(`Transfer ${action === "approve" ? "approved" : "rejected"} successfully`);
    } else { showToast("Action failed. Please try again.", "error"); }
    setActionLoading((p) => ({ ...p, [id]: null }));
  };

  // Inline maintenance approve
  const handleMaintenanceApprove = async (id: number) => {
    const key = `m${id}`;
    setActionLoading((p) => ({ ...p, [key]: "approve" }));
    const ok = await apiService.approveMaintenance(id);
    if (ok) {
      setMaintenanceReqs((p) => p.map((r) => r.id === id ? { ...r, status: "Approved" } : r));
      showToast("Maintenance request approved");
    } else { showToast("Approval failed.", "error"); }
    setActionLoading((p) => ({ ...p, [key]: null }));
  };

  // ── Access guard (AFTER all hooks) ──
  if (!isManager) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1d2e] border border-red-500/30 rounded-2xl p-8 text-center max-w-sm">
          <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-white font-bold text-lg">Access Denied</p>
          <p className="text-gray-400 text-sm mt-1">This dashboard is restricted to Asset Managers only.</p>
          <button onClick={onSignOut} className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors">Sign Out</button>
        </motion.div>
      </div>
    );
  }

  const username = session?.user?.name || session?.user?.email?.split("@")[0] || "Manager";
  const totalAssets = pieData.reduce((s, d) => s + d.value, 0);

  const kpiCards = [
    { title: "Assets Available", value: kpi?.assetsAvailable, trend: kpi?.kpiTrends?.assetsAvailable ?? "\u2014", icon: Boxes, color: "text-emerald-400", iconBg: "bg-emerald-400/10", delay: 0.05 },
    { title: "Assets Allocated", value: kpi?.assetsAllocated, trend: kpi?.kpiTrends?.assetsAllocated ?? "\u2014", icon: Package, color: "text-blue-400", iconBg: "bg-blue-400/10", delay: 0.1 },
    { title: "Maintenance Today", value: kpi?.maintenanceToday, trend: kpi?.kpiTrends?.maintenanceToday ?? "\u2014", icon: Wrench, color: "text-amber-400", iconBg: "bg-amber-400/10", delay: 0.15 },
    { title: "Active Bookings", value: kpi?.activeBookings, trend: kpi?.kpiTrends?.activeBookings ?? "\u2014", icon: CalendarCheck, color: "text-purple-400", iconBg: "bg-purple-400/10", delay: 0.2 },
    { title: "Pending Transfers", value: kpi?.pendingTransfers, trend: kpi?.kpiTrends?.pendingTransfers ?? "\u2014", icon: ArrowLeftRight, color: "text-amber-400", iconBg: "bg-amber-400/10", isPending: true, delay: 0.25 },
    { title: "Upcoming Returns", value: kpi?.upcomingReturns, trend: kpi?.kpiTrends?.upcomingReturns ?? "\u2014", icon: Clock, color: "text-cyan-400", iconBg: "bg-cyan-400/10", delay: 0.3 },
    { title: "Overdue Returns", value: kpi?.overdueReturns, trend: kpi?.kpiTrends?.overdueReturns ?? "\u2014", icon: AlertTriangle, color: "text-red-400", iconBg: "bg-red-400/10", isOverdue: true, delay: 0.35 },
  ];

  const quickActions = [
    { icon: Plus, label: "Register Asset", badge: 0, desc: "Log new equipment into the system", color: "bg-emerald-500/20 text-emerald-400", onClick: () => setShowAllocate(true), delay: 0.05 },
    { icon: ShieldCheck, label: "Approve Transfers", badge: kpi?.pendingTransfers ?? 0, desc: "Review & approve pending transfer requests", color: "bg-amber-500/20 text-amber-400", onClick: () => onNavigate("transfers"), delay: 0.1 },
    { icon: ClipboardCheck, label: "Approve Maintenance", badge: maintenanceReqs.filter((m) => m.status === "Pending").length, desc: "Approve pending repair requests", color: "bg-blue-500/20 text-blue-400", onClick: () => onNavigate("maintenance"), delay: 0.15 },
    { icon: CalendarCheck, label: "Book a Resource", badge: 0, desc: "Reserve shared spaces & equipment", color: "bg-purple-500/20 text-purple-400", onClick: () => onNavigate("booking"), delay: 0.2 },
    { icon: Wrench, label: "Raise Maintenance", badge: 0, desc: "Flag broken equipment for repair", color: "bg-rose-500/20 text-rose-400", onClick: () => onNavigate("maintenance"), delay: 0.25 },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-xl border ${toast.type === "error" ? "bg-red-950 border-red-500/40 text-red-300" : "bg-emerald-950 border-emerald-500/40 text-emerald-300"}`}
          >{toast.type === "error" ? <X size={14} className="inline mr-1.5" /> : <CheckCircle2 size={14} className="inline mr-1.5" />}{toast.msg}</motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Bar + Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">Welcome back, <span className="text-blue-400">{username}</span> &#128075;</h1>
          <p className="text-xs text-gray-500 mt-1">Asset Manager &middot; Organization-wide operational view</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-[11px] text-gray-600">Updated {lastUpdated.toLocaleTimeString()}</span>
          <button onClick={fetchAll} disabled={refreshing} className="p-2 rounded-lg bg-[#1a1d2e] border border-[#2a2d3e] hover:border-blue-500/40 transition-colors"><RefreshCw size={14} className={`text-gray-400 ${refreshing ? "animate-spin" : ""}`} /></button>
          <div className="relative">
            <button onClick={() => setShowNotif((v) => !v)} className="relative p-2 rounded-lg bg-[#1a1d2e] border border-[#2a2d3e] hover:border-blue-500/40 transition-colors">
              <Bell size={16} className="text-gray-400" />
              {((kpi?.overdueReturns ?? 0) + (kpi?.pendingTransfers ?? 0)) > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{(kpi?.overdueReturns ?? 0) + (kpi?.pendingTransfers ?? 0)}</span>}
            </button>
            <AnimatePresence>{showNotif && <NotifPanel activity={activity} overdueCount={kpi?.overdueReturns ?? 0} pendingCount={kpi?.pendingTransfers ?? 0} onClose={() => setShowNotif(false)} />}</AnimatePresence>
          </div>
          <div className="flex items-center gap-2 bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">{username[0]?.toUpperCase()}</div>
            <span className="text-xs text-gray-300 hidden sm:block">{session?.user.email}</span>
            <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-full font-bold">MANAGER</span>
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      <AnimatePresence>
        {!loading && (kpi?.overdueReturns ?? 0) > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-red-950/50 border border-red-500/40 rounded-2xl px-5 py-3 flex items-center gap-3">
            <AlertTriangle size={17} className="text-red-400 flex-shrink-0" /><p className="text-sm text-red-300"><span className="font-bold text-red-400">{kpi?.overdueReturns} assets</span> are overdue for return. Follow up immediately.</p>
            <button onClick={() => onNavigate("allocations")} className="ml-auto text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg transition-colors flex-shrink-0">View All &#8594;</button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!loading && (kpi?.pendingTransfers ?? 0) > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-amber-950/40 border border-amber-500/30 rounded-2xl px-5 py-3 flex items-center gap-3">
            <Hourglass size={17} className="text-amber-400 flex-shrink-0" /><p className="text-sm text-amber-300"><span className="font-bold text-amber-400">{kpi?.pendingTransfers} transfer requests</span> are awaiting your approval.</p>
            <button onClick={() => onNavigate("transfers")} className="ml-auto text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-lg transition-colors flex-shrink-0">Review &#8594;</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-2xl p-5 h-32 animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{kpiCards.map((c, i) => <KPICard key={i} {...c} />)}</div>
      )}

      {/* Chart + Pie + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 bg-[#1a1d2e] border border-[#2a2d3e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="text-sm font-semibold text-white">Asset Activity Overview</h2><p className="text-xs text-gray-500">Allocated vs Available &mdash; last 8 days</p></div>
            <span className="text-[11px] text-gray-600 bg-[#0f111a] border border-[#2a2d3e] px-2 py-1 rounded-lg">{new Date().toLocaleString("default", { month: "long", year: "numeric" })}</span>
          </div>
          <ResponsiveContainer width="100%" height={200}><BarChart data={chartData} barGap={4}><CartesianGrid strokeDasharray="3 3" stroke="#1e2235" vertical={false} /><XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} /><Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} formatter={(v) => <span style={{ color: "#9ca3af" }}>{v}</span>} /><Bar dataKey="allocated" name="Allocated" fill="#3b82f6" radius={[4, 4, 0, 0]} /><Bar dataKey="available" name="Available" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.7} /></BarChart></ResponsiveContainer>
        </motion.div>
        <div className="flex flex-col gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Asset Status Breakdown</h2>
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0"><PieChart width={100} height={100}><Pie data={pieData} cx={45} cy={45} innerRadius={28} outerRadius={45} dataKey="value" paddingAngle={3}>{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart><div className="absolute inset-0 flex items-center justify-center"><span className="text-[11px] font-bold text-white">{totalAssets}</span></div></div>
              <PieLegend data={pieData} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 mb-1"><Zap size={13} className="text-yellow-400" /><h2 className="text-sm font-semibold text-white">Quick Actions</h2></div>
            {quickActions.map((a, i) => <QuickAction key={i} {...a} />)}
          </motion.div>
        </div>
      </div>

      {/* Pending Transfers + Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }} className="bg-[#1a1d2e] border border-amber-500/20 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2d3e]">
            <div className="flex items-center gap-2"><ArrowLeftRight size={15} className="text-amber-400" /><h2 className="text-sm font-semibold text-white">Pending Transfers</h2><span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">{pendingTransfers.length}</span></div>
            <button onClick={() => onNavigate("transfers")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all &#8594;</button>
          </div>
          <div className="divide-y divide-[#1e2235] max-h-72 overflow-y-auto">
            {pendingTransfers.map((t) => (
              <div key={t.id} className="px-5 py-3 hover:bg-[#1e2235] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{t.assetName}<span className="ml-1.5 text-gray-500 font-normal">{t.assetTag}</span></p>
                    <p className="text-[11px] text-gray-400 mt-0.5"><span className="text-gray-300">{t.from}</span><span className="mx-1.5 text-gray-600">&#8594;</span><span className="text-gray-300">{t.to}</span><span className="ml-1.5 text-gray-600">&middot; {t.dept}</span></p>
                    <p className="text-[10px] text-gray-600 mt-0.5">{t.requested}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button disabled={!!actionLoading[t.id]} onClick={() => handleTransferAction(t.id, "approve")} className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50">{actionLoading[t.id] === "approve" ? "..." : "Approve"}</button>
                    <button disabled={!!actionLoading[t.id]} onClick={() => handleTransferAction(t.id, "reject")} className="px-2.5 py-1 text-[11px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50">{actionLoading[t.id] === "reject" ? "..." : "Reject"}</button>
                  </div>
                </div>
              </div>
            ))}
            {pendingTransfers.length === 0 && <div className="py-8 text-center text-gray-500 text-xs"><CheckCircle2 size={22} className="mx-auto mb-2 text-emerald-500" />No pending transfers. All clear!</div>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2d3e]">
            <div className="flex items-center gap-2"><Wrench size={15} className="text-amber-400" /><h2 className="text-sm font-semibold text-white">Maintenance Requests</h2><span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">{maintenanceReqs.length}</span></div>
            <button onClick={() => onNavigate("maintenance")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all &#8594;</button>
          </div>
          <div className="divide-y divide-[#1e2235] max-h-72 overflow-y-auto">
            {maintenanceReqs.map((m) => (
              <div key={m.id} className="px-5 py-3 hover:bg-[#1e2235] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap"><p className="text-xs font-semibold text-white">{m.assetName}</p><span className="text-gray-500 text-[11px]">{m.assetTag}</span><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${priorityStyle[m.priority]}`}>{m.priority}</span></div>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{m.issue}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">By {m.requestedBy}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {m.status === "Pending" ? (
                      <button disabled={!!actionLoading[`m${m.id}`]} onClick={() => handleMaintenanceApprove(m.id)} className="px-2.5 py-1 text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50">{actionLoading[`m${m.id}`] ? "..." : "Approve"}</button>
                    ) : (
                      <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg">{m.status}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {maintenanceReqs.length === 0 && <div className="py-8 text-center text-gray-500 text-xs"><CheckCircle2 size={22} className="mx-auto mb-2 text-emerald-500" />No pending maintenance requests.</div>}
          </div>
        </motion.div>
      </div>

      {/* Overdue + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.54 }} className="bg-[#1a1d2e] border border-red-500/20 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2d3e]"><div className="flex items-center gap-2"><FileWarning size={15} className="text-red-400" /><h2 className="text-sm font-semibold text-white">Overdue Returns</h2><span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">{overdue.length}</span></div><button onClick={() => onNavigate("allocations")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all &#8594;</button></div>
          <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-gray-500 border-b border-[#2a2d3e]"><th className="px-5 py-2.5 text-left font-medium">Asset</th><th className="px-3 py-2.5 text-left font-medium">Employee</th><th className="px-3 py-2.5 text-left font-medium">Dept</th><th className="px-3 py-2.5 text-left font-medium">Late</th></tr></thead><tbody className="divide-y divide-[#1e2235]">{overdue.map((r) => (<tr key={r.id} className="hover:bg-[#1e2235] transition-colors"><td className="px-5 py-3"><p className="font-semibold text-white">{r.assetName}</p><p className="text-gray-500">{r.assetTag}</p></td><td className="px-3 py-3 text-gray-300">{r.employee}</td><td className="px-3 py-3 text-gray-500">{r.dept}</td><td className="px-3 py-3"><span className={`px-2 py-1 rounded-full font-bold text-[11px] ${r.daysOverdue >= 7 ? "bg-red-500/20 text-red-400" : r.daysOverdue >= 3 ? "bg-amber-500/20 text-amber-400" : "bg-orange-500/20 text-orange-400"}`}>+{r.daysOverdue}d</span></td></tr>))}</tbody></table>
            {overdue.length === 0 && <div className="py-8 text-center text-gray-500 text-xs"><CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-500" />No overdue returns!</div>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.56 }} className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2d3e]"><div className="flex items-center gap-2"><Activity size={15} className="text-blue-400" /><h2 className="text-sm font-semibold text-white">Recent Activity</h2></div><button onClick={() => onNavigate("activity")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all &#8594;</button></div>
          <div className="divide-y divide-[#1e2235] max-h-72 overflow-y-auto">
            {activity.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.58 + i * 0.04 }} className="px-5 py-3.5 flex items-start gap-3 hover:bg-[#1e2235] transition-colors">
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${statusDot[item.status]}`} /><div className="flex-1 min-w-0"><p className="text-xs text-gray-300 leading-snug">{item.text}</p><p className="text-[10px] text-gray-600 mt-0.5">{item.time}</p></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Allocate Asset Modal */}
      <AllocateAssetModal
        open={showAllocate}
        onClose={() => setShowAllocate(false)}
        onSuccess={(allocationId) => {
          setShowAllocate(false);
          showToast(`Asset allocated! ID: ${allocationId}`);
          fetchAll();
        }}
        currentUserId={session?.user?.id ?? "manager-001"}
      />

      {/* Footer */}
      <div className="text-center text-[11px] text-gray-700 pb-2">AssetFlow ERP &middot; Asset Manager Portal &middot; Last updated {lastUpdated.toLocaleTimeString()}</div>
    </div>
  );
}
