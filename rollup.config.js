import resolve from 'rollup-plugin-node-resolve';
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle";
import minify from 'rollup-plugin-babel-minify';

const browser = {
    // If using any exports from a symlinked project, uncomment the following:
    // preserveSymlinks: true,
    input: ['./src/browser.js'],
    output: {
        file: 'build/browser/functionalElement.js',
        format: 'es',
        sourcemap: true
    },
    plugins: [
        excludeDependenciesFromBundle(),
        minify({
            comments: false
        })
    ]
};

export default [
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