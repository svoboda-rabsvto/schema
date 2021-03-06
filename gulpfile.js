// Set global shared core
const lhcore = require('./script/gulp/index.js');
global.lhcore = lhcore;

// External modules as aliases
const gulp = lhcore.amd.gulp;
const hubRegistry = lhcore.amd.hubRegistry;

// Load tasks into the registry of gulp
hubRegistry([
    'script/gulp/**/task.*.js',
]);

gulp.task('default', gulp.series(
    'import',
    'validate',
    'lint',
    'test',
    'build',
    'release'
));
gulp.task('before-commit', gulp.series('pull-submodules'));
gulp.task('release', gulp.series('release', 'test-release'));
gulp.task('validate', gulp.series('import', 'validate'));
gulp.task('build', gulp.series('validate', 'lint', 'build', 'test-build'));
