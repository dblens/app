const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

module.exports = withNextra({
  // Enable static export
  exportTrailingSlash: true,
  // Disable image optimization for static export compatibility
  images: {
    unoptimized: true,
  },
});
