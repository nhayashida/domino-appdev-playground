import UglifyEsPlugin from 'uglify-es-webpack-plugin';
import { DefinePlugin } from 'webpack';
import merge from 'webpack-merge';
import common from './webpack.common';

const prod = merge(common, {
  mode: 'production',
  plugins: [
    new DefinePlugin({
      NODE_ENV: JSON.stringify('production'),
    }),
  ],
  optimization: {
    minimizer: [new UglifyEsPlugin()],
  },
});

export default prod;
