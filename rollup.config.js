import filesize from 'rollup-plugin-filesize';
import replace from 'rollup-plugin-replace';
import butternut from 'rollup-plugin-butternut';

const mode = /development|test/.test(process.env.NODE_ENV) ? 'strict' : 'sloppy';

export default {
  dest: `./${mode}.js`,
  entry: './src/index.js',
  moduleName: 'panzerschrank',
  format: 'es',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      mode: JSON.stringify(mode),
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
