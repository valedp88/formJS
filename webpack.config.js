
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const package = require('./package.json');
const initialComment = '/**! '+ package.title +' v'+ package.version +' | '+ package.author.name +' (@SimplySayHi) | '+ package.homepage +' | https://github.com/SimplySayHi/'+ package.title +' | '+ package.license +' license */';

module.exports = [
    {
        entry: './src/index.js',
        output: {
            filename: 'formjs.js',
            path: path.resolve(__dirname, 'dist')
        },
        mode: 'none',
        //watch: true,
        optimization: {
            namedModules: true,
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: false,
                        mangle: false,
                        output: {
                            beautify: true,
                            preamble: initialComment
                        }
                    }
                })
            ]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',

                    options: {
                        presets: ['@babel/env']
                    }
                }
            ]
        }
    },
    {
        entry: './src/index.js',
        output: {
            filename: 'formjs.min.js',
            path: path.resolve(__dirname, 'dist')
        },
        mode: 'production',
        //watch: true,
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        output: {
                            preamble: initialComment
                        }
                    }
                })
            ]
        },
        // for test:    eval-source-map
        // for deploy:  hidden-source-map or source-map
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',

                    options: {
                        presets: ['@babel/env']
                    }
                }
            ]
        }
    }
];
