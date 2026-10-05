import { about } from '@/content/about';
import { faq } from '@/content/faq';
import { plans } from '@/content/pricing';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { absoluteUrl } from '@/lib/seo';
import type { Project } from '@/content/projects';

/**
 * Dados estruturados (schema.org). Cada função devolve um objeto que é
 * serializado num <script type="application/ld+json"> pelo componente JsonLd.
 */

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${absoluteUrl('/')}#organization`,
  name: site.name,
  legalName: site.legalName,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/icon.svg'),
  description: site.description,
  foundingDate: String(site.foundedYear),
  email: site.contact.email,
  telephone: `+${site.contact.whatsappNumber}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.contact.address,
    addressLocality: site.contact.city,
    addressRegion: site.contact.state,
    postalCode: site.contact.postalCode,
    addressCountry: 'BR',
  },
  sameAs: [site.social.instagram, site.social.github],
  numberOfEmployees: { '@type': 'QuantitativeValue', value: about.team.length },
});

export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${absoluteUrl('/')}#localbusiness`,
  name: site.name,
  image: absoluteUrl('/opengraph-image'),
  url: absoluteUrl('/'),
  telephone: `+${site.contact.whatsappNumber}`,
  priceRange: 'R$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.contact.address,
    addressLocality: site.contact.city,
    addressRegion: site.contact.state,
    postalCode: site.contact.postalCode,
    addressCountry: 'BR',
  },
  // Centro de São Paulo. TODO: coordenadas do endereço real quando houver.
  geo: { '@type': 'GeoCoordinates', latitude: -23.5505, longitude: -46.6333 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  areaServed: { '@type': 'Country', name: 'Brasil' },
});

export const servicesSchema = () =>
  services.map((service) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    serviceType: service.title,
    provider: { '@id': `${absoluteUrl('/')}#organization` },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: plans[0]?.priceMonthly ?? 7900,
        priceCurrency: 'BRL',
      },
    },
  }));

export const faqSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: absoluteUrl('/'),
  name: site.name,
  inLanguage: 'pt-BR',
  publisher: { '@id': `${absoluteUrl('/')}#organization` },
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const caseStudySchema = (project: Project) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: project.title,
  description: project.summary,
  about: project.client,
  datePublished: `${project.year}-01-01`,
  author: { '@id': `${absoluteUrl('/')}#organization` },
  publisher: { '@id': `${absoluteUrl('/')}#organization` },
  mainEntityOfPage: absoluteUrl(`/projetos/${project.slug}`),
});

export const articleSchema = (input: {
  title: string;
  description: string;
  date: string;
  slug: string;
  author: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: input.title,
  description: input.description,
  datePublished: input.date,
  dateModified: input.date,
  author: { '@type': 'Person', name: input.author },
  publisher: { '@id': `${absoluteUrl('/')}#organization` },
  mainEntityOfPage: absoluteUrl(`/insights/${input.slug}`),
  inLanguage: 'pt-BR',
});
