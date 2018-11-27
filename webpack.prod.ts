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
});

export default prod;
