const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: '[name].css'
});

const path = require('path');

module.exports = {
    entry: './src/index.jsx',
    module: {
        rules: [
            {
                test:/\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                  ],
            },
            {
                test: /\.(woff|otf|woff2|ttf|eot)$/,
                exclude: /node_modules/,
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: 'assets/fonts',
                        publicPath: 'assets/fonts',
                        name: '[path][name].[ext]',
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                exclude: /node_modules/,
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: 'assets/images',
                        publicPath: 'assets/images',
                        name: '[path][name].[ext]'
                    }
                }
            },
            {
                test: /\.(mp3)$/i,
                exclude: /node_modules/,
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: 'assets/audio',
                        publicPath: 'assets/audio',
                        name: '[path][name].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [miniCssExtractPlugin, htmlWebpackPlugin],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devServer: {
        historyApiFallback: true,
        host: '192.168.140.183'
    },
    externals: {
        //global app config object
        config: JSON.stringify({
            //apiUrl: 'http://api.registration.test:8001/api/v1'
            //apiUrl: 'http://192.168.140.183:8001/api/v1'
            apiUrl: 'https://acgdev.xyz/registration-api/api/v1'
        }),
        themeConfig: 'light'
    }
};