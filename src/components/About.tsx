"use client";

import { useEffect, useRef, useState } from "react";
import { practitioner } from "@/config/practitioner";
import CloudinaryImage from "./CloudinaryImage";
import { Star, Award, Globe } from "lucide-react";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const hasBio = practitioner.bio && !practitioner.bio.startsWith("PLACEHOLDER");
  const hasInami = practitioner.inamiNumber && !practitioner.inamiNumber.startsWith("PLACEHOLDER");

  return (
    <section
      id="a-propos"
      ref={sectionRef}
      className="section bg-[var(--color-surface)]"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">
          À <span className="gradient-text">Propos</span>
        </h2>
        <div className="divider" />
        <p className="section-subtitle">
          Un praticien expérimenté au service de votre bien-être.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Portrait */}
          <div
            className={`${isVisible ? "animate-slide-in-left" : "opacity-0"}`}
            style={{ opacity: isVisible ? undefined : 0 }}
          >
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <CloudinaryImage
                  imageKey="portrait"
                  alt={`${practitioner.name}, ${practitioner.title}`}
                  width={600}
                  height={700}
                  className="w-full aspect-[5/6]"
                  placeholderText="Photo du praticien"
                />
              </div>
              {/* Decorative frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-[var(--color-accent)] -z-10 opacity-30" />
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-[var(--color-accent)] opacity-10 blur-xl" />
            </div>
          </div>

          {/* Bio content */}
          <div
            className={`${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: "0.2s", opacity: isVisible ? undefined : 0 }}
          >
            <h3
              className="text-2xl lg:text-3xl font-bold mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {practitioner.name}
            </h3>
            <p className="text-[var(--color-accent)] font-medium mb-6 text-lg">
              {practitioner.title}
            </p>

            {hasBio ? (
              <p className="text-[var(--color-text-light)] leading-relaxed mb-8 text-[0.9375rem]">
                {practitioner.bio}
              </p>
            ) : (
              <div className="bg-[var(--color-secondary)] rounded-xl p-4 mb-8 border border-dashed border-[var(--color-accent)]/30">
                <p className="text-[var(--color-text-light)] text-sm italic">
                  📝 Biographie à compléter — informations factuelles et objectives uniquement
                  (réglementation belge en matière de publicité des soins de santé).
                </p>
              </div>
            )}

            {/* Stats / Facts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* Google Rating */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-bg)]">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                  <Star size={20} className="text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="font-bold text-lg text-[var(--color-text)]">
                    {practitioner.googleRating.score}/5
                  </p>
                  <p className="text-xs text-[var(--color-text-light)]">
                    {practitioner.googleRating.count} avis Google
                  </p>
                </div>
              </div>

              {/* INAMI */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-bg)]">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <Award size={20} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[var(--color-text)]">
                    {hasInami ? `INAMI ${practitioner.inamiNumber}` : "INAMI"}
                  </p>
                  <p className="text-xs text-[var(--color-text-light)]">
                    {hasInami ? "Agréé" : "N° à confirmer"}
                  </p>
                </div>
              </div>

              {/* Languages */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-bg)]">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)]/10 flex items-center justify-center">
                  <Globe size={20} className="text-[var(--color-primary-light)]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[var(--color-text)]">
                    Langues
                  </p>
                  <p className="text-xs text-[var(--color-text-light)]">
                    {practitioner.languages.filter(l => !l.startsWith("PLACEHOLDER")).join(", ") || "À confirmer"}
                  </p>
                </div>
              </div>
            </div>

            {/* Services list */}
            <div className="flex flex-wrap gap-2">
              {practitioner.services.map((service) => (
                <span
                  key={service.id}
                  className="px-4 py-2 rounded-full bg-[var(--color-primary)]/5 text-[var(--color-primary)] text-sm font-medium border border-[var(--color-primary)]/10"
                >
                  {service.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
