var gulp = require('gulp');

gulp.task('static', function() {
    var stream = gulp
        .src('CNAME')
        .pipe(gulp.dest('build'));
    return stream;
})

gulp.task('build', function() {
    var stream = gulp
        .src('src/*.json')
        .pipe(gulp.dest('build'));
    return stream;
})

gulp.task('default', ['static', 'build']);
