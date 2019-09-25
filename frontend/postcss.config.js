const config = {
  plugins: [
    require('postcss-import')(),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.tsx', './public/**/*.html'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    }),
  );
}

module.exports = config;
