import { getCollection } from 'astro:content';

const site = 'https://portfolio-rub.netlify.app';

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/portfolio', priority: '0.9', changefreq: 'weekly' },
  { loc: '/servicios', priority: '0.9', changefreq: 'monthly' },
  { loc: '/brief', priority: '0.8', changefreq: 'monthly' },
  { loc: '/gracias', priority: '0.3', changefreq: 'monthly' },
];

export async function GET() {
  const projects = await getCollection('projects');
  
  const projectPages = projects.map(p => ({
    loc: `/projects/${p.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2026-07-02',
  }));

  const allPages = [...staticPages, ...projectPages];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${site}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
