var path = require('path'),
    gulp = require('gulp'),
    subdirRename = require('gulp-subdir-rename'),
    jsonFormat = require('gulp-json-format');

gulp.task('format', function() {
    var stream = gulp
        .src('src/*.json')
        .pipe(jsonFormat(4))
        .pipe(gulp.dest('src'));
    return stream;
});

gulp.task('build', [ 'format' ], function() {
    var stream = gulp
        .src('src/*.json')
        .pipe(jsonFormat(4))
        .pipe(gulp.dest('build'));
    return stream;
});

gulp.task('static', function() {
    var stream = gulp
        .src('CNAME')
        .pipe(gulp.dest('dist'));
    return stream;
});

gulp.task('release', [ 'static', 'build' ], function() {
    var version
    var stream = gulp
        .src('build/*.json')
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest(function(file) {
            var content = JSON.parse(file.contents.toString());
            var version = content.$version;
            return path.join('dist', version);
        }));

    return stream;
});

gulp.task('default', [ 'build' ]);
