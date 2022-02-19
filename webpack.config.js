const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');


module.exports = () => {

    // call dotenv and it will return an Object with a parsed key
    const env = dotenv.config().parsed;

    // reduce it to a nice object, the same as before
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});


    return {
        devServer: {
            historyApiFallback: true,
            static: './',
            hot: true
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.js',
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
                    test: /\.s[ac]ss$/i,
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
            new webpack.DefinePlugin(envKeys)
        ],
    }};