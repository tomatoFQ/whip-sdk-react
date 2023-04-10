import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [{
    file: 'dist/index.js',
    format: 'umd',
    name: 'default',
    sourcemap: true,
  }],
  plugins: [
    json(),
    commonjs(),
    typescript({tsconfig: './tsconfig.json'}),
  ],
}
