const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

const webpackConfig = {
  ...defaultConfig,
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve.alias,
      '@blocks': path.resolve(__dirname, 'src/blocks'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@constants': path.resolve(__dirname, 'src/constants'),
    },
  },
};

module.exports = webpackConfig;
