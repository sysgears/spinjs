# How SpinJS Works

In this section, we give an overview of how SpinJS works.

## SpinJS Thought Process

In short, here is how SpinJS thinks:

1. It analyzes the project dependencies and source-code layout.
2. It builds the configuration for build tools.
3. It merges the generated dependency configuration with your custom project configuration (which you can add with a 
`.spinrc.js` file).

### #1 Analyzing the Dependencies

When you run your project with `spin watch`, SpinJS reads the project's `package.json` file as well as the _actually
installed_ dependencies in `node_modules` and recursively analyzes the project dependencies (read: it analyzes the 
project dependencies and the dependencies of dependencies).

SpinJS builds an internal model of the project, using which it will be able to understand what technologies are used in
the project.

### #2 Building the Configuration

Once the list of dependencies is created, SpinJS selects the known dependencies and generates a configuration for a 
build tool. For example, if you install Express, SpinJS will understand that you need a configuration for an Express 
server application. Similarly, if you've installed React Native, SpinJS will configure a React Native mobile app 
project.

To generate configurations for a build tool for all known technologies, SpinJS uses [plugins]. Each plugin knows only 
about its own technology. SpinJS plugins also understand for what environment &ndash; development, production, or test 
&ndash; the configuration must be generated.

Internally, each plugin analyzes the list of installed dependencies searching for those it knows about; and if a plugin
found the technology, it generates a configuration.

For example, SpinJS has a plugin for React and webpack, which short version looks like this:

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

This plugin verifies if the `builder.{platform}.stack` property contains the React and webpack dependencies. If they're 
available, then the plugin will generate webpack configurations for React.

> The `builder.{platform}.stack` property can be specified in the `.spinrc.js` file; if you didn't create this file, 
SpinJS just uses the technologies list from `package.json`.
> The second check `!stack.hasAny('dll')` is necessary to prevent generating webpack configuration for React again. The
generated webpack DLL files will be used to create a build. Read more about [webpack DLL](#webpack-dll).

For example, you can specify that you need configurations for a React application by using the SpinJS `config` object 
below and `ReactPlugin` will understand what to do:

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

The generated build configuration for each technology is merged with your custom webpack configuration (if you provided 
any) using *webpack-merge* to ensure that the configs are created without conflicts.

## Webpack DLL

Webpack DLL files are a bundle that gets generated from the _runtime project dependencies_. Using sane words, SpinJS 
generates the project bundle only once. Then, when you change the project code and an incremental build is created, 
webpack does _not_ re-compile all the dependencies again, which helps to drastically increase the speed of creating 
incremental builds.

You can consider webpack DLL files as a sort of cache for your builds in development mode, and SpinJS leverages the 
power of using webpack DLLs.

## Current Working Directory

SpinJS recursively reads the configurations in `.spinrc.js` files in all the child directories. When a configuration in
each child directory is read or a builder is executed, the current working directory is set to point to this same
directory. This scheme of operation should be compatible to all third-party tools.
