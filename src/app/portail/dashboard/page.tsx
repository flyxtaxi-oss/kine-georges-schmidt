"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { practitioner } from "@/config/practitioner";
import {
  isFirebaseConfigured,
  subscribeToAppointments,
  updateAppointmentStatus,
  setAvailability,
  getAvailability,
  type Appointment,
  type AvailabilityConfig,
} from "@/lib/firebase";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  XCircle,
  UserX,
  Settings,
  ArrowLeft,
  Loader2,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";

// ─── Helper ──────────────────────────────────────────────────────
function getWeekRange(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

function toDateString(date: Date) {
  return date.toISOString().split("T")[0];
}

const dayLabels: Record<string, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

// ─── Component ───────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, loading, logOut } = useAuth();
  const [view, setView] = useState<"day" | "week">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [availability, setAvailabilityState] = useState<AvailabilityConfig>({
    slotDuration: practitioner.slotDurationMinutes,
    schedule: { ...practitioner.weeklySchedule } as Record<string, { start: string; end: string } | null>,
    blockedDates: [],
  });
  const [saving, setSaving] = useState(false);

  // Subscribe to appointments
  useEffect(() => {
    if (!isFirebaseConfigured || !user) return;

    const range = getWeekRange(currentDate);
    const unsub = subscribeToAppointments(setAppointments, range);
    return unsub;
  }, [user, currentDate]);

  // Load availability
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    getAvailability().then((config) => {
      if (config) setAvailabilityState(config);
    });
  }, []);

  const navigate = (direction: number) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + direction * (view === "week" ? 7 : 1));
    setCurrentDate(next);
  };

  const handleStatus = async (id: string, status: Appointment["status"]) => {
    await updateAppointmentStatus(id, status);
  };

  const handleSaveAvailability = async () => {
    setSaving(true);
    try {
      await setAvailability(availability);
      setShowSettings(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Group appointments by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    appointments
      .filter((a) => a.status !== "cancelled")
      .forEach((a) => {
        if (!groups[a.date]) groups[a.date] = [];
        groups[a.date].push(a);
      });
    // Sort each group by time
    Object.values(groups).forEach((g) => g.sort((a, b) => a.time.localeCompare(b.time)));
    return groups;
  }, [appointments]);

  // Stats
  const todayStr = toDateString(new Date());
  const todayAppts = appointments.filter(
    (a) => a.date === todayStr && a.status === "booked"
  );
  const weekBooked = appointments.filter((a) => a.status === "booked").length;
  const weekDone = appointments.filter((a) => a.status === "done").length;

  // ─── Not configured ─────────────────────────────────────────
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
        <div className="card max-w-md text-center p-8">
          <Settings size={40} className="mx-auto text-[var(--color-text-light)] mb-4 opacity-40" />
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Dashboard non disponible
          </h1>
          <p className="text-sm text-[var(--color-text-light)]">
            Configurez Firebase pour accéder au tableau de bord.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
        <div className="card max-w-md text-center p-8">
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Accès restreint
          </h1>
          <p className="text-sm text-[var(--color-text-light)] mb-4">
            Connectez-vous en tant que praticien.
          </p>
          <Link href="/portail" className="btn btn-primary no-underline">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[var(--color-text-light)] hover:text-[var(--color-primary)] no-underline transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                Tableau de bord
              </h1>
              <p className="text-xs text-[var(--color-text-light)]">
                {practitioner.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-light)] hover:bg-[var(--color-secondary)]"
              }`}
              title="Paramètres de disponibilité"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={logOut}
              className="p-2 rounded-lg text-[var(--color-text-light)] hover:bg-[var(--color-secondary)] transition-colors"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Calendar size={24} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text)]">{todayAppts.length}</p>
              <p className="text-xs text-[var(--color-text-light)]">Rendez-vous aujourd&apos;hui</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <Users size={24} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text)]">{weekBooked}</p>
              <p className="text-xs text-[var(--color-text-light)]">À venir cette semaine</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <BarChart3 size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text)]">{weekDone}</p>
              <p className="text-xs text-[var(--color-text-light)]">Terminés cette semaine</p>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="card p-6 mb-8 animate-scale-in">
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Disponibilités
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Durée des créneaux (min)</label>
              <input
                type="number"
                value={availability.slotDuration}
                onChange={(e) =>
                  setAvailabilityState({
                    ...availability,
                    slotDuration: parseInt(e.target.value) || 30,
                  })
                }
                className="w-24 p-2 rounded-lg border border-gray-200 text-sm"
                min={10}
                max={120}
                step={5}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {Object.entries(dayLabels).map(([key, label]) => {
                const sched = availability.schedule[key];
                const isActive = sched !== null;

                return (
                  <div
                    key={key}
                    className={`p-3 rounded-xl border transition-colors ${
                      isActive
                        ? "border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{label}</span>
                      <button
                        onClick={() => {
                          const newSchedule = { ...availability.schedule };
                          newSchedule[key] = isActive
                            ? null
                            : { start: "09:00", end: "18:00" };
                          setAvailabilityState({
                            ...availability,
                            schedule: newSchedule,
                          });
                        }}
                        className={`w-8 h-5 rounded-full transition-colors relative ${
                          isActive ? "bg-[var(--color-primary)]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            isActive ? "left-3.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    {isActive && sched && (
                      <div className="flex items-center gap-1 text-xs">
                        <input
                          type="time"
                          value={sched.start}
                          onChange={(e) => {
                            const newSchedule = { ...availability.schedule };
                            newSchedule[key] = {
                              ...sched,
                              start: e.target.value,
                            };
                            setAvailabilityState({
                              ...availability,
                              schedule: newSchedule,
                            });
                          }}
                          className="p-1 rounded border border-gray-200 text-xs"
                        />
                        <span>—</span>
                        <input
                          type="time"
                          value={sched.end}
                          onChange={(e) => {
                            const newSchedule = { ...availability.schedule };
                            newSchedule[key] = {
                              ...sched,
                              end: e.target.value,
                            };
                            setAvailabilityState({
                              ...availability,
                              schedule: newSchedule,
                            });
                          }}
                          className="p-1 rounded border border-gray-200 text-xs"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleSaveAvailability}
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Enregistrer"
              )}
            </button>
          </div>
        )}

        {/* View toggle + navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("day")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === "day"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-light)] hover:bg-[var(--color-secondary)]"
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === "week"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-light)] hover:bg-[var(--color-secondary)]"
              }`}
            >
              Semaine
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium min-w-[180px] text-center">
              {view === "day"
                ? currentDate.toLocaleDateString("fr-BE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                : `Semaine du ${new Date(getWeekRange(currentDate).start).toLocaleDateString("fr-BE", { day: "numeric", month: "short" })}`}
            </span>
            <button
              onClick={() => navigate(1)}
              className="p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-secondary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
            >
              Aujourd&apos;hui
            </button>
          </div>
        </div>

        {/* Appointments List */}
        {Object.keys(groupedByDate).length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar size={48} className="mx-auto text-[var(--color-text-light)] mb-4 opacity-30" />
            <p className="text-[var(--color-text-light)]">Aucun rendez-vous cette période</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate)
              .sort(([a], [b]) => a.localeCompare(b))
              .filter(([date]) => {
                if (view === "day") return date === toDateString(currentDate);
                return true;
              })
              .map(([date, appts]) => (
                <div key={date}>
                  <h4 className="text-sm font-medium text-[var(--color-text-light)] mb-3">
                    {new Date(date + "T00:00:00").toLocaleDateString("fr-BE", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                    <span className="ml-2 text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded-full">
                      {appts.length} rdv
                    </span>
                  </h4>
                  <div className="space-y-2">
                    {appts.map((appt) => (
                      <div
                        key={appt.id}
                        className={`card p-4 flex items-center justify-between ${
                          appt.status === "done"
                            ? "opacity-60"
                            : appt.status === "no-show"
                            ? "opacity-40 border-red-200"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[50px]">
                            <p className="text-lg font-bold text-[var(--color-primary)]">
                              {appt.time}
                            </p>
                            <p className="text-[10px] text-[var(--color-text-light)]">
                              {appt.duration} min
                            </p>
                          </div>
                          <div className="h-10 w-px bg-gray-200" />
                          <div>
                            <p className="font-medium text-sm text-[var(--color-text)]">
                              {appt.patientName}
                            </p>
                            <p className="text-xs text-[var(--color-text-light)]">
                              {appt.patientEmail}
                            </p>
                            {appt.reason && (
                              <p className="text-xs text-[var(--color-accent)] mt-0.5">
                                {appt.reason}
                              </p>
                            )}
                          </div>
                        </div>

                        {appt.status === "booked" && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => appt.id && handleStatus(appt.id, "done")}
                              className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                              title="Marquer terminé"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => appt.id && handleStatus(appt.id, "no-show")}
                              className="p-2 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors"
                              title="Marquer absent"
                            >
                              <UserX size={18} />
                            </button>
                            <button
                              onClick={() => appt.id && handleStatus(appt.id, "cancelled")}
                              className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                              title="Annuler"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        )}

                        {appt.status !== "booked" && (
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              appt.status === "done"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {appt.status === "done" ? "Terminé" : "Absent"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
