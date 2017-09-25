import filesize from 'rollup-plugin-filesize';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
  dest: `./index.js`,
  entry: './src/index.js',
  moduleName: 'panzerschrank',
  format: 'es',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    uglify({
      compress: {
        drop_console: true,
        passes: 3,
      },
      mangle: {
        toplevel: true,
      },
    }, minify),
    filesize(),
  ],
  sourceMap: true,
  acorn: {
    allowReserved: true,
    ecmaVersion: 8,
  },
};
