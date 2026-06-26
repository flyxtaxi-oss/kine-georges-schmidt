import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { practitioner } from "@/config/practitioner";

export const metadata: Metadata = {
  title: "Portail Patient",
  description: `Prenez rendez-vous en ligne avec ${practitioner.name}, ${practitioner.title.toLowerCase()} à ${practitioner.address.city}.`,
};

export default function PortailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
