var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports = {
	//插件项
	plugins: [commonsPlugin],
	//页面入口文件配置
	entry: {
		index: './test.js'
	},
	//入口文件输出配置
	output: {
		path: 'dist/js/page',
		filename: 'aaa.js'
	},
	module: {
		//加载器配置
		loaders: [{
			test: /\.css$/,
			loader: 'style-loader!css-loader'
		},
		{
			test: /\.scss$/,
			loader: 'style!css!sass?sourceMap'
		}]
	}
};