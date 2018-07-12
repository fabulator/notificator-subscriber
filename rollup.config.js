import { getBaseBabelConfig } from '@socifi/rollup-config/src/helpers';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import includePaths from 'rollup-plugin-includepaths';
import packageJson from './package.json';

const baseConfig = {
    treeshake: {
        propertyReadSideEffects: false,
    },
    plugins: [
        babel(Object.assign({}, getBaseBabelConfig(false, {
            browsers: packageJson.browserslist
        }), {
            exclude: 'node_modules/**',
        })),
    ],
};

const plugins = [
    includePaths({
        extensions: ['.js', '.jsx'],
    }),
    baseConfig.plugins[0],
    resolve({}),
    commonjs({}),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
];

export default [
    Object.assign({}, baseConfig, {
        input: './src/service-worker/sw.js',
        output: {
            file: './build/sw.js',
            format: 'es',
        },
        plugins,
    }),
    Object.assign({}, baseConfig, {
        input: './src/app/index.jsx',
        output: {
            file: './build/app.js',
            format: 'es',
        },
        plugins,
    }),
];
