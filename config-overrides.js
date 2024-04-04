const webpack = require("webpack")
module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer/"),
    path: false,
    fs: false,
    stream: false,
  }

  config.plugins = [...config.plugins, new webpack.ProvidePlugin({ Buffer: ["buffer", "Buffer"] })]

  return config
}