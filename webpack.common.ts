import os from 'os';
import path from 'path';
import { Configuration } from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const useExperimentalFeatures = process.env.CARBON_USE_EXPERIMENTAL_FEATURES === 'true';

const useBreakingChanges = process.env.CARBON_USE_BREAKING_CHANGES === 'true';

const replaceTable = {
  componentsX: useExperimentalFeatures,
  breakingChangesX: useBreakingChanges,
};

const common: Configuration = {
  entry: {
    playground: path.join(__dirname, 'src/client/playground/index.tsx'),
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
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length - 1,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.resolve(__dirname, '..', 'node_modules')],
                data: `
                $feature-flags: (
                  components-x: ${useExperimentalFeatures},
                  breaking-changes-x: ${useBreakingChanges},
                  grid: ${useExperimentalFeatures},
                  ui-shell: true,
                );
              `,
              },
            },
          ],
        }),
      },
      {
        test: /(\/|\\)FeatureFlags\.js$/,
        loader: 'string-replace-loader',
        options: {
          multiple: Object.keys(replaceTable).map(key => ({
            search: `export\\s+const\\s+${key}\\s*=\\s*false`,
            replace: `export const ${key} = ${replaceTable[key]}`,
            flags: 'i',
          })),
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new ExtractTextPlugin({
      filename: 'styles.css',
    }),
  ],
};

export default common;
