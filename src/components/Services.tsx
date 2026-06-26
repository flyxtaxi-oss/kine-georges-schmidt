"use client";

import { useEffect, useRef, useState } from "react";
import { practitioner } from "@/config/practitioner";
import { Activity, Hand, Target } from "lucide-react";

const iconMap = {
  activity: Activity,
  hand: Hand,
  target: Target,
} as const;

export default function Services() {
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
    <section id="services" ref={sectionRef} className="section bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">
          Nos <span className="gradient-text">Services</span>
        </h2>
        <div className="divider" />
        <p className="section-subtitle">
          Une prise en charge adaptée à vos besoins, dans un cadre professionnel
          au cœur d&apos;Ixelles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {practitioner.services.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Activity;
            return (
              <div
                key={service.id}
                className={`card group cursor-default ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{
                  animationDelay: `${index * 0.15}s`,
                  opacity: isVisible ? undefined : 0,
                }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent size={26} className="text-white" />
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-3 text-[var(--color-text)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-[var(--color-text-light)] leading-relaxed text-[0.9375rem]">
                  {service.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-6 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary-light)] transition-all duration-500 rounded-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
