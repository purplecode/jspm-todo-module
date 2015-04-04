var gulp = require('gulp'),
  gulpPlugins = require('gulp-load-plugins')(),
  log = gulpPlugins.util.log,
  colors = gulpPlugins.util.colors,
  bowerPackage = require('./bower.json'),
  jshintConfig = require('./jshint.config.json'),
  sources = {
    srcPath: 'src/**/*',
    less: 'src/**/*.less',
    js: 'src/**/*.js',
    karmaConfig: 'test/karma.conf.js',
    protractorConfig: 'test/protractor.conf.js',
    e2eSrcFiles: 'test/e2e/src/**/*.js',
    e2eDistFiles: 'test/e2e/dist/**/*.js',
    e2eDistPath: 'test/e2e/dist/'
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

gulp.task('version', 'Print module version.', [], function () {
  process.stdout.write('\n' + bowerPackage.name + ' v' + bowerPackage.version + '\n\n');
}, {
  aliases: ['v']
});

gulp.task('runServer', 'Run server', function () {
  gulpPlugins.connect.server({
    root: './',
    port: config.port
  });
});

gulp.task('runServer:livereload', 'Start server', ['less'], function () {
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

gulp.task('createBundle', 'Create JSPM bundles', ['createBundle:sfx', 'createBundle:systemjs'], function () {
});

gulp.task('createBundle:sfx', 'Create JSPM bundle-sfx',
  gulpPlugins.shell.task([
    'jspm bundle-sfx src/Todo dist/todo.js',
    'jspm bundle-sfx src/Todo dist/todo.min.js --minify'
  ])
);

gulp.task('createBundle:systemjs', 'Create JSPM bundle',
  gulpPlugins.shell.task([
    'jspm bundle src/Todo dist/todo-systemjs.js',
    'jspm bundle src/Todo dist/todo-systemjs.min.js --minify'
  ])
);

gulp.task('test', 'Run unit tests', function () {
  return gulp.src('./')
    .pipe(gulpPlugins.karma({
      configFile: sources.karmaConfig,
      action: 'run'
    }))
    .on('error', function (e) {
      log(colors.red('Unit tests failed'));
      process.exit(1);
    });
});

gulp.task('test:watch', 'Run unit tests with watch', function () {
  return gulp.src('./')
    .pipe(gulpPlugins.karma({
      configFile: sources.karmaConfig,
      action: 'watch'
    }));
});

gulp.task('test:e2e:removeTranspiled', 'Remove transpiled e2e tests directory', function () {
  return gulp.src(sources.e2eDistPath, {read: false})
    .pipe(gulpPlugins.clean());
});

gulp.task('test:e2e:transpile', 'Transpile e2e tests from ES6 into ES5', function () {
  return gulp.src(sources.e2eSrcFiles)
    .pipe(gulpPlugins.plumber())
    .pipe(gulpPlugins.babel())
    .pipe(gulp.dest(sources.e2eDistPath));
});

gulp.task('test:e2e', 'Run e2e tests', ['transpileE2e', 'runServer'], function () {
  gulp.src(sources.e2eDistFiles)
    .pipe(gulpPlugins.angularProtractor({
      configFile: sources.protractorConfig,
      args: ['--baseUrl', config.url + ':' + config.port],
      autoStartStopServer: true,
      debug: true
    }))
    .on('error', function (e) {
      log(colors.red('E2e tests failed'));
      process.exit(1);
    })
    .on('end', function () {
      process.exit();
    });
});

