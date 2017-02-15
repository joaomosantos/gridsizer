var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync'), ssi = require('browsersync-ssi');
var $ = require('gulp-load-plugins')({
  rename: {
    'gulp-minify-css': 'minifyCSS'
  }
});

var configs = {
  sync: {
    ext: [
    './src/*.{html,htm,shtm,shtml}',
    './src/**/*.css'
    ]
  },
  html: {
    main: './src/*.{html,htm,shtm,shtml}',
    dest: './src/'
  },
  sass: {
    source: './src/sass/*.scss',
    main: './src/sass/gridsizer.scss',
    dest: './src/'
  },
  build: {
    source: './src/gridsizer.css',
    dest: "./src"
  },
};

gulp.task('server', ['bower'], function() {
  browserSync({
    server: {
      baseDir: 'src',
      index: 'index.html',
      routes: {
        '/bower_components': 'bower_components'
      },
      middleware: ssi({
        baseDir: 'src',
        ext: '.shtm'
      })
    }
  });
  gulp.watch(configs.sass.source, ['sass'], browserSync.reload);
  gulp.watch(configs.sync.ext, browserSync.reload);
  gulp.watch('bower.json', ['bower'], browserSync.reload);
});

gulp.task('bower', function() {
  gulp.src(configs.html.main, {base: './src'})
  .pipe(wiredep({
    directory: 'bower_components'
  }))
  .pipe(gulp.dest(configs.html.dest));
});

gulp.task('sass', function() {
  gulp.src(configs.sass.main)
  .pipe($.sass({
    includePaths: ['./src/sass']
  }).on('error', $.sass.logError))
  .pipe($.autoprefixer({
    browsers: ['last 3 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(configs.sass.dest))
  .pipe(browserSync.stream());
});

gulp.task('minify', function() {
  gulp.src(configs.build.source)
  .pipe($.rename(function (path) {
    path.basename += ".min";
  }))
  .pipe($.minifyCSS())
  .pipe(gulp.dest(configs.build.dest));
});
