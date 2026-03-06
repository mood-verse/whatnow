import { Navbar } from '@/components/mainPage/Navbar';
import { HeroSection } from '@/components/mainPage/HeroSection';
import { ProblemSection } from '@/components/mainPage/ProblemSection';
import { HowItWorks } from '@/components/mainPage/HowItWorks';
import { FeaturesSection } from '@/components/mainPage/FeaturesSection';
import { CTASection } from '@/components/mainPage/CTASection';
import { Footer } from '@/components/mainPage/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorks />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
