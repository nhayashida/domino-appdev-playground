import path from 'path';
import { Configuration } from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';

const common: Configuration = {
  entry: {
    dql: path.join(__dirname, 'src/client/dql/index.tsx'),
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.join(__dirname, 'dist/proton/dql'),
    publicPath: '/proton/dql',
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(tsx)?$/,
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['node_modules'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'src/client/dql/index.html'),
      meta: {
        viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no',
      },
    }),
  ],
};

export default common;
