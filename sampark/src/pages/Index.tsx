import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import GrievanceSection from '@/components/GrievanceSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Chatbox from '@/components/Chatbox';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <GrievanceSection />
      <ContactSection />
      <Footer />
      <Chatbox />
    </div>
  );
};

export default Index;
