var path = require('path'),
    fs = require("fs"),
    gulp = require('gulp'),
    jsonFormat = require('gulp-json-format'),
    jsonSchema = require("gulp-json-schema"),
    jsonSchemaBundle = require('gulp-jsonschema-bundle');

gulp.task('format', function() {
    var stream = gulp
        .src('src/**/*.json')
        .pipe(jsonFormat(4))
        .pipe(gulp.dest('src'));
    return stream;
});

gulp.task('validate', [ 'format' ], function() {
    var stream = gulp
        .src('src/schema/*.json')
        .pipe(jsonSchema({
            schema: 'src/schema/schemaver.json',
            loadMissingSchemas: true,
            checkRecursive: true
        }));
    return stream;
});

gulp.task('bundle', [ 'validate' ], function() {
    var stream = gulp.src('src/schema/collection.json')
        .pipe(jsonSchemaBundle())
        .pipe(jsonFormat(4))
        .pipe(gulp.dest('build'));
    return stream;
});

gulp.task('build', [ 'bundle' ], function() {
    var stream = gulp
        .src([
            'src/schema/*.json',
            '!src/schema/collection.json'
        ])
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
