/* eslint-disable */
// const withPlugins = require('next-compose-plugins')
// const withImages = require('next-images')
const teaserPlugin = require('terser-webpack-plugin')
module.exports = {
  swcMinify: true,
  webpack: (config) => {
    config.optimization.minimize = true;
    config.optimization.minimizer = [
      new teaserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
        extractComments: 'all',
      }),
    ]
    return config
  },
  images: {
    domains: []
  },
  env: {
    CMS_BASE: process.env.CMS_BASE,
    LOCAL_BASE: process.env.LOCAL_BASE,
    GTM_ID: process.env.GTM_ID,
  },
  poweredByHeader: false
}
