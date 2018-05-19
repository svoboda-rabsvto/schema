var gulp = require('gulp');

gulp.task('build', function() {
    var stream = gulp
        .src('src/*.json')
        .pipe(gulp.dest('build'));
    return stream;
})

gulp.task('default', ['build']);
