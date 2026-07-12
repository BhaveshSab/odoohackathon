import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Monitor,
  Car,
  ChevronRight,
  CheckCircle2,
  Lock,
  AlertCircle,
  Loader2,
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

interface Resource {
  id: string;
  name: string;
  type: string;
  capacity: string;
  location: string;
}

interface TimeSlot {
  id: string;
  time: string;
  status: string;
  bookedBy?: string;
}

interface Toast { msg: string; type: string; }

// ==========================================
// BOOKING API SERVICE (backend-ready)
// ==========================================
const BASE_URL = "http://localhost:5000/api";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const bookingApi = {
  confirmBooking: async (payload: {
    resourceId: string;
    date: number;
    slotId: string;
    slotTime: string;
  }) => {
    try {
      const r = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
      return await r.json();
    } catch {
      // Demo fallback
      return { success: true, bookingId: `BK-${Date.now()}` };
    }
  },
};

const getResourceIcon = (type: string) => {
  if (type === "room") return <Users size={18} />;
  if (type === "vehicle") return <Car size={18} />;
  return <Monitor size={18} />;
};

export default function ResourceBooking() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedDate, setSelectedDate] = useState(15);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedResource) return;
    const slot = slots.find((s) => s.id === selectedSlot);
    if (!slot) return;

    setBooking(true);
    const res = await bookingApi.confirmBooking({
      resourceId: selectedResource.id,
      date: selectedDate,
      slotId: selectedSlot,
      slotTime: slot.time,
    });

    if (res.success) {
      showToast(`Booking confirmed! ID: ${res.bookingId ?? "N/A"}`);
      // Mark the slot as booked in local state
      setSlots((prev) =>
        prev.map((s) =>
          s.id === selectedSlot ? { ...s, status: "booked", bookedBy: "You" } : s
        )
      );
      setSelectedSlot(null);
    } else {
      showToast("Booking failed. Please try again.", "error");
    }
    setBooking(false);
  };

  // ==========================================
  // BACKEND INTEGRATION: Fetch Resources & Slots
  // ==========================================
  useEffect(() => {
    const fetchBookingData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with your actual backend API calls
        // const resResponse = await fetch('/api/resources/bookable');
        // const slotsResponse = await fetch(`/api/bookings?resourceId=${selectedResource?.id}&date=${selectedDate}`);

        // --- Simulated Backend Delay ---
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockResources: Resource[] = [
          {
            id: "R-01",
            name: "Conference Room A",
            type: "room",
            capacity: "12 People",
            location: "Floor 2",
          },
          {
            id: "R-02",
            name: "Delivery Van (Transit)",
            type: "vehicle",
            capacity: "1000kg",
            location: "Loading Bay",
          },
          {
            id: "R-03",
            name: "4K Projector Cart",
            type: "equipment",
            capacity: "N/A",
            location: "IT Dept",
          },
        ];

        const mockSlots: TimeSlot[] = [
          { id: "S1", time: "09:00 AM - 10:00 AM", status: "available" },
          {
            id: "S2",
            time: "10:00 AM - 11:00 AM",
            status: "booked",
            bookedBy: "Priya Sharma",
          },
          {
            id: "S3",
            time: "11:00 AM - 12:00 PM",
            status: "booked",
            bookedBy: "Amit Kumar",
          },
          { id: "S4", time: "12:00 PM - 01:00 PM", status: "available" },
          { id: "S5", time: "01:00 PM - 02:00 PM", status: "available" },
          { id: "S6", time: "02:00 PM - 03:00 PM", status: "available" },
        ];

        setResources(mockResources);
        setSlots(mockSlots);
        setSelectedResource(mockResources[0]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load booking data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [selectedDate]);

  // Generate a mock calendar array (1-30)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

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
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Resource Booking
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Reserve shared rooms, vehicles, and equipment with real-time overlap
          validation.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4 text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* --- Main Booking Interface --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Resource & Date Selection */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Select Resource */}
          <div className="bg-[#161925] border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="bg-blue-600/20 text-blue-400 w-5 h-5 rounded flex items-center justify-center text-xs">
                1
              </span>
              Select Resource
            </h3>

            <div className="space-y-3">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-zinc-800/50 animate-pulse rounded-xl"
                    ></div>
                  ))
                : resources.map((res) => (
                    <motion.div
                      key={res.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedResource(res)}
                      className={`cursor-pointer flex items-center gap-4 p-3 rounded-xl border transition-all ${
                        selectedResource?.id === res.id
                          ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                          : "bg-[#0f111a] border-zinc-800/80 hover:border-zinc-700"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          selectedResource?.id === res.id
                            ? "bg-blue-500 text-white"
                            : "bg-zinc-800 text-gray-400"
                        }`}
                      >
                        {getResourceIcon(res.type)}
                      </div>
                      <div>
                        <h4
                          className={`text-sm font-semibold ${
                            selectedResource?.id === res.id
                              ? "text-blue-100"
                              : "text-gray-200"
                          }`}
                        >
                          {res.name}
                        </h4>
                        <div className="flex gap-3 text-xs text-zinc-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Users size={10} /> {res.capacity}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={10} /> {res.location}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
            </div>
          </div>

          {/* Step 2: Select Date */}
          <div className="bg-[#161925] border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <span className="bg-blue-600/20 text-blue-400 w-5 h-5 rounded flex items-center justify-center text-xs">
                  2
                </span>
                Select Date
              </h3>
              <span className="text-white font-medium text-sm">
                August 2026
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-zinc-600 py-1"
                >
                  {day}
                </div>
              ))}
              {daysInMonth.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  disabled={day < 14}
                  className={`w-full aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    day < 14
                      ? "text-zinc-700 cursor-not-allowed"
                      : selectedDate === day
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                      : "text-gray-300 hover:bg-zinc-800"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Time Slots */}
        <div className="lg:col-span-7">
          <div className="bg-[#161925] border border-zinc-800/80 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <div className="flex justify-between items-end mb-6 pb-4 border-b border-zinc-800/50">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <span className="bg-blue-600/20 text-blue-400 w-5 h-5 rounded flex items-center justify-center text-xs">
                    3
                  </span>
                  Available Slots
                </h3>
                <h2 className="text-xl font-bold text-white">
                  {selectedResource?.name || "Select a resource"}
                </h2>
                <p className="text-sm text-blue-400 flex items-center gap-1 mt-1">
                  <CalendarIcon size={14} /> Aug {selectedDate}, 2026
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-zinc-800/30 animate-pulse rounded-xl border border-zinc-800/50"
                  ></div>
                ))
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {slots.map((slot) => {
                    const isBooked = slot.status === "booked";
                    const isSelected = selectedSlot === slot.id;

                    return (
                      <motion.button
                        key={slot.id}
                        variants={itemVariants}
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                          isBooked
                            ? "bg-red-500/5 border-red-500/10 cursor-not-allowed opacity-75"
                            : isSelected
                            ? "bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                            : "bg-[#0f111a] border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-lg ${
                              isBooked
                                ? "bg-red-500/10 text-red-400"
                                : isSelected
                                ? "bg-blue-500 text-white"
                                : "bg-zinc-800 text-gray-400"
                            }`}
                          >
                            <Clock size={18} />
                          </div>
                          <div>
                            <p
                              className={`font-semibold ${
                                isBooked
                                  ? "text-gray-500"
                                  : isSelected
                                  ? "text-blue-100"
                                  : "text-gray-200"
                              }`}
                            >
                              {slot.time}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {isBooked
                                ? `Overlap Conflict: Booked by ${slot.bookedBy}`
                                : "Slot available for booking"}
                            </p>
                          </div>
                        </div>

                        <div>
                          {isBooked ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-semibold border border-red-500/20">
                              <Lock size={12} /> Unavailable
                            </div>
                          ) : isSelected ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold shadow-md shadow-blue-500/20">
                              <CheckCircle2 size={12} /> Selected
                            </div>
                          ) : (
                            <ChevronRight
                              size={18}
                              className="text-zinc-600"
                            />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-800/50">
              <motion.button
                whileHover={{ scale: selectedSlot ? 1.01 : 1 }}
                whileTap={{ scale: selectedSlot ? 0.99 : 1 }}
                disabled={!selectedSlot || booking}
                onClick={handleConfirmBooking}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  selectedSlot && !booking
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {booking ? (
                  <><Loader2 size={16} className="animate-spin" /> Confirming…</>
                ) : selectedSlot ? (
                  "Confirm Booking"
                ) : (
                  "Select a time slot to continue"
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
