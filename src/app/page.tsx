import type { Metadata } from "next";
import Hero from "@/components/Hero";
import AboutBento from "@/components/AboutBento";
import Facilities from "@/components/Facilities";
import JourneyMask from "@/components/JourneyMask";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { SITE_CONFIG } from "@/lib/business-config";

export const metadata: Metadata = {
  title: {
    absolute: "Vortex Fitness Club | Gym & Fitness Center in Banasree, Rampura",
  },
  description:
    "Vortex Fitness Club in Banasree, Rampura offers modern strength equipment, dedicated female workout hours, aerobics & Zumba classes, and sauna recovery.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  // Confirmed details only: Unconfirmed specific street address ("House 48...") and email are omitted
  // from public JSON-LD until explicitly verified by the owner.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    "@id": `${SITE_CONFIG.url}/#gym`,
    name: SITE_CONFIG.name,
    url: `${SITE_CONFIG.url}/`,
    logo: `${SITE_CONFIG.url}/assets/logo.png`,
    image: `${SITE_CONFIG.url}/assets/og-image.jpg`,
    description: SITE_CONFIG.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.contact.address.locality,
      addressRegion: SITE_CONFIG.contact.address.city,
      addressCountry: SITE_CONFIG.contact.address.countryCode,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <main className="min-h-screen bg-white flex flex-col justify-between">
        <Hero />
        <AboutBento />
        <Facilities />
        <JourneyMask />
        <Pricing />
        <Footer />
      </main>
    </>
  );
}
