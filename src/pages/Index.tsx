import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import SymptomsSection from "@/components/SymptomsSection";
import BlogSection from "@/components/BlogSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import QuickAccessSection from "@/components/QuickAccessSection";
import AIChatAssistant from "@/components/AIChatAssistant";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <QuickAccessSection />
      <FeaturesGrid />
      <SymptomsSection />
      <BlogSection />
      <CTASection />
      <Footer />
      <AIChatAssistant />
    </div>
  );
};

export default Index;
