import Navbar from "@/frontend/components/landing/Navbar";
import Hero from "@/frontend/components/landing/Hero";
import ChannelLogos from "@/frontend/components/landing/ChannelLogos";
import Features from "@/frontend/components/landing/Features";
import HowItWorks from "@/frontend/components/landing/HowItWorks";
import CTA from "@/frontend/components/landing/CTA";
import Footer from "@/frontend/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#05050a] text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ChannelLogos />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
