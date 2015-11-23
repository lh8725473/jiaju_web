(function() {
	'use strict';
	var gulp = require('gulp');
	var path = require('path');
	var sass = require('gulp-sass');
	var csso = require('gulp-csso');
	var concat = require('gulp-concat');
	var replace = require('gulp-replace-task');
	var jsMin = require('gulp-jsmin');
	var sourceMaps = require('gulp-sourcemaps');
	var cssBuildPath = './compile/css'; //编译完成css的目录
	var jsBuildPath = './dev_src/js'; //实际调用JS的目录
	var cssBuildPath = './dev_src/css'; //实际调用css的目录
	var libPath = './bower_components';

	gulp.task('default', function() {
		console.info("命令说明:");
		var info = {
			jade: '编译处理jade模板为html',
			sc: '编译coffee文件为js，并把JS文件复制到实际调用地址中',
			cf: '仅编译coffee文件为JS',
			less: '发布less为style.css',
			sass: '编译scss为css文件',
			vendor: '发布bower安装的JS库到正式调用的位置',
			publish: '发布。执行所有的命令'
		};
		console.dir(info);
	});

	gulp.task('sass', function() {
		gulp.src('./src/**/*.scss')
			.pipe(sass().on('error', sass.logError))
			.pipe(concat('main.css'))
			.pipe(gulp.dest(cssBuildPath));
	});

	gulp.task('concatjs', function() {
		gulp.src('./src/**/*.js')
			.pipe(concat('main.js'))
			.pipe(gulp.dest(jsBuildPath));
	});

	gulp.task('watch', function() {
		gulp.watch('./src/**/*.scss', ['sass']);
		gulp.watch('./src/**/*.js', ['concatjs']);
	});

	gulp.task('replace', function () {
	  gulp.src('src/h5.html')
	    .pipe(replace({
	      patterns: [
	        {
	          match: 'dev',
	          replacement: 'dev_src'
	        }
	      ]
	    }))
	    .pipe(gulp.dest('dev_src'));
	});

	gulp.task('dev', ['sass', 'concatjs', 'replace', 'watch']);

	gulp.task('jade', function() {

	});
	gulp.task('cf', function() {
		gulp.src("assets/coffee/**/*.coffee")
			.pipe(coffee())
			.pipe(jsMin())
			.pipe(gulp.dest(jsBuildPath));
	});
	gulp.task('sc', ['cf'], function() {
		gulp.src("assets/js/**/*.js")
			.pipe(concat('main.js'))
			.pipe(jsMin())
			.pipe(gulp.dest(jsBuildPath));

	});
	gulp.task('less', function() {
		var lessSrcPath = './assets/less/';
		return gulp.src(path.join(lessSrcPath, 'style.less'))
			.pipe(sourceMaps.init())
			.pipe(less({
				paths: [
					path.join(__dirname, './assets/less'),
					path.join(__dirname, './assets/less/page'),
					path.join(__dirname, './assets/less/global')
				]
			}))
			.pipe(csso())
			.pipe(sourceMaps.write('./maps'))
			.pipe(gulp.dest(cssBuildPath));
	});
	/**
	 * 发布bower里的库到public目录
	 */
	gulp.task('vendor', function() {
		var vendor = {
			js: [
				path.join(libPath, 'jquery/dist/jquery.min.js'),
				path.join(libPath, 'requirejs/require.js'),
				path.join(libPath, 'Swiper/dist/js/swiper.jquery.min.js')
			],
			css: [
				path.join(libPath, 'Swiper/dist/css/swiper.min.css')
			]
		};
		gulp.src(vendor.js)
			.pipe(gulp.dest(path.join(jsBuildPath, 'libs/')));
		gulp.src(vendor.css)
			.pipe(gulp.dest(cssBuildPath));
	});

	gulp.task('publish', ['vendor', 'less', 'sc']);
})();