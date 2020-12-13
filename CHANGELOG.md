## v0.1.6

### Support

* `@handler` annotation syntax highlighting.
* support for route jump without returns to definition.

### Fixed

* fix some syntax highlighting errors, example `get /greet/to/:name`.

## v0.1.5

### Optimize

* Add go-zero logo.
* Optimize the formatting logic, when formatting the file, there is no need to save the file to disk.

### Fixed

* Fix the bug that the file cannot be saved when the user sets `editor.formatOnSave` is `true`.

**Note:** To upgrade this version, please make sure that the goctl command line tool is also upgraded to the latest version. To upgrade the goctl command line tool, you can rerun the [goctl command line tool installation](https://github.com/tal-tech/go-zero#5-quick-start) command.

## v0.1.4

### Snippet improvements

* Add `@handler` snippet.
* Add go style snippet (`tys` and `im`).

## v0.1.3

### Fixed

* Fixed cannot be jump to code definition in some cases.