var webpack = require('webpack');
var path = require('path');

var parentDir = path.join(__dirname, '../');

module.exports = {
    entry: [
        'babel-polyfill',
        path.join(parentDir, 'index.js')
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },{
                test: /\.css$/,
                loaders: ["style-loader", "css-loader"]
            },{
                test: /\.less$/,
                loaders: ["style-loader", "css-loader", "less-loader"]
            },{
                test: /\.s[ac]ss$/,
                loader: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    output: {
        path: parentDir + '/dist',
        filename: 'bundle.js'
    },
    devServer: {
        disableHostCheck: true,
        contentBase: parentDir,
        publicPath: '/mmflow/',
        historyApiFallback: true,
        host: '0.0.0.0',
        port: 8080
    }
}