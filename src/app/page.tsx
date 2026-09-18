import Hero from "@/components/Hero";
import AboutBento from "@/components/AboutBento";
import Facilities from "@/components/Facilities";
import JourneyMask from "@/components/JourneyMask";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <Hero />
      <AboutBento />
      <Facilities />
      <JourneyMask />
      <Pricing />
      <Footer />
    </main>
  );
}
