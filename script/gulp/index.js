const cfg = require('./config.json');

const amd = {
    fs: require('fs'),
    del: require('del'),
    path: require('path'),
    log: require('fancy-log'),
    yaml: require('js-yaml'),
    eslint: require('gulp-eslint'),
    gulp: require('gulp'),
    hubRegistry: require('gulp-hub'),
    jsonData: require('gulp-data'),
    jsonFormat: require('gulp-json-format'),
    jsonSchema: require('gulp-json-schema'),
    jsonSchemaBundle: require('gulp-jsonschema-bundle'),
    jsonSchemaRemote: require('json-schema-remote'),
};

amd.jsonSchemaRemote.setLoggingFunction(() => { });

const fnc = {
    readJson: (path) => JSON.parse(amd.fs.readFileSync(path)),
    readYaml: (path) => amd.yaml.safeLoad(amd.fs.readFileSync(path)),
    jsonToBuffer: (json) => Buffer.from(JSON.stringify(json), 'utf8'),
};

exports = module.exports = {
    cfg: cfg,
    amd: amd,
    fnc: fnc,
};
