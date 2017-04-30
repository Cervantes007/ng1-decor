var webpack = require('webpack');
var path = require('path');

var libPath = function(name) {
    if ( undefined === name ) {
        return 'dist';
    }

    return path.join('dist', name);
};

var webpack_opts = {
    entry: ['./src/index.ts'],
    target: 'node',
    output: {
        filename: 'index.js',
        libraryTarget: "commonjs2"
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            'node_modules',
            'src',
        ]
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: "tslint-loader"
            },
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader']
            }
        ]
    },
    externals: ['angular', 'reflect-metadata'],
    plugins: [
        // new webpack.optimize.UglifyJsPlugin()
    ]
};

module.exports = webpack_opts;
