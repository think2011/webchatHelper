var path              = require('path');
var webpack           = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const paths     = {
    src: './src'
}
const copyFiles = [
    'icon.png',
    'manifest.json',
    'popup.html',
    'popup.js'
].map((item) => ({from: `${paths.src}/${item}`}))

module.exports = {
    devtool: 'eval-source-map',
    entry  : [
        './src/app'
    ],
    output : {
        path    : path.join(__dirname, 'dist'),
        filename: 'app.js'
    },
    module : {
        loaders: [
            {
                test   : /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test  : /\.html$/,
                loader: "html"
            },
            {
                test   : /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader : 'babel',
                query  : {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin(copyFiles)
    ]
};
