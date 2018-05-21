var path = require('path'),
    gulp = require('gulp'),
    jsonFormat = require('gulp-json-format'),
    jsonSchema = require("gulp-json-schema");;

gulp.task('format', function() {
    var stream = gulp
        .src('src/*.json')
        .pipe(jsonFormat(4))
        .pipe(gulp.dest('src'));
    return stream;
});

gulp.task('validate', function() {
    var stream = gulp
        .src('src/*.json')
        .pipe(jsonSchema({
            schema: 'src/schemaver.json',
            loadMissingSchemas: true,
            checkRecursive: true
        }));
    return stream;
});

gulp.task('test-deps', function() {
    return;
    var stream = gulp
        .src('test/*.deps.json')
        .pipe(jsonSchema({
            schema: 'src/deps.json',
            loadMissingSchemas: true,
            checkRecursive: true
        }));
    return stream;
});

gulp.task('test-meta', function() {
    return;
    var stream = gulp
        .src('test/*.meta.json')
        .pipe(jsonSchema({
            schema: 'src/meta.json',
            loadMissingSchemas: true,
            checkRecursive: true,
            verbose: true
        }));
    return stream;
});

gulp.task('build', [ 'format', 'validate', 'test-meta', 'test-deps' ], function() {
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
