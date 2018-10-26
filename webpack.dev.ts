import merge from 'webpack-merge';
import common from './webpack.common';

const dev = merge(common, {
  mode: 'development',
  devtool: 'source-map',
});

export default dev;
