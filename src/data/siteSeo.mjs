export const siteUrl = 'https://www.saeedarabha.com';
export const person = {
  '@type': 'Person', '@id': `${siteUrl}/#person`, name: 'Saeed Arabha',
  url: `${siteUrl}/`, sameAs: ['https://www.linkedin.com/in/saeedarabha/'],
  knowsAbout: ['Materials science', 'Graphene', 'Two-dimensional materials', 'Research commercialization', 'Compressible flow exfoliation'],
};
const website = { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Saeed Arabha', url: `${siteUrl}/`, publisher: { '@id': person['@id'] } };
export const commercializationSeo = {
  title: 'Venture | Saeed Arabha',
  description: 'Explore Saeed Arabha’s materials commercialization case study: 40+ reported customer interviews, graphene market choices, business models, and pilot planning.',
  type: 'article',
  image: '/images/commercialization/commercialization-social.png',
  imageAlt: 'Saeed Arabha — Research commercialization, from materials science to market. Customer discovery, market strategy, and scale-up.',
};
export function canonicalPath(path) {
  if (path.toLowerCase().replace(/\/$/, '') === '/academiccv') return '/AcademicCV';
  if (['/commercialization', '/commercialization/', '/venture/'].includes(path)) return '/venture';
  if (path === '/journal' || (path.startsWith('/journal/') && !path.endsWith('/'))) return `${path}/`;
  return path;
}
export function schemaFor(path) {
  if (path === '/') return { '@context': 'https://schema.org', '@graph': [person, website,
    { '@type': 'ProfilePage', '@id': `${siteUrl}/#profile`, url: `${siteUrl}/`, name: 'Saeed Arabha | Materials Scientist & Researcher', mainEntity: { '@id': person['@id'] }, isPartOf: { '@id': website['@id'] } },
  ] };
  if (canonicalPath(path) !== '/venture') return null;
  const url = `${siteUrl}/venture`;
  return { '@context': 'https://schema.org', '@graph': [person, website,
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: commercializationSeo.title, description: commercializationSeo.description, isPartOf: { '@id': website['@id'] }, mainEntity: { '@id': `${url}#case-study` }, breadcrumb: { '@id': `${url}#breadcrumb` } },
    { '@type': 'Article', '@id': `${url}#case-study`, headline: commercializationSeo.title, description: commercializationSeo.description, mainEntityOfPage: { '@id': `${url}#webpage` }, author: { '@id': person['@id'] }, publisher: { '@id': person['@id'] }, contributor: { '@type': 'Person', name: 'Reza Rizvi' }, image: `${siteUrl}${commercializationSeo.image}`, inLanguage: 'en', about: ['Materials commercialization', 'Customer discovery', 'Compressible flow exfoliation', 'Graphene scale-up'], isAccessibleForFree: true },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` }, { '@type': 'ListItem', position: 2, name: 'Venture', item: url }] },
  ] };
}
