import { JsonLd } from '@/components/json-ld';
import { About } from '@/sections/about';
import { DeliveryBand } from '@/sections/delivery-band';
import { CtaFinal } from '@/sections/cta-final';
import { Faq } from '@/sections/faq';
import { Hero } from '@/sections/hero';
import { LogoMarquee } from '@/sections/logo-marquee';
import { Portfolio } from '@/sections/portfolio';
import { Pricing } from '@/sections/pricing';
import { Process } from '@/sections/process';
import { Services } from '@/sections/services';
import { Stats } from '@/sections/stats';
import {
  faqSchema,
  localBusinessSchema,
  organizationSchema,
  servicesSchema,
  websiteSchema,
} from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  path: '/',
  ogTitle: 'Software que traz cliente e devolve o seu tempo',
  ogSubtitle: 'Sites, apps, sistemas e automações com IA para empresas que precisam crescer.',
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          websiteSchema(),
          localBusinessSchema(),
          faqSchema(),
          ...servicesSchema(),
        ]}
      />

      <Hero />
      <DeliveryBand />
      <LogoMarquee />
      <Services />
      <Process />
      <Portfolio />
      <Pricing />
      <Stats />
      <About />
      <Faq />
      <CtaFinal />
    </>
  );
}
