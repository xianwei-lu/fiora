const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

Object.keys(baseWebpackConfig.entry).forEach((name) => {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }),
    },
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: './src/client/index.html',
        //     favicon: './src/client/assets/images/favicon.png',
        //     chunks: ['pc'],
        //     inject: true,
        // }),
        new HtmlWebpackPlugin({
            filename: 'mobile.html',
            template: './src/client/index.html',
            favicon: './src/client/assets/images/favicon.png',
            chunks: ['mobile'],
            inject: true,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/client/index.html',
            favicon: './src/client/assets/images/favicon.png',
            chunks: ['next'],
            inject: true,
        }),
        new FriendlyErrorsPlugin(),
    ],
});
