const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    colors: {
      ...colors,
      transparent: 'transparent',
      gray: colors.blueGray,
      // gray: {
      //   50: '#dde5f9',

      //   100: '#bacbf4',

      //   200: '#96b2ef',

      //   300: '#6e99ec',

      //   400: '#4681df',

      //   500: '#3a6bb8',

      //   600: '#2e5593',

      //   700: '#23406f',

      //   800: '#182c4d',

      //   900: '#0e1a2d',
      //   ...colors.gray,
      // },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['odd'],
    },
  },
  plugins: [],
};
