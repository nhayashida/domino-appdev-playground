import autoprefixer from 'autoprefixer';
import path from 'path';
import { Configuration } from 'webpack';

const common: Configuration = {
  entry: {
    dql: './src/client/components/dql/index.tsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist'),
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
        use: [{ loader: 'awesome-typescript-loader' }],
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: ['last 1 version', 'ie >= 11'],
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, '..', 'node_modules')],
            },
          },
        ],
      },
    ],
  },
};

export default common;
