import resolve from 'rollup-plugin-node-resolve';
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle";

export default [
    {
        // If using any exports from a symlinked project, uncomment the following:
        // preserveSymlinks: true,
        input: ['./src/functionalElement.js'],
        output: {
            file: 'dist/web/functionalElement.js',
            format: 'es',
            sourcemap: true
        },
        plugins: [
            resolve()
        ]
    },
    {
        // If using any exports from a symlinked project, uncomment the following:
        // preserveSymlinks: true,
        input: ['./src/functionalElement.js'],
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