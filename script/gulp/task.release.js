'use strict';

// Get shared core
const core = global.lhcore;

// External modules as aliases
const gulp = core.amd.gulp;
const path = core.amd.path;
const config = core.cfg;

// Externall functions as aliases
const readJson = core.fnc.readJson;

// Copy all static assets to release
const copyStatic = () => gulp
    .src(config.assets.cname)
    .pipe(gulp.dest(config.release.dir));

// Copy to release all schemas and update root
const createRelease = () => gulp
    .src(config.build.mask)
    .pipe(gulp.dest(config.release.dir))
    .pipe(gulp.dest((file) => {
        let content = readJson(file.path);
        let version = content.$version;
        return path.join(config.release.dir, version);
    }));

// Tasks
gulp.task('static', copyStatic);
gulp.task('create-release', createRelease);
gulp.task('release', gulp.parallel('static', 'create-release'));
