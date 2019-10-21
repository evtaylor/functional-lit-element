const path = require('path');

module.exports = {
    entry: './src/functionalElement.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'functionalElement.js'
    }
};