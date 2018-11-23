# How SpinJS Works

In this section, we give an overview of how SpinJS works.

## SpinJS Thought Process

In short, here is how SpinJS thinks:

1. It analyzes the project dependencies.
2. It builds the configuration for found dependencies.
3. It merges the dependency configuration into the global project configuration.

### #1 Analyzing the Dependencies

When you run your project with `spin watch`, SpinJS reads the contents of the project's `package.json` file and
recursively analyzes the project dependencies (the project dependencies and the dependencies of dependencies).

SpinJS builds an internal model of the project; with this model, SpinJS can understand what technologies are used in the 
project.

### #2 Building the Configuration

Once the list of dependencies is created, SpinJS selects the known dependencies and generates a webpack configuration 
for them. For example, if you install Express, SpinJS will understand that you need a configuration for an Express 
server application. Similarly, if you've installed the `react-native` library, SpinJS will configure a React Native 
mobile app project.

To generate the webpack configurations for all known technologies, SpinJS uses [plugins]. Each plugin knows only about
its own technology that SpinJS found in the project. SpinJS plugins also understand for what environment &ndash;
development, production, or test &ndash; the configuration must be generated.

Internally, each plugin analyzes the entire list of technologies to find out if it needs to generate a webpack
configuration for them.

For example, SpinJS has a plugin for React and webpack, which works like this:

```js
export default class ReactPlugin implements ConfigPlugin {
  public configure(builder: Builder, spin: Spin) {
    const stack = builder.stack;

    if (stack.hasAll(['react', 'webpack']) && !stack.hasAny('dll')) {
      // plugin code
    }
  }
}
```

> The second check `!stack.hasAny('dll')` is necessary to prevent generating webpack configuration for React again. The
generated webpack DLL files will be used to create a build. Read more about [webpack DLL](#webpack-dll).

If you use the SpinJS configuration below, `ReactPlugin` will understand that it needs to generate configs for the React
application:

```js
const config = {
  builders: {
    web: {
      stack: ['web', 'react', 'webpack', 'css', 'es6']
    }
  }
};

module.exports = config;
```

### #3 Merging the configurations

The generated configuration for each technology is merged into the main configuration using webpack-merge to ensure that
the global webpack configuration is created without conflicts.

## Webpack DLL

SpinJS leverages the power of using webpack DLLs with a simple idea in mind: to reduce the time of creating incremental
builds. You can consider webpack DLL files as _the cache_ for your builds in development mode.

Webpack DLL files comprise a bundle that's get generated from the runtime dependencies of the project. Using sane words,
SpinJS generates the project bundle only once and stores it in webpack DLL files. Then, when you change the project code 
and an incremental build is created, webpack does _not_ re-compile all the dependencies again, and instead uses the 
DLL files. In the end, this approach helps to drastically increase the speed of creating incremental builds.

## Current Working Directory

SpinJS recursively reads the configurations in `.spinrc.js` files in all the child directories. When a configuration in
each child directory is read or a builder is executed, the current working directory is set to point to this same
directory. This scheme of operation should be compatible to all 3rd party tools.
