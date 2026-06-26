import Link from "next/link";
import { practitioner } from "@/config/practitioner";
import CloudinaryImage from "./CloudinaryImage";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <CloudinaryImage
          imageKey="hero"
          alt="Cabinet de kinésithérapie"
          width={1920}
          height={1080}
          className="w-full h-full"
          priority
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              135deg,
              rgba(15,51,51,0.92) 0%,
              rgba(27,77,77,0.80) 40%,
              rgba(42,122,122,0.70) 70%,
              rgba(201,169,110,0.50) 100%
            )`,
          }}
        />
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[var(--color-accent)] opacity-10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-[var(--color-primary-light)] opacity-10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white">
        {/* Badge */}
        <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          {practitioner.availability}
        </div>

        {/* Title */}
        <h1
          className="animate-fade-in-up stagger-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "var(--font-heading)", opacity: 0 }}
        >
          {practitioner.name}
        </h1>

        <p
          className="animate-fade-in-up stagger-2 text-lg sm:text-xl md:text-2xl font-light tracking-wide text-white/80 mb-4"
          style={{ opacity: 0 }}
        >
          {practitioner.title}
        </p>

        {/* Services tags */}
        <div
          className="animate-fade-in-up stagger-3 flex flex-wrap justify-center gap-3 mb-10"
          style={{ opacity: 0 }}
        >
          {practitioner.services.map((service) => (
            <span
              key={service.id}
              className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white/90"
            >
              {service.name}
            </span>
          ))}
        </div>

        {/* Location */}
        <p
          className="animate-fade-in-up stagger-4 text-white/70 text-sm mb-8 flex items-center justify-center gap-2"
          style={{ opacity: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {practitioner.address.street}, {practitioner.address.postalCode} {practitioner.address.city}
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-in-up stagger-5 flex flex-col sm:flex-row gap-4 justify-center"
          style={{ opacity: 0 }}
        >
          <Link
            href="/portail"
            className="btn btn-accent text-base px-8 py-4 no-underline"
          >
            Prendre rendez-vous
          </Link>
          <a
            href={practitioner.phone.mobileHref}
            className="btn btn-white text-base px-8 py-4 no-underline"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Appeler
          </a>
        </div>

        {/* Google Rating - factual only */}
        <div
          className="animate-fade-in-up mt-12 inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15"
          style={{ animationDelay: "0.7s", opacity: 0 }}
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#C9A96E"
                stroke="none"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-white/80">
            {practitioner.googleRating.score}/5 — {practitioner.googleRating.count} avis Google
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
