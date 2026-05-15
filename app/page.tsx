import { Hero } from '@/components/sections/Hero';
import { Threats } from '@/components/sections/Threats';
import { Solution } from '@/components/sections/Solution';
import { Pipeline } from '@/components/sections/Pipeline';
import { Architecture } from '@/components/sections/Architecture';
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
      <Pipeline />
      <Architecture />
      <Technology />
      <Markets />
      <Founder />
      <Contact />
    </>
  );
}
