const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, 'app') + '/app.js',
    output: {
        path: path.join(__dirname, 'public/dist'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, "public"),
        stats: {
            children: false,
            maxModules: 0
        },
        port: 3001,
        historyApiFallback: {
            index: '/'
        }
    },
    module: {
        rules: [
            {
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public/index.html"),
        })
    ]
};
