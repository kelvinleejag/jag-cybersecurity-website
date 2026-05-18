import { Hero } from '@/components/sections/Hero';
import { Threats } from '@/components/sections/Threats';
import { Solution } from '@/components/sections/Solution';
import { Architecture } from '@/components/sections/Architecture';
import { Dashboard } from '@/components/sections/Dashboard';
import { Technology } from '@/components/sections/Technology';
import { Markets } from '@/components/sections/Markets';
import { Founder } from '@/components/sections/Founder';
import { Contact } from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Threats />
      <Solution />
      <Architecture />
      <Dashboard />
      <Technology />
      <Markets />
      <Founder />
      <Contact />
    </>
  );
}
