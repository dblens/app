const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

module.exports = withNextra({
  // Enable static export for Cloudflare Pages
  output: 'export',
  trailingSlash: true,
  // Disable image optimization for static export compatibility
  images: {
    unoptimized: true,
  },
});
