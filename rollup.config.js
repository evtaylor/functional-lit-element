import resolve from 'rollup-plugin-node-resolve';

export default {
    // If using any exports from a symlinked project, uncomment the following:
    // preserveSymlinks: true,
    input: ['./src/functionalElement.js'],
    output: {
        file: 'build/index.js',
        format: 'es',
        sourcemap: true
    },
    plugins: [
        resolve()
    ]
};