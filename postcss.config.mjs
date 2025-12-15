/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-import': {},
    'postcss-import-alias': {
      aliases: {
        '@': './src', // or your base directory
      },
    },
    tailwindcss: {},
  },
};

export default config;
