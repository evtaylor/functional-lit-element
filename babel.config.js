module.exports = function (api) {
    api.cache(true);
    const presets = [
        ['@babel/preset-env']
    ];
    const plugins= [
        [
            '@babel/plugin-transform-runtime', {
            corejs: 2,
            helpers: true,
            regenerator: true,
            useESModules: false
        }
        ]
    ];
    return {
        presets,
        plugins,
        include: ['test/**', /node_modules(?!(?:\/|\\)((lit-element)|(lit-html)))/]
    }
};