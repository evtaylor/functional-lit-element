import resolve from 'rollup-plugin-node-resolve';
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle";
import minify from 'rollup-plugin-babel-minify';

export default [
    {
        // If using any exports from a symlinked project, uncomment the following:
        // preserveSymlinks: true,
        input: ['./src/index.js'],
        output: {
            file: 'dist/web/functionalElement.min.js',
            format: 'es',
            sourcemap: true
        },
        plugins: [
            resolve(),
            minify({
                comments: false
            })
        ]
    },
    {
        // If using any exports from a symlinked project, uncomment the following:
        // preserveSymlinks: true,
        input: ['./src/index.js'],
        output: {
            file: './build/functionalElement.js',
            format: 'es',
            sourcemap: false
        },
        plugins: [
            excludeDependenciesFromBundle()
        ]
    }
];