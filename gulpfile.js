var browserify = require("browserify"),
    buffer     = require('vinyl-buffer'),
    source     = require('vinyl-source-stream'),
    watchify   = require('watchify'),
    gulp       = require("gulp");

var WATCH = false;

gulp.task('js', function() {
  var bundler = browserify({
    cache: {}, // watchify arguments
    packageCache: {}, // watchify arguments
    fullPaths: true, // watchify arguments
    entries: ['./testBrowserify.js'],
    debug: true
  });

  var bundle = function() {
    return bundler
      .bundle()
      .on("error", function(err) {
        console.log(err.message);
        this.emit("end");
      })
      .pipe(source("app-bundle.js"))
      .pipe(gulp.dest('./.tmp'));
  };

  if (WATCH) {
    bundler = watchify(bundler);
    bundler.on('update', bundle);
    bundler.on("time", function(time) {
      console.log("Javascript Bundle updated: " + time + "ms");
    });
    bundler.on("error", function(err) {
      console.log(err.message);
      this.emit("end");
    });
  }

  return bundle();
});
