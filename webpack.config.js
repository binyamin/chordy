module.exports = {
    mode: 'development',
    entry: './js/main.js',
    output: {
        path: __dirname,
        filename: './js/[name].bundle.js'
    },
    devtool: 'inline-source-map',
    node: {
        fs: 'empty'
    }
}