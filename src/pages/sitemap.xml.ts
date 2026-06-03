import { getCollection } from 'astro:content';
import { getContentPath } from '../lib/contentPaths';
import { locations } from '../data/locations/index';

const SITE_URL = 'https://besthomewarrantynearme.com';
const STATIC_ROUTES = [
  '/',
  '/home-warranty/',
  '/compare/',
  '/coverage/',
  '/blog/',
  '/glossary/',
  '/about/',
  '/contact/',
  '/connect-insurance/',
  '/home-protection-profile/',
  '/home-protection-gap-check/',
  '/privacy/',
  '/terms/'
  // /recommendations/ is intentionally excluded — it is personalized and noindex
];

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function formatDate(date?: Date) {
  return date?.toISOString().slice(0, 10);
}

function urlEntry(pathname: string, lastmod?: string, priority = '0.7') {
  const loc = new URL(pathname, SITE_URL).href;
  return [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    `    <priority>${priority}</priority>`,
    '  </url>'
  ].filter(Boolean).join('\n');
}

export async function GET() {
  const [coverage, blog, glossary] = await Promise.all([
    getCollection('coverage'),
    getCollection('blog'),
    getCollection('glossary')
  ]);

  const locationStateUrls = locations.map((s) =>
    urlEntry(`/home-warranty/${s.slug}/`, undefined, '0.8')
  );
  const locationCityUrls = locations.flatMap((s) =>
    s.cities.map((c) => urlEntry(`/home-warranty/${s.slug}/${c.slug}/`, undefined, '0.7'))
  );

  const urls = [
    ...STATIC_ROUTES.map((route) => urlEntry(route, undefined, route === '/' ? '1.0' : '0.8')),
    ...locationStateUrls,
    ...locationCityUrls,
    ...coverage.map((entry) => urlEntry(getContentPath('coverage', entry), undefined, '0.9')),
    ...blog.map((entry) => urlEntry(getContentPath('blog', entry), formatDate(entry.data.updatedDate ?? entry.data.pubDate), '0.7')),
    ...glossary.map((entry) => urlEntry(getContentPath('glossary', entry), undefined, '0.6'))
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    }
  );
}
