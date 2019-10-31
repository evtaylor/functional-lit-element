export default [
    {
        // If using any exports from a symlinked project, uncomment the following:
        // preserveSymlinks: true,
        input: ['./src/browser.js'],
        output: {
            file: 'build/browser/functionalElement.js',
            format: 'es',
            sourcemap: true
        },
    }
];