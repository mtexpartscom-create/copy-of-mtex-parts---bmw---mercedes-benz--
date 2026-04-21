/*
  MTEX PARTS – Home Page
  Design: Premium Dark Automotive Corporate
  Assembles all section components in order
*/

import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyUsStrip from "@/components/WhyUsStrip";
import ServicesSection from "@/components/ServicesSection";
import InventorySection from "@/components/InventorySection";
import AboutSection from "@/components/AboutSection";
import MapSection from "@/components/MapSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div style={{ background: "#0d0e10", minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <WhyUsStrip />
      <ServicesSection />
      <InventorySection />
      <AboutSection />
      <MapSection />
      <ReviewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
