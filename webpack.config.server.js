const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')

// Running on production mode. Note that the prod. folder may be a result of this set configuration.
module.exports = {
    entry: [
        'webpack/hot/poll?1000',
        './src/server/index'
    ],
    watch: true,
    
    // Environment in which the bundle should run, changes chunk loading behavior and available modules.
    // 'node' is specified here in order to ignore built-in modules like path, fs, etc.
    target: 'node',
    // This is a way to exclude dependencies from output bundles. In other words, these are modules that should not be bundled.
    // When bundling with Webpack for backend, you usually don't want to bundle its node_modules, this is where NodeExternals comes in.
    // It essentially is a library that creates and externals function that ignores all modules in node_modules file when bundling.
    externals: [nodeExternals({
        // This is an array for the externals to be included in the bundle.
        whitelist: ['webpack/hot/poll?1000']
    })],
    module: {
        rules: [{
            test: /\.js?$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    plugins: [
        new StartServerPlugin('server.js'),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                "BUILD_TARGET": JSON.stringify('server')
            }
        }),
    ],
    output: {
        path: path.join(__dirname, 'prod/server'),
        filename: 'server.js'
    }
}