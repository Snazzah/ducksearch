const path = require('path');

module.exports = {
  output: {
    filename: 'worker.js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [],
    alias: {
      needle: require.resolve('./src/needle')
    },
    fallback: {
      zlib: false,
      fs: false,
      https: false,
      fastify: false,
      express: false,
      path: false
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
}
