"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { practitioner } from "@/config/practitioner";
import {
  isFirebaseConfigured,
  createAppointment,
  getPatientAppointments,
  cancelAppointment,
  type Appointment,
} from "@/lib/firebase";
import {
  notifications,
  buildBookingConfirmationEmail,
  buildNewBookingNotification,
} from "@/lib/notifications";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  AlertCircle,
  Check,
  X,
  ArrowLeft,
  Loader2,
} from "lucide-react";

// ─── Slot Generation ─────────────────────────────────────────────
function generateSlots(date: Date): string[] {
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayName = dayNames[date.getDay()];
  const schedule =
    practitioner.weeklySchedule[dayName as keyof typeof practitioner.weeklySchedule];

  if (!schedule) return [];

  const slots: string[] = [];
  const [startH, startM] = schedule.start.split(":").map(Number);
  const [endH, endM] = schedule.end.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const duration = practitioner.slotDurationMinutes;

  for (let m = startMinutes; m + duration <= endMinutes; m += duration) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`);
  }
  return slots;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

// ─── Main Component ──────────────────────────────────────────────
export default function PortailPage() {
  const { user, loading, signIn, logOut } = useAuth();
  const [step, setStep] = useState<"select-date" | "select-time" | "confirm" | "success">("select-date");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  // Load patient appointments
  useEffect(() => {
    if (user) {
      getPatientAppointments(user.uid).then(setAppointments);
    }
  }, [user]);

  // Generate week days
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeekStart]);

  const slots = selectedDate ? generateSlots(selectedDate) : [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const navigateWeek = (direction: number) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + direction * 7);
    setCurrentWeekStart(newStart);
  };

  const handleBook = async () => {
    if (!user || !selectedDate || !selectedTime) return;
    setIsSubmitting(true);
    try {
      const dateStr = toDateString(selectedDate);
      const patientName = user.displayName || "Patient";
      const patientEmail = user.email || "";

      await createAppointment({
        patientId: user.uid,
        patientName,
        patientEmail,
        date: dateStr,
        time: selectedTime,
        duration: practitioner.slotDurationMinutes,
        reason: reason || undefined,
      });

      // Send confirmation email to patient
      const confirmationEmail = buildBookingConfirmationEmail({
        patientName,
        date: formatDate(selectedDate),
        time: selectedTime,
        practitionerName: practitioner.name,
        address: practitioner.address.full,
      });
      notifications.send("email", {
        to: patientEmail,
        ...confirmationEmail,
      }).catch((err) => console.error("Patient email failed:", err));

      // Send new booking notification to practitioner
      const practitionerEmail = buildNewBookingNotification({
        patientName,
        patientEmail,
        date: formatDate(selectedDate),
        time: selectedTime,
        reason: reason || undefined,
      });
      if (practitioner.email) {
        notifications.send("email", {
          to: practitioner.email,
          ...practitionerEmail,
        }).catch((err) => console.error("Practitioner email failed:", err));
      }

      setStep("success");
      // Refresh appointments
      const updated = await getPatientAppointments(user.uid);
      setAppointments(updated);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) return;
    try {
      await cancelAppointment(appointmentId);
      if (user) {
        const updated = await getPatientAppointments(user.uid);
        setAppointments(updated);
      }
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  const resetBooking = () => {
    setStep("select-date");
    setSelectedDate(null);
    setSelectedTime(null);
    setReason("");
  };

  // ─── Firebase Not Configured ─────────────────────────────────
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-[var(--color-accent)]" />
          </div>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Portail en cours de configuration
          </h1>
          <p className="text-[var(--color-text-light)] mb-6">
            Le système de réservation en ligne sera bientôt disponible.
            En attendant, prenez rendez-vous par téléphone.
          </p>
          <div className="space-y-3">
            <a href={practitioner.phone.mobileHref} className="btn btn-primary w-full no-underline">
              📱 {practitioner.phone.mobile}
            </a>
            <Link href="/" className="btn btn-secondary w-full no-underline">
              <ArrowLeft size={16} /> Retour au site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  // ─── Not Signed In ───────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          {/* Header */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors no-underline mb-8"
          >
            <ArrowLeft size={16} />
            Retour au site
          </Link>

          <div className="card p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center mx-auto mb-6">
              <Calendar size={32} className="text-white" />
            </div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Portail Patient
            </h1>
            <p className="text-[var(--color-text-light)] mb-8">
              Connectez-vous pour prendre rendez-vous avec {practitioner.name}
            </p>

            <button
              onClick={signIn}
              className="btn w-full justify-center gap-3 bg-white border-2 border-gray-200 text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-secondary)] py-3.5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </button>
          </div>

          <p className="text-xs text-[var(--color-text-light)] mt-6">
            En vous connectant, vous acceptez notre{" "}
            <Link href="/politique-de-confidentialite" className="underline">
              politique de confidentialité
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  // ─── Signed In ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Top bar */}
      <header className="glass sticky top-0 z-40 border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors no-underline"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1
                className="text-lg font-bold text-[var(--color-text)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Portail Patient
              </h1>
              <p className="text-xs text-[var(--color-text-light)]">
                {practitioner.name} — {practitioner.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-text-light)] hidden sm:block">
              {user.displayName}
            </span>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt=""
                className="w-8 h-8 rounded-full"
              />
            )}
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── Booking Panel ─────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              {step === "success" ? (
                /* Success */
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <Check size={40} className="text-green-600" />
                  </div>
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Rendez-vous confirmé !
                  </h2>
                  <p className="text-[var(--color-text-light)] mb-2">
                    {selectedDate && formatDate(selectedDate)} à {selectedTime}
                  </p>
                  <p className="text-sm text-[var(--color-text-light)] mb-8">
                    Un email de confirmation vous a été envoyé.
                  </p>
                  <button onClick={resetBooking} className="btn btn-primary">
                    Prendre un autre rendez-vous
                  </button>
                </div>
              ) : step === "confirm" ? (
                /* Confirmation */
                <div>
                  <button
                    onClick={() => setStep("select-time")}
                    className="flex items-center gap-2 text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors mb-6"
                  >
                    <ChevronLeft size={16} /> Modifier l&apos;heure
                  </button>

                  <h2
                    className="text-xl font-bold mb-6"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Confirmer le rendez-vous
                  </h2>

                  <div className="bg-[var(--color-bg)] rounded-xl p-5 mb-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-[var(--color-primary)]" />
                      <span>{selectedDate && formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-[var(--color-primary)]" />
                      <span>
                        {selectedTime} — {practitioner.slotDurationMinutes} minutes
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Motif de consultation (optionnel)
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Ex: douleurs lombaires, rééducation genou..."
                      className="w-full p-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none resize-none transition-all bg-white"
                      rows={3}
                      maxLength={200}
                    />
                  </div>

                  <button
                    onClick={handleBook}
                    disabled={isSubmitting}
                    className="btn btn-primary w-full justify-center py-3.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      "Confirmer le rendez-vous"
                    )}
                  </button>
                </div>
              ) : step === "select-time" ? (
                /* Time Selection */
                <div>
                  <button
                    onClick={() => {
                      setStep("select-date");
                      setSelectedTime(null);
                    }}
                    className="flex items-center gap-2 text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors mb-6"
                  >
                    <ChevronLeft size={16} /> Modifier la date
                  </button>

                  <h2
                    className="text-xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Choisir une heure
                  </h2>
                  <p className="text-sm text-[var(--color-text-light)] mb-6">
                    {selectedDate && formatDate(selectedDate)}
                  </p>

                  {slots.length === 0 ? (
                    <p className="text-center text-[var(--color-text-light)] py-8">
                      Aucun créneau disponible ce jour.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map((slot) => {
                        const isBooked = bookedSlots.has(
                          `${selectedDate && toDateString(selectedDate)}_${slot}`
                        );
                        return (
                          <button
                            key={slot}
                            disabled={isBooked}
                            onClick={() => {
                              setSelectedTime(slot);
                              setStep("confirm");
                            }}
                            className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                              isBooked
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                                : selectedTime === slot
                                ? "bg-[var(--color-primary)] text-white shadow-md"
                                : "bg-[var(--color-bg)] text-[var(--color-text)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] border border-transparent hover:border-[var(--color-primary)]/20"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Date Selection */
                <div>
                  <h2
                    className="text-xl font-bold mb-6"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Choisir une date
                  </h2>

                  {/* Week navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => navigateWeek(-1)}
                      className="p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {currentWeekStart.toLocaleDateString("fr-BE", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() => navigateWeek(1)}
                      className="p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-medium text-[var(--color-text-light)] pb-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                    {weekDays.map((date) => {
                      const isPast = date < today;
                      const dayNames = [
                        "sunday", "monday", "tuesday", "wednesday",
                        "thursday", "friday", "saturday",
                      ];
                      const dayName = dayNames[date.getDay()];
                      const hasSlots =
                        practitioner.weeklySchedule[
                          dayName as keyof typeof practitioner.weeklySchedule
                        ] !== null;
                      const isDisabled = isPast || !hasSlots;
                      const isSelected =
                        selectedDate &&
                        toDateString(date) === toDateString(selectedDate);
                      const isToday = toDateString(date) === toDateString(new Date());

                      return (
                        <button
                          key={toDateString(date)}
                          disabled={isDisabled}
                          onClick={() => {
                            setSelectedDate(date);
                            setStep("select-time");
                          }}
                          className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all ${
                            isDisabled
                              ? "text-gray-300 cursor-not-allowed"
                              : isSelected
                              ? "bg-[var(--color-primary)] text-white shadow-md"
                              : "hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                          } ${isToday && !isSelected ? "ring-2 ring-[var(--color-accent)] ring-offset-2" : ""}`}
                        >
                          <span className="font-medium">{date.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Appointments Sidebar ──────────────────────── */}
          <div className="lg:col-span-1">
            <h3
              className="text-lg font-bold mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Mes rendez-vous
            </h3>

            {appointments.filter((a) => a.status === "booked").length === 0 ? (
              <div className="card p-6 text-center">
                <Calendar size={32} className="mx-auto text-[var(--color-text-light)] mb-3 opacity-40" />
                <p className="text-sm text-[var(--color-text-light)]">
                  Aucun rendez-vous à venir
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments
                  .filter((a) => a.status === "booked")
                  .map((appt) => (
                    <div
                      key={appt.id}
                      className="card p-4 flex items-start justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm text-[var(--color-text)]">
                          {new Date(appt.date).toLocaleDateString("fr-BE", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="text-[var(--color-primary)] font-medium text-sm">
                          {appt.time}
                        </p>
                        {appt.reason && (
                          <p className="text-xs text-[var(--color-text-light)] mt-1">
                            {appt.reason}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => appt.id && handleCancel(appt.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Annuler"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
