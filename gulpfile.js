var gulp = require('gulp'),
  gulpPlugins = require('gulp-load-plugins')(),
  bowerPackage = require('./bower.json'),
  jshintConfig = require('./jshint.config.json'),
  sources = {
    srcPath: 'src/**/*',
    less: 'src/**/*.less',
    js: 'src/**/*.js'
  },
  config = {
    url: 'http://localhost',
    port: 9000,
    browser: 'google chrome'
  };

/**
 * Init gulp help
 */
gulpPlugins.help(gulp);

gulp.task('less', 'Compile less to css', function () {
    return gulp.src(sources.less)
        .pipe(gulpPlugins.plumber())
        .pipe(gulpPlugins.less({compress: true}))
        .pipe(gulp.dest('src/'));
});

gulp.task('version', 'Print module version.', [], function() {
  process.stdout.write('\n' + bowerPackage.name + ' v' + bowerPackage.version + '\n\n');
}, {
  aliases: ['v']
});


gulp.task('serve', 'Start server', ['less'], function () {
  gulpPlugins.connect.server({
    root: [__dirname],
    port: config.port,
    livereload: true
  });

  gulp.src('index.html')
    .pipe(gulpPlugins.open('', {
      url: config.url + ':' + config.port + '/index.html',
      app: config.browser
    }));
});

gulp.task('jshint', 'Run jshint on the whole project', function () {
  gulp.src(sources.js)
      .pipe(gulpPlugins.jshint(jshintConfig))
      .pipe(gulpPlugins.jshint.reporter('jshint-stylish'));
});

gulp.task('watch', 'Run the application', ['less', 'jshint', 'serve'], function () {
  gulp.watch(sources.less, ['less']);
  gulp.watch(sources.js, ['jshint']);

  gulpPlugins.watch(sources.srcPath).pipe(gulpPlugins.connect.reload());
});