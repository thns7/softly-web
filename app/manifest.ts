import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

/** PWA básico: instalável, com cor de tema e ícones. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0E0E11',
    theme_color: '#0E0E11',
    lang: 'pt-BR',
    categories: ['business', 'productivity', 'developer'],
    // O SVG com sizes "any" atende ao critério de instalação do Chrome e evita
    // manter três bitmaps fora de sincronia com a marca.
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
