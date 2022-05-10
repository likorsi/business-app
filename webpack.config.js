const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = () => {

    const env = dotenv.config().parsed;

    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});


    return {
        devServer: {
            historyApiFallback: {
                index:'/',
                rewrites: [
                    { from: /favicon.ico/, to: '[./src/favicon]' }
                ]
            },
            hot: true,
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.js',
            publicPath: '/',
        },
        resolve: {
            extensions: ['', '.js', '.jsx'],
            modules: [path.join(__dirname, 'src'), 'node_modules'],
            alias: {
                react: path.join(__dirname, 'node_modules', 'react'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    use: {
                        loader: 'source-map-loader',
                    },
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.(sass|less|css|scss)$/i,
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'sass-loader',
                        },
                    ],
                },
                {
                    test: /\.svg$/i,
                    issuer: /\.[jt]sx?$/,
                    use: ['@svgr/webpack'],
                }
            ],
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: './src/index.html',
            }),
            new webpack.DefinePlugin(envKeys),
            new FaviconsWebpackPlugin('./src/favicon.svg')
        ],
    }};