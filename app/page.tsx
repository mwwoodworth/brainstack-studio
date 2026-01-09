import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import AIPlayground from '@/components/AIPlayground';
import LiveDashboard from '@/components/LiveDashboard';
import Capabilities from '@/components/Capabilities';
import Pricing from '@/components/Pricing';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <AIPlayground />
      <Capabilities />
      <LiveDashboard />
      <Pricing />
      <ContactForm />
      <Footer />
    </main>
  );
}
