import HeroSection from "../components/home-page/hero-section";
import Features from "../components/home-page/features-3";
import CallToAction from "../components/home-page/call-to-action";
import Footer from "../components/dashboard/footer";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
}
