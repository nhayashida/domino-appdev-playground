import path from 'path';
import { Configuration } from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';

const useExperimentalFeatures = process.env.CARBON_USE_EXPERIMENTAL_FEATURES === 'true';

const useBreakingChanges = process.env.CARBON_USE_BREAKING_CHANGES === 'true';

const replaceTable = {
  componentsX: useExperimentalFeatures,
  breakingChangesX: useBreakingChanges,
};

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
