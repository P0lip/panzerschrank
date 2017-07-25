const { rollup } = require('rollup');
const replace = require('rollup-plugin-replace');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { spawn } = require('child_process');

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

const dest = path.resolve(__dirname, 'bundle.js');
const mode = /development|test/.test(process.env.NODE_ENV) ? 'strict' : 'sloppy';

(async () => {
  const dir = await readdir(__dirname);
  const files = dir.filter(filename => filename.endsWith('bench.js'));
  (async function bench(entry) {
    if (entry === void 0) return;
    const bundle = await rollup({
      entry: path.resolve(__dirname, entry),
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          mode: JSON.stringify(mode),
        }),
      ],
      paths: {
        src: path.resolve(__dirname, '..', 'src'),
      },
      acorn: {
        allowReserved: true,
        ecmaVersion: 8,
      },
    });

    await bundle.write({
      format: 'es',
      footer: ';quit()',
      dest,
    });

    const d8 = spawn('d8', [dest]);

    d8.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    d8.on('close', async () => {
      // await unlink(dest);
      // bench(files.shift());
    });
  })(files.shift());
})();

