"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { practitioner } from "@/config/practitioner";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#a-propos", label: "À propos" },
  { href: "#contact", label: "Contact" },
  { href: "/portail", label: "Prendre rendez-vous", isAccent: true },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Name */}
        <Link
          href="/"
          className="flex flex-col no-underline group"
        >
          <span
            className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
              isScrolled ? "text-[var(--color-primary)]" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {practitioner.name}
          </span>
          <span
            className={`text-xs tracking-widest uppercase transition-colors duration-300 ${
              isScrolled ? "text-[var(--color-accent)]" : "text-[var(--color-accent-light)]"
            }`}
          >
            {practitioner.title}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.isAccent ? (
              <Link
                key={link.href}
                href={link.href}
                className="btn btn-accent ml-4 text-sm no-underline"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 no-underline ${
                  isScrolled
                    ? "text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            )
          )}

          {/* Phone button */}
          <a
            href={practitioner.phone.mobileHref}
            className={`ml-2 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 no-underline ${
              isScrolled
                ? "text-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
                : "text-white/90 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Appeler"
          >
            <Phone size={16} />
            <span className="hidden xl:inline">{practitioner.phone.mobile}</span>
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isScrolled ? "text-[var(--color-primary)]" : "text-white"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden animate-fade-in">
          <div className="glass mx-4 mt-2 rounded-2xl p-6 shadow-xl">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium no-underline transition-colors ${
                    link.isAccent
                      ? "bg-[var(--color-accent)] text-white text-center"
                      : "text-[var(--color-text)] hover:bg-[var(--color-secondary)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={practitioner.phone.mobileHref}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-[var(--color-primary)] hover:bg-[var(--color-secondary)] no-underline transition-colors"
              >
                <Phone size={18} />
                {practitioner.phone.mobile}
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
