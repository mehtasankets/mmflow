var webpack = require('webpack')
var path = require('path')

var parentDir = path.join(__dirname, '../')

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
                use: ["style-loader", "css-loader"]
            },{
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },{
                test: /\.s[ac]ss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    output: {
        path: parentDir + '/dist',
        filename: 'bundle.js'
    },
}
