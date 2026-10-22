import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { canonicalPath, commercializationSeo, schemaFor, siteUrl } from '../../data/siteSeo.mjs';

const SEO = ({ title, description, type = 'website', image, imageAlt }) => {
    const { pathname } = useLocation();
    const path = canonicalPath(pathname);
    const canonical = `${siteUrl}${path}`;
    const page = path === '/venture' ? commercializationSeo : { title, description, type, image, imageAlt };
    const schema = schemaFor(path);
    const imageUrl = page.image ? new URL(page.image, siteUrl).href : null;
    const schemaText = schema ? JSON.stringify(schema).replaceAll('<', '\\u003c') : null;
    // These optional tags need explicit ownership: Helmet merges script/image
    // entries across animated route transitions instead of replacing them.
    useEffect(() => {
        const owned = [];
        const append = (tag, attrs, content) => {
            const element = document.createElement(tag);
            Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
            element.dataset.siteExtraSeo = 'true';
            if (content) element.textContent = content;
            document.head.appendChild(element);
            owned.push(element);
        };
        if (schemaText) append('script', { id: 'site-structured-data', type: 'application/ld+json' }, schemaText);
        if (imageUrl) {
            const properties = { 'og:image': imageUrl, 'og:image:width': '1200', 'og:image:height': '630', 'og:image:alt': page.imageAlt };
            Object.entries(properties).forEach(([property, content]) => append('meta', { property, content }));
            append('meta', { name: 'twitter:image', content: imageUrl });
            append('meta', { name: 'twitter:image:alt', content: page.imageAlt });
        }
        return () => owned.forEach(element => element.remove());
    }, [schemaText, imageUrl, page.imageAlt]);
    return <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content={page.type} />
        <meta property="og:site_name" content="Saeed Arabha" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={page.description} />

    </Helmet>;
};
export default SEO;
