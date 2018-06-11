/* jshint esversion: 6 */

// External modules
var path = require('path'),
    fs = require("fs"),
    gulp = require('gulp'),
    jsonFormat = require('gulp-json-format'),
    jsonSchema = require("gulp-json-schema"),
    jsonData = require('gulp-data'),
    jsonSchemaBundle = require('gulp-jsonschema-bundle'),
    yaml = require('js-yaml'),
    validator = require('json-schema-remote'),
    finder = require('fs-finder')
    log = require('fancy-log')
    readSchema = (path) => JSON.parse(fs.readFileSync(path));

// Initialization
validator.setLoggingFunction(() => { });

// Path and mask config
var config = require('./script/gulp/config.json')

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
const test = (done) => gulp
    .src(config.test.mask)
    .pipe(jsonData(file => {
        const schema = readSchema(file.path);
        const tasks = schema.tests.map(test => {
            const data = readSchema(test.data.$ref);
            return validator.validate(data, schema.$schema.$ref)
                .then(() => {
                    if (test.valid) {
                        log.info(`OK: ${schema.description} ${test.description}`);
                    } else {
                        log.error(`FAIL: ${schema.description} ${test.description}`);
                        log.error(`FILE: ${test.data.$ref}`);
                        log.error(`MESSAGE: file is valid, but "valid" propertie is "false" in settings`);
                        process.exitCode = 1;
                        done("JSON Schema Validation error");
                    }
                })
                .catch((error) => {
                    if (!test.valid) {
                        log.info(`OK: ${schema.description} ${test.description}`);
                    } else {
                        log.error(`FAIL: ${schema.description} ${test.description}`);
                        log.error(`FILE: ${test.data.$ref}`);
                        log.error(`MESSAGE: ${error.errors[0].message}`);
                        log.error(`SCHEMA PATH: ${error.errors[0].schemaPath}`);
                        process.exitCode = 1;
                        done(error);
                    }
                });
        });
        return Promise.all(tasks);
    }));

// Build and release (copy to dist) current version
const release = () => gulp
    .src(config.build.mask)
    .pipe(gulp.dest(config.dist.dir))
    .pipe(gulp.dest(file => {
        var content = JSON.parse(file.contents.toString());
        var version = content.$version;
        return path.join(config.dist.dir, version);
    }));

// Import languages of linguist to file 
const importLanguages = () => gulp
    .src(config.template.linguist)
    .pipe(jsonData((file) => {
        const list = yaml.safeLoad(fs.readFileSync(config.ext.linguist));
        const template = readSchema(file.path);

        template.definitions.language.oneOf = Object.keys(list).map(name => {
            let item = list[name];
            let language =
                {
                    "enum": [name]
                };
            if (item.extensions && item.extensions.length) language.extensions = item.extensions;
            if (item.filenames && item.filenames.length) language.filenames = item.filenames;
            return language;
        });

        file.contents = Buffer.from(JSON.stringify(template), 'utf8');
        return file;
    }))
    .pipe(jsonFormat(4))
    .pipe(gulp.dest(config.collection.dir));

// Import licenses of spdx to file 
const importLicenses = () => gulp
    .src(config.template.spdx)
    .pipe(jsonData((file) => {
        const list = readSchema(config.ext.spdx);
        const template = readSchema(file.path);
        template.enum = list.licenses.map(l => l.licenseId);

        file.contents = Buffer.from(JSON.stringify(template), 'utf8');
        return file;
    }))
    .pipe(jsonFormat(4))
    .pipe(gulp.dest(config.collection.dir));

// Tasks
gulp.task('format', format);
gulp.task('validate', validate);
gulp.task('bundle', gulp.series('validate', bundle));
gulp.task('build', gulp.series('bundle', build));
gulp.task('static', static);
gulp.task('test', test);
gulp.task('release', gulp.series('static', 'build', 'test', release));
gulp.task('import-licenses', importLicenses);
gulp.task('import-languages', importLanguages);
gulp.task('import', gulp.parallel('import-languages', 'import-licenses'));

gulp.task('default', gulp.series('build'));
