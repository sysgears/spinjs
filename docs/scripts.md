# SpinJS Scripts

SpinJS provides four commands and a few [options](#running-spinjs-commands-with-options) you can run the commands with.

## `spin watch`

Runs the project in development mode with live code reload for all the platforms:

```bash
spin watch
```

## `spin build`

Builds your project for production: the build code is minified. 

Note that the project won't run, SpinJS will only generate and minify the build, and also save the generated files under 
the `build` directory. The `build` directory is automatically created under the **current working directory**. To change 
the directory where SpinJS will store the built production code, consult the [configuration] guide.

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

## Running SpinJS commands with options

You can run SpinJS commands using the following options:

* `-n`, shows the list of builders
* `-d`, disables builders
* `-e`, enables builders
* `-v`, shows generated configurations in the console

You can specify the option after the SpinJS command:
 
```bash
spin <command> <option>
```

For example, you can tell SpinJS to log out them by running the commands with the `-v` option:

```bash
spin watch -v
```

If your project has several SpinJS builders, and you want to only run specific builders without changing SpinJS 
configurations, you can run a command this way:

```bash
spin watch -d ios -e web
```

The command above disables the iOS build and enables the web build (the client-side application).

[configuration]: https://github.com/sysgears/spinjs/blob/master/docs/configuration.md#buildDir
