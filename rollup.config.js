import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';

const env = process.env.NODE_ENV;
const pkg = require('./package.json');

export default {
  input: 'src/index.js',
  output: {
    file: {
      es: pkg.module,
      cjs: pkg.main,
    }[env],
    format: env,
  },
  external: ['react', 'styled-components'],
  plugins: [
    resolve({
      module: true,
      browser: true,
      preferBuiltins: true,
    }),
    builtins(),
    commonjs(),
    filesize(),
  ],
};
