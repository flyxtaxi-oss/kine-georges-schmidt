import type { Metadata } from "next";
import { practitioner } from "@/config/practitioner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: practitioner.fullTitle,
    template: `%s | ${practitioner.name}`,
  },
  description: practitioner.seo.description,
  keywords: [...practitioner.seo.keywords],
  authors: [{ name: practitioner.name }],
  creator: practitioner.name,
  metadataBase: new URL(practitioner.seo.siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: practitioner.fullTitle,
    description: practitioner.seo.description,
    url: practitioner.seo.siteUrl,
    siteName: practitioner.fullTitle,
    locale: practitioner.seo.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": practitioner.name,
  },
};

// JSON-LD structured data for LocalBusiness
function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthBusiness",
    "@id": practitioner.seo.siteUrl,
    name: practitioner.fullTitle,
    description: practitioner.seo.description,
    url: practitioner.seo.siteUrl,
    telephone: practitioner.phone.mobile,
    address: {
      "@type": "PostalAddress",
      streetAddress: practitioner.address.street,
      addressLocality: practitioner.address.city,
      postalCode: practitioner.address.postalCode,
      addressRegion: practitioner.address.region,
      addressCountry: practitioner.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: practitioner.address.coordinates.lat,
      longitude: practitioner.address.coordinates.lng,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: practitioner.googleRating.score,
      reviewCount: practitioner.googleRating.count,
      bestRating: 5,
      worstRating: 1,
    },
    priceRange: "$$",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Credit Card",
    areaServed: {
      "@type": "City",
      name: practitioner.address.city,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: practitioner.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Theme color */}
        <meta name="theme-color" content={practitioner.brand.primaryColor} />
        {/* JSON-LD */}
        <JsonLd />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
