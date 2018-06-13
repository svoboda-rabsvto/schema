'use strict';

// Get shared core
const core = global.lhcore;

// External modules as aliases
const gulp = core.amd.gulp;
const log = core.amd.log;
const jsonData = core.amd.jsonData;
const config = core.cfg;
const jsonSchemaRemote = core.amd.jsonSchemaRemote;

// External functions as aliases
const readJson = core.fnc.readJson;

// If result of test is true
const testTrue = (test, schema, done) => {
    if (test.valid) {
        log.info(`OK: ${schema.description} ${test.description}`);
    } else {
        log.error(`FAIL: ${schema.description} ${test.description}`);
        log.error(`FILE: ${test.data.$ref}`);
        log.error(`MESSAGE: Validation failed`);
        done();
    }
};

// If result of test is false
const testFalse = (test, schema, done, error) => {
    if (!test.valid) {
        log.info(`OK: ${schema.description} ${test.description}`);
    } else {
        log.error(`FAIL: ${schema.description} ${test.description}`);
        log.error(`FILE: ${test.data.$ref}`);
        if (error.errors) {
            log.error(`MESSAGE: ${error.errors[0].message}`);
            log.error(`SCHEMA PATH: ${error.errors[0].schemaPath}`);
        }
        done(error);
    }
};

// Run separately test
const runTest = (test, schema, done) => {
    const data = readJson(test.data.$ref);
    return jsonSchemaRemote.validate(data, schema.$schema.$ref)
        .then(() => testTrue(test, schema, done))
        .catch((error) => testFalse(test, schema, done, error));
};

// Run all json tests
const test = (done) => gulp
    .src(config.test.mask)
    .pipe(jsonData((file) => {
        const schema = readJson(file.path);
        const tasks = schema.tests.map((test) => runTest(test, schema, done));
        return Promise.all(tasks);
    }));

// Preload schemas in build folder
const buildPreload = () => gulp
    .src(config.build.mask)
    .pipe(jsonData((file) => {
        jsonSchemaRemote.preload(readJson(file.path));
        log.info(`SCHEMA PRELOAD: ${file.path}`);
    }));

// Preload schemas in dist folder
const releasePreload = () => gulp
    .src(config.release.mask)
    .pipe(jsonData((file) => {
        jsonSchemaRemote.preload(readJson(file.path));
        log.info(`SCHEMA PRELOAD: ${file.path}`);
    }));

// Tasks
gulp.task('test-preload-build', buildPreload);
gulp.task('test-preload-release', releasePreload);
gulp.task('test-web', test);
gulp.task('test-build', gulp.series('test-preload-build', test));
gulp.task('test-release', gulp.series('test-preload-release', test));
gulp.task('test', gulp.parallel('test-web', 'test-build'));
