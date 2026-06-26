import Link from "next/link";
import { practitioner } from "@/config/practitioner";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-primary-dark)] text-white/70">
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3
              className="text-white text-xl font-bold mb-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {practitioner.name}
            </h3>
            <p className="text-[var(--color-accent)] text-sm font-medium mb-4">
              {practitioner.title}
            </p>
            <p className="text-sm leading-relaxed">
              {practitioner.seo.description}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/#services"
                className="text-sm text-white/60 hover:text-[var(--color-accent)] transition-colors no-underline"
              >
                Services
              </Link>
              <Link
                href="/#a-propos"
                className="text-sm text-white/60 hover:text-[var(--color-accent)] transition-colors no-underline"
              >
                À propos
              </Link>
              <Link
                href="/#contact"
                className="text-sm text-white/60 hover:text-[var(--color-accent)] transition-colors no-underline"
              >
                Contact
              </Link>
              <Link
                href="/portail"
                className="text-sm text-white/60 hover:text-[var(--color-accent)] transition-colors no-underline"
              >
                Prendre rendez-vous
              </Link>
            </nav>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-2.5 text-sm">
              <p>{practitioner.address.street}</p>
              <p>
                {practitioner.address.postalCode} {practitioner.address.city}
              </p>
              <a
                href={practitioner.phone.mobileHref}
                className="block text-white/60 hover:text-[var(--color-accent)] transition-colors no-underline"
              >
                {practitioner.phone.mobile}
              </a>
              <a
                href={practitioner.phone.landlineHref}
                className="block text-white/60 hover:text-[var(--color-accent)] transition-colors no-underline"
              >
                {practitioner.phone.landline}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {currentYear} {practitioner.name} — {practitioner.title}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={practitioner.legal.privacyPolicyUrl}
              className="text-xs text-white/40 hover:text-white/70 transition-colors no-underline"
            >
              Politique de confidentialité
            </Link>
            {practitioner.inamiNumber &&
              !practitioner.inamiNumber.startsWith("PLACEHOLDER") && (
                <span className="text-xs text-white/30">
                  INAMI: {practitioner.inamiNumber}
                </span>
              )}
          </div>
        </div>
      </div>
    </footer>
  );
}
