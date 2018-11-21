# SpinJS Scripts

SpinJS provides four commands, which you can run with options.

## `spin watch`

Runs the project in development mode with live code reload for all the platforms:

```bash
spin watch
```

## `spin build`

Builds your project for production (the webpack's `mode` property is set to `'production'`; the build code is minified).
The project won't run, SpinJS will just generate and minify the build, and save the generated files under the `build`
directory. The `build` directory is automatically generated under the current working directory. To change the `build`
directory, consult the [configuration] guide.

```bash
spin build
```

## `spin start`

Builds your project for production and runs the project in the browser. The code is minified.

```bash
spin start
```

## `spin test`

Runs all the tests using `mocha-webpack`.

```bash
spin test
```

## Running SpinJS Commands with the `-v` Option

SpinJS generates a webpack configuration file, which you can view by running SpinJS commands with the `-v` option:

```bash
spin <command> -v
```

For example, you can view the development configuration file by running this command:

```bash
spin watch -v
```

[configuration]: https://github.com/sysgears/spinjs/blob/master/docs/configuration.md
