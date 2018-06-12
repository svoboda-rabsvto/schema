'use strict';

// Get shared core
const core = global.lhcore;

// External modules as aliases
const gulp = core.amd.gulp;
const del = core.amd.del;
const config = core.cfg;

// Cleanup build
const cleanBuild = () => del([
    config.build.dir,
]);

// Cleanup release
const cleanRelease = () => del([
    config.release.dir,
]);

gulp.task('clean-build', cleanBuild);
gulp.task('clean-release', cleanRelease);
gulp.task('clean', gulp.parallel('clean-build', 'clean-release'));
