import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import path from 'path';

const isWatch = process.argv.find((arg) => /^\-((w)|(-watch))$/.test(arg));
const WTN_DEMO_PATH = process.env.WTN_DEMO_PATH;
/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  external: ['react', 'axios', 'jose'],
  plugins: [
    json(),
    commonjs(),
    typescript({tsconfig: './tsconfig.json'}),
    nodeResolve({
      browser: true
    }),
    isWatch && WTN_DEMO_PATH && copy({
      targets: [{ src: 'dist/**/*', dest: path.resolve(WTN_DEMO_PATH, 'node_modules/whip-sdk-react/dist') }],
      verbose: true,
    })
  ],
}
