import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServiceSections from '@/components/ServiceSections';
import GovernmentSchemes from '@/components/GovernmentSchemes';
import LatestUpdates from '@/components/LatestUpdates';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServiceSections />
        <GovernmentSchemes />
        <LatestUpdates />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
