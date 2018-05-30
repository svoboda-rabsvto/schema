/* jshint esversion: 6 */

// External modules
var path = require('path'),
    fs = require("fs"),
    gulp = require('gulp'),
    jsonFormat = require('gulp-json-format'),
    jsonSchema = require("gulp-json-schema"),
    jsonData = require('gulp-data');
    jsonSchemaBundle = require('gulp-jsonschema-bundle');
    yaml = require('js-yaml');


// Path and mask config
var config = {
    src: {
        dir: 'src',
        mask: 'src/**/*.json'
    },
    template: {
        linguist: "src/template/language.linguist.json",
        spdx: "src/template/license.spdx.json"
    },
    collection: {
        dir: "src/collection/",
        licenses: {
            linter: "src/collection/license.linter.json",
            spdx: "src/collection/license.spdx.json"
        },
        languages: {
            linter: "src/collection/language.linter.json",
            linguist: "src/collection/language.linguist.json"
        }
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
    ext: {
        linguist: 'ext/github/linguist/lib/linguist/languages.yml',
        spdx: 'ext/spdx/license-list-data/json/licenses.json'
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
const test = (done) => {
    // TODO: Implement (probably separate tasks for src, dist & build)
    done();
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

// Import languages of linguist to file 
const importLanguages = () => gulp 
    .src(config.template.linguist)
    .pipe(jsonData((file) => {
        const list = yaml.safeLoad(fs.readFileSync(config.ext.linguist));
        const template = JSON.parse(fs.readFileSync(file.path));

        template.definitions.language.oneOf = Object.keys(list).map(name =>
        {
            let item = list[name];
            let language =
            {
                "enum": [name]
            };
            if (item.extensions && item.extensions.length) language.extensions = item.extensions;
            if (item.filenames && item.filenames.length) language.filenames = item.filenames;
            return language;
        });

        const formatted = JSON.stringify(template, null, 4);
        file.contents = Buffer.from(formatted, 'utf8');
        return file;
    }))
    .pipe(gulp.dest(config.collection.dir));

// Import licenses of spdx to file 
const importLicenses = () => gulp
    .src(config.template.spdx)
    .pipe(jsonData((file) => {
        const list = JSON.parse(fs.readFileSync(config.ext.spdx));
        const template = JSON.parse(fs.readFileSync(file.path));        
        template.enum = list.licenses.map(l => l.licenseId);
        
        const formatted = JSON.stringify(template, null, 4);
        file.contents = Buffer.from(formatted, 'utf8');
        return file;
    }))
    .pipe(gulp.dest( config.collection.dir));   

// Tasks
gulp.task('format', format);
gulp.task('validate', validate);
gulp.task('bundle', gulp.series('validate', bundle));
gulp.task('build', gulp.series('bundle', build));
gulp.task('static', static);
gulp.task('test', test);
gulp.task('release', gulp.series('static', 'build', /*'test',*/ release));
gulp.task('default', gulp.series('build'));
gulp.task('import-licenses', importLicenses);
gulp.task('import-languages', importLanguages);
