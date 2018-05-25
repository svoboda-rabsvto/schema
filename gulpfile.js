// External modules
var path = require('path'),
    fs = require("fs"),
    gulp = require('gulp'),
    jsonFormat = require('gulp-json-format'),
    jsonSchema = require("gulp-json-schema"),
    jsonSchemaBundle = require('gulp-jsonschema-bundle');

// Path and mask config
var config = {
    src: {
        dir: 'src',
        mask: 'src/**/*.json'
    },
    schema: {
        mask: 'src/schema/*.json',
        ver: 'src/schema/schemaver.json',
        collection: 'src/schema/collection.json'
    },
    build: {
        dir: 'build',
        mask: 'build/*.json'
    },
    dist: {
        dir: 'dist'
    },
    assets: {
        cname: 'CNAME'
    }
};

// Reformat and save all source schemas
gulp.task('format', function() {
    var stream = gulp
        .src(config.src.mask)
        .pipe(jsonFormat(4))
        .pipe(gulp.dest(config.src.dir));
    return stream;
});

// Validate all core schemas according to schemaver
gulp.task('validate', [ 'format' ], function() {
    var stream = gulp
        .src(config.schema.mask)
        .pipe(jsonSchema({
            schema: config.schema.ver,
            loadMissingSchemas: true,
            checkRecursive: true
        }));
    return stream;
});

// Resolve all $ref in collections and create a bundle
gulp.task('bundle', [ 'validate' ], function() {
    var stream = gulp.src(config.schema.collection)
        .pipe(jsonSchemaBundle())
        .pipe(jsonFormat(4))
        .pipe(gulp.dest(config.build.dir));
    return stream;
});

// Build all schema sources
gulp.task('build', [ 'bundle' ], function() {
    var stream = gulp
        .src([
            config.schema.mask,
            '!' + config.schema.collection
        ])
        .pipe(gulp.dest(config.build.dir));
    return stream;
});

// Copy all static assets to release
gulp.task('static', function() {
    var stream = gulp
        .src(config.assets.cname)
        .pipe(gulp.dest(config.dist.dir));
    return stream;
});

// Run tests over files in test folder
gulp.task('test', function() {
    // TODO: Implement (probably separate tasks for src, dist & build)
});

// Build and release (copy to dist) current version
gulp.task('release', [ 'static', 'build', 'test' ], function() {
    var stream = gulp
        .src(config.build.mask)
        .pipe(gulp.dest(config.dist.dir))
        .pipe(gulp.dest(function(file) {
            var content = JSON.parse(file.contents.toString());
            var version = content.$version;
            return path.join(config.dist.dir, version);
        }));

    return stream;
});

gulp.task('default', [ 'build' ]);
