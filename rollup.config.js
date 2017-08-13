import filesize from 'rollup-plugin-filesize';
import replace from 'rollup-plugin-replace';
import butternut from 'rollup-plugin-butternut';
import env from './src/env';

export default {
  dest: `./${env.mode}.js`,
  entry: './src/index.js',
  moduleName: 'panzerschrank',
  format: 'es',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      // todo: evaluate stuff from env with proper values to allow butternut do its job :)
    }),
    butternut({
      check: true,
      sourceMap: true,
    }),
    filesize(),
  ],
  sourceMap: true,
  acorn: {
    allowReserved: true,
    ecmaVersion: 8,
  },
};
