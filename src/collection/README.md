# Collection

This folder contains external data sets imported in JSON Schema format:

| Name       | Description  |
|------------|--------------|
| `language` | Programming languages and associated extensions, sources: [linguist](https://github.com/github/linguist), Manual |
| `license`  | Software licenses names and acronyms, sources: [SPDX](https://spdx.org/licenses/), Manual |
| `manager`  | System and language package managers, sources: [Wikipedia](https://en.wikipedia.org/wiki/List_of_software_package_management_systems), Manual |

The posfix in the file name (e.g. [license.*spdx*.json](license.spdx.json)) indicates the original source of the data set (in this example SPDX catalog) while files without postfix (e.g. [license.json](license.json)) defines a final collection as a composition of several sets.

Those collections are mostly arrays of strings and only allowed values are used in the [core schemas](../schema); during build process those files are bundled and injected) into core schema `collection`.