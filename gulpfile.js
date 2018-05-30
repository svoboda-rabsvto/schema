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
const format = () => gulp
    .src(config.src.mask)
    .pipe(jsonFormat(4))
    .pipe(gulp.dest(config.src.dir));

// Validate all core schemas according to schemaver
const validate = () => gulp
    .src(config.schema.mask)
    .pipe(jsonSchema({
        schema: config.schema.ver,
        loadMissingSchemas: true,
        checkRecursive: true,
        verbose: true,
    }));

// Resolve all $ref in collections and create a bundle
const bundle = () => gulp
    .src(config.schema.collection)
    .pipe(jsonSchemaBundle())
    .pipe(jsonFormat(4))
    .pipe(gulp.dest(config.build.dir))

// Build all schema sources
const build = () => gulp
    .src([
        config.schema.mask,
        '!' + config.schema.collection
    ])
    .pipe(gulp.dest(config.build.dir));

// Copy all static assets to release
const static = () => gulp
    .src(config.assets.cname)
    .pipe(gulp.dest(config.dist.dir));

// Run tests over files in test folder
const test = () => {
    // TODO: Implement (probably separate tasks for src, dist & build)
    return;
};

// Build and release (copy to dist) current version
const release = () => gulp
    .src(config.build.mask)
    .pipe(gulp.dest(config.dist.dir))
    .pipe(gulp.dest(file => {
        var content = JSON.parse(file.contents.toString());
        var version = content.$version;
        return path.join(config.dist.dir, version);
    }));

// Tasks
gulp.task('format', format);
gulp.task('validate', validate);
gulp.task('bundle', gulp.series('validate', bundle));
gulp.task('build', gulp.series('bundle', build));
gulp.task('static', static);
gulp.task('test', test);
gulp.task('release', gulp.series('static', 'build', /*'test',*/ release));

gulp.task('default', gulp.series('build'));
