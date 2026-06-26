// Firebase client configuration
// All values from environment variables — no secrets in code

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is configured
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

let app: FirebaseApp | null = null;

function getApp() {
  if (!isFirebaseConfigured) return null;
  if (!app && getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  }
  return app || getApps()[0];
}

// ─── Auth ──────────────────────────────────────────────────────────
export function getFirebaseAuth() {
  const firebaseApp = getApp();
  if (!firebaseApp) return null;
  return getAuth(firebaseApp);
}

export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase non configuré");
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signOut() {
  const auth = getFirebaseAuth();
  if (!auth) return;
  return firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// ─── Firestore ─────────────────────────────────────────────────────
export function getDb() {
  const firebaseApp = getApp();
  if (!firebaseApp) return null;
  return getFirestore(firebaseApp);
}

// ─── Appointment Types ─────────────────────────────────────────────
export interface Appointment {
  id?: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
  reason?: string;
  status: "booked" | "done" | "no-show" | "cancelled";
  createdAt: Timestamp;
}

// ─── Appointment Operations ────────────────────────────────────────
export async function createAppointment(
  data: Omit<Appointment, "id" | "createdAt" | "status">
) {
  const db = getDb();
  if (!db) throw new Error("Firebase non configuré");

  return addDoc(collection(db, "appointments"), {
    ...data,
    status: "booked",
    createdAt: Timestamp.now(),
  });
}

export async function cancelAppointment(appointmentId: string) {
  const db = getDb();
  if (!db) throw new Error("Firebase non configuré");

  return updateDoc(doc(db, "appointments", appointmentId), {
    status: "cancelled",
  });
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: Appointment["status"]
) {
  const db = getDb();
  if (!db) throw new Error("Firebase non configuré");

  return updateDoc(doc(db, "appointments", appointmentId), { status });
}

export async function getPatientAppointments(patientId: string) {
  const db = getDb();
  if (!db) return [];

  const q = query(
    collection(db, "appointments"),
    where("patientId", "==", patientId),
    orderBy("date", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Appointment)
  );
}

export async function getAllAppointments(startDate?: string, endDate?: string) {
  const db = getDb();
  if (!db) return [];

  let q = query(collection(db, "appointments"), orderBy("date", "asc"));

  if (startDate) {
    q = query(q, where("date", ">=", startDate));
  }
  if (endDate) {
    q = query(q, where("date", "<=", endDate));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Appointment)
  );
}

export function subscribeToAppointments(
  callback: (appointments: Appointment[]) => void,
  dateFilter?: { start: string; end: string }
) {
  const db = getDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  let q = query(collection(db, "appointments"), orderBy("date", "asc"));
  if (dateFilter) {
    q = query(
      q,
      where("date", ">=", dateFilter.start),
      where("date", "<=", dateFilter.end)
    );
  }

  return onSnapshot(q, (snapshot) => {
    const appointments = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Appointment)
    );
    callback(appointments);
  });
}

// ─── Availability ──────────────────────────────────────────────────
export interface AvailabilityConfig {
  slotDuration: number; // minutes
  schedule: Record<string, { start: string; end: string } | null>;
  blockedDates: string[]; // YYYY-MM-DD dates when practitioner is unavailable
}

export async function getAvailability(): Promise<AvailabilityConfig | null> {
  const db = getDb();
  if (!db) return null;

  const snapshot = await getDocs(collection(db, "config"));
  const configDoc = snapshot.docs.find((d) => d.id === "availability");
  if (!configDoc) return null;
  return configDoc.data() as AvailabilityConfig;
}

export async function setAvailability(config: AvailabilityConfig) {
  const db = getDb();
  if (!db) throw new Error("Firebase non configuré");

  const { setDoc } = await import("firebase/firestore");
  return setDoc(doc(db, "config", "availability"), config);
}

// Re-exports
export { Timestamp };
export type { User, DocumentData };
