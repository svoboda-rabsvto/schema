# Schema

This folder contains core JSON Schemas:

| Name                            | Description                                          |
|---------------------------------|------------------------------------------------------|
| [`package`](package.json)       | Meta-information of software package                 |
| [`deps`](deps.json)             | Extension: definition of package dependencies        |
| [`linter`](linter.json)         | Extension: linter package                            |

and several internal JSON Schemas:

| Name                            | Description                                          |
|---------------------------------|------------------------------------------------------|
| [`schemaver`](semver.json)      | The core schema that implements versioning mechanism |
| [`collection`](collection.json) | References to schemas with common data sets          |

Each schema is described in [docs](../../docs/).
