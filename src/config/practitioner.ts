// config/practitioner.ts — ONE FILE TO EDIT FOR A NEW CLIENT
// Clone this project, edit this file, and deploy for a new practitioner.

export const practitioner = {
  // ─── Identity ─────────────────────────────────────────────────────
  name: "Georges Schmidt",
  title: "Kinésithérapeute",
  fullTitle: "Georges Schmidt — Kinésithérapeute",

  // ─── Contact ──────────────────────────────────────────────────────
  phone: {
    mobile: "+32 476 32 20 00",
    landline: "+32 2 538 80 95",
    mobileHref: "tel:+32476322000",
    landlineHref: "tel:+3225388095",
  },
  email: "contact@kine-georges-schmidt.be", // TODO: confirm real email
  address: {
    street: "Place du Châtelain 24",
    postalCode: "1050",
    city: "Ixelles",
    country: "Belgium",
    countryCode: "BE",
    region: "Bruxelles-Capitale",
    full: "Place du Châtelain 24, 1050 Ixelles, Belgium",
    googleMapsUrl:
      "https://www.google.com/maps/place/Pl.+du+Ch%C3%A2telain+24,+1050+Ixelles",
    coordinates: {
      lat: 50.8271,
      lng: 4.358,
    },
  },

  // ─── Professional ─────────────────────────────────────────────────
  inamiNumber: "PLACEHOLDER_INAMI", // TODO: add real INAMI number
  languages: ["Français"], // TODO: confirm full language list
  bio: "PLACEHOLDER_BIO", // TODO: add real bio — keep factual, no superlatives
  services: [
    {
      id: "kinesitherapie",
      name: "Kinésithérapie",
      description:
        "Prise en charge des troubles musculo-squelettiques, rééducation fonctionnelle et accompagnement post-opératoire.",
      icon: "activity" as const,
    },
    {
      id: "osteopathie",
      name: "Ostéopathie",
      description:
        "Approche manuelle globale visant à restaurer la mobilité des structures du corps.",
      icon: "hand" as const,
    },
    {
      id: "pcp-therapy",
      name: "PCP Therapy",
      description:
        "Technique ciblant les douleurs lombaires et les tendinopathies.",
      icon: "target" as const,
    },
  ],

  // ─── Availability ─────────────────────────────────────────────────
  availability: "Sur rendez-vous", // DO NOT state 24/7 — confirm real hours
  slotDurationMinutes: 30,
  weeklySchedule: {
    monday: { start: "09:00", end: "18:00" },
    tuesday: { start: "09:00", end: "18:00" },
    wednesday: { start: "09:00", end: "18:00" },
    thursday: { start: "09:00", end: "18:00" },
    friday: { start: "09:00", end: "17:00" },
    saturday: null,
    sunday: null,
  } as Record<string, { start: string; end: string } | null>,

  // ─── Reviews (factual mention only) ───────────────────────────────
  googleRating: {
    score: 5.0,
    count: 5,
    url: "https://www.google.com/maps/place/Georges+Schmidt",
  },

  // ─── Design / Branding ───────────────────────────────────────────
  brand: {
    primaryColor: "#1B4D4D",
    primaryLight: "#2A7A7A",
    primaryDark: "#0F3333",
    secondaryColor: "#F5F0E8",
    accentColor: "#C9A96E",
    accentLight: "#D4BA85",
    textColor: "#1A1A2E",
    textLight: "#6B7280",
    backgroundColor: "#FAFAF7",
    surfaceColor: "#FFFFFF",
    heroOverlay: "rgba(27,77,77,0.75)",
    fontHeading: "Playfair Display",
    fontBody: "Inter",
  },

  // ─── Cloudinary ───────────────────────────────────────────────────
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
    folder: "kine-georges-schmidt",
    images: {
      hero: "hero-cabinet",
      portrait: "portrait",
      cabinet1: "cabinet-1",
      cabinet2: "cabinet-2",
      logo: "logo",
    },
  },

  // ─── SEO ──────────────────────────────────────────────────────────
  seo: {
    siteUrl:
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://kine-georges-schmidt.vercel.app",
    locale: "fr_BE",
    keywords: [
      "kinésithérapeute Ixelles",
      "kiné Place du Châtelain",
      "ostéopathe Ixelles",
      "PCP Therapy Bruxelles",
      "kinésithérapie Bruxelles",
      "kiné Ixelles",
      "rééducation Ixelles",
    ],
    description:
      "Georges Schmidt, kinésithérapeute à Ixelles. Kinésithérapie, ostéopathie et PCP Therapy. Place du Châtelain 24, 1050 Ixelles.",
  },

  // ─── Social ───────────────────────────────────────────────────────
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },

  // ─── Legal ────────────────────────────────────────────────────────
  legal: {
    gdprControllerName: "Georges Schmidt",
    gdprControllerAddress: "Place du Châtelain 24, 1050 Ixelles, Belgium",
    privacyPolicyUrl: "/politique-de-confidentialite",
  },
} as const;

// Helper to build Cloudinary URL
export function cloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string } = {}
): string {
  const { cloudName, folder } = practitioner.cloudinary;
  if (!cloudName) return "";
  const transforms = ["f_auto", "q_auto"];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${folder}/${publicId}`;
}

export type Practitioner = typeof practitioner;
export type Service = (typeof practitioner.services)[number];
