import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SEO = ({ title, description, type }) => {
    const { pathname } = useLocation();
    const canonicalPath = pathname.toLowerCase() === "/academiccv" ? "/AcademicCV"
        : pathname === "/journal" ? "/journal/"
        : pathname.startsWith("/journal/") && !pathname.endsWith("/") ? `${pathname}/`
        : pathname;
    const canonical = `https://www.saeedarabha.com${canonicalPath}`;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="Saeed Arabha" />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
};

export default SEO;
