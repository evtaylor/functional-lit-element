import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle";

export default [
    {
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