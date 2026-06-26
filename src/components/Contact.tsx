"use client";

import { useEffect, useRef, useState } from "react";
import { practitioner } from "@/config/practitioner";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Contact() {
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

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)`,
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[var(--color-accent)] opacity-5 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-white opacity-5 blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2
          className="section-title text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Nous <span className="text-[var(--color-accent)]">Contacter</span>
        </h2>
        <div className="divider" style={{ margin: "1rem auto 0" }} />
        <p className="section-subtitle text-white/70">
          Prenez rendez-vous ou contactez-nous pour toute question.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {/* Address */}
            <a
              href={practitioner.address.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-start gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all duration-300 no-underline group ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: "0.1s", opacity: isVisible ? undefined : 0 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center shrink-0">
                <MapPin size={22} className="text-[var(--color-accent)]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
                  Adresse
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-70 transition-opacity text-white" />
                </h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  {practitioner.address.street}
                  <br />
                  {practitioner.address.postalCode} {practitioner.address.city},{" "}
                  {practitioner.address.country}
                </p>
              </div>
            </a>

            {/* Phone */}
            <div
              className={`flex items-start gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: "0.2s", opacity: isVisible ? undefined : 0 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center shrink-0">
                <Phone size={22} className="text-[var(--color-accent)]" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Téléphone</h4>
                <div className="space-y-1">
                  <a
                    href={practitioner.phone.mobileHref}
                    className="block text-white/70 text-sm hover:text-[var(--color-accent)] transition-colors no-underline"
                  >
                    📱 {practitioner.phone.mobile}
                  </a>
                  <a
                    href={practitioner.phone.landlineHref}
                    className="block text-white/70 text-sm hover:text-[var(--color-accent)] transition-colors no-underline"
                  >
                    ☎️ {practitioner.phone.landline}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div
              className={`flex items-start gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: "0.3s", opacity: isVisible ? undefined : 0 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center shrink-0">
                <Clock size={22} className="text-[var(--color-accent)]" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Horaires</h4>
                <p className="text-white/70 text-sm">
                  {practitioner.availability}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div
              className={`pt-2 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: "0.4s", opacity: isVisible ? undefined : 0 }}
            >
              <Link
                href="/portail"
                className="btn btn-accent w-full justify-center text-base py-4 no-underline"
              >
                Prendre rendez-vous en ligne
              </Link>
            </div>
          </div>

          {/* Google Maps */}
          <div
            className={`rounded-2xl overflow-hidden shadow-2xl border border-white/10 min-h-[400px] ${
              isVisible ? "animate-scale-in" : "opacity-0"
            }`}
            style={{ animationDelay: "0.3s", opacity: isVisible ? undefined : 0 }}
          >
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}&q=${encodeURIComponent(practitioner.address.full)}&zoom=16`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Localisation ${practitioner.name}`}
            />
            {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary-dark)]/80">
                <div className="text-center text-white/60 p-8">
                  <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    Carte Google Maps
                    <br />
                    <span className="text-xs opacity-70">
                      (Ajoutez NEXT_PUBLIC_GOOGLE_MAPS_KEY dans .env.local)
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
