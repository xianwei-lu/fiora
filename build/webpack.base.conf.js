const path = require('path');
const utils = require('./utils');
const config = require('../config/webpack');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: {
        pc: './src/client/index.pc.js',
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@': resolve('src'),
            assets: resolve('src/client/assets'),
            components: resolve('src/client/components'),
            features: resolve('src/client/features'),
            pages: resolve('src/client/pages'),
            styles: resolve('src/client/styles'),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: [
                    resolve('src'),
                    /node_modules\/chat-room-plugin/,
                ],
                exclude: /node_modules(?!\/chat-room-plugin)/,
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]'),
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
                },
            },
            {
                test: /\.(mp3|ogg|wav)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('sounds/[name].[hash:7].[ext]'),
                },
            },
        ],
    },
};
