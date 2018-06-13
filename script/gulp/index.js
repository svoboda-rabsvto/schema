// Shared conffguration
const cfg = require('./config.json');

// Shared node modules
const amd = {
    fs: require('fs'),
    del: require('del'),
    path: require('path'),
    log: require('fancy-log'),
    git: require('gulp-git'),
    yaml: require('js-yaml'),
    eslint: require('gulp-eslint'),
    gulp: require('gulp'),
    glob: require('glob'),
    hubRegistry: require('gulp-hub'),
    jsonData: require('gulp-data'),
    jsonFormat: require('gulp-json-format'),
    jsonSchema: require('gulp-json-schema'),
    jsonSchemaBundle: require('gulp-jsonschema-bundle'),
    jsonSchemaRemote: require('json-schema-remote'),
};

// Disable logging
amd.jsonSchemaRemote.setLoggingFunction(amd.log.info);

// Shared functions
const fnc = {
    readJson: (path) => JSON.parse(amd.fs.readFileSync(path)),
    readYaml: (path) => amd.yaml.safeLoad(amd.fs.readFileSync(path)),
    jsonToBuffer: (json) => Buffer.from(JSON.stringify(json), 'utf8'),
};

// Exported shared config, modules and functons
exports = module.exports = {
    cfg: cfg,
    amd: amd,
    fnc: fnc,
};
