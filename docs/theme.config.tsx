import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>DB Lens</span>,
  project: {
    link: "https://github.com/dblens/app",
  },
  chat: {
    link: "https://discord.gg/n6fNgRdX",
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s | DB Lens",
      twitter: {
        handle: "@db_lens",
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://dblens.app/',
        site_name: 'DB Lens',
        images: [
          {
            url: 'https://dblens.app/images/favicon.png',
            width: 1200,
            height: 630,
            alt: 'DB Lens',
          },
        ],
      },
      additionalMetaTags: [
        {
          property: "author",
          content: "Sooraj Sanker",
        },
        {
          name: "keywords",
          content:
            "DB Lens, database exploration, database analysis, SQL, ER diagrams",
        },
      ],
    };
  },
  docsRepositoryBase: "https://github.com/dblens/app",
  footer: {
    text: "DB Lens © 2024",
  },
};

export default config;
