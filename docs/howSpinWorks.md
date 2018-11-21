# How SpinJS Works

In this section, we give an overview of the configuration process as well as how webpack DLL files are used.

## SpinJS Thought Process

In short, here are the stages of how SpinJS thinks:

1. Analyzing the dependencies.
2. Building the configuration for found dependencies.
3. Merging the configuration for a dependency into the global webpack configuration.

### #1 Analyzing the dependencies

When you run your project with `spin watch`, SpinJS reads the contents of the project's `package.json` file and 
recursively analyzes the project dependencies (the project dependencies and the dependencies of dependencies). 

SpinJS builds an internal model of the project, using which it will be able to understand what technologies are used in 
the project.

### #2 Building the configuration

Once the list of dependencies is created, SpinJS selects the known dependencies and generates webpack configuration for 
them. For example, if you install Express, SpinJS will understand that you need a configuration for an Express server 
application. Similarly, if you've installed the `react-native` library, SpinJS will configure a React Native mobile app 
project.

To generate webpack configurations, SpinJS uses [plugins] for each technology. Each plugin knows only about its own 
technology that SpinJS found in the project. The plugin analyzes the entire list of technologies to find out if it needs
to generate a webpack configuration for them. 

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

Basically, if you include the configuration below, `ReactPlugin` will understand that it needs to generate code for the 
React application:

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

Each SpinJS plugin knows how to create a part of webpack configuration for a specific technology. Each plugin also 
understands for what environment the configuration must be generated: for development or for production, or whether you
need to compile webpack DLL files.

## Webpack DLL

Webpack DLL files is a bundle that's get generated from the runtime dependencies of the project. In other words, SpinJS 
generates the bundle only once. And then, if you change the project code, the incremental bundle is created, but 
webpack does _not_ re-compile all the dependencies again. Using webpack DLL files increases the speed of creating 
incremental builds.

You can consider webpack DLL files as cache for your builds in development mode. In other words, SpinJS is able to 
generate code and also cache the code to increase the speed of the next build.

## Current Working Directory

SpinJS recursively reads the configurations in `.spinrc.js` files in all the child directories. When a configuration in 
each child directory is read or a builder is executed, the current working directory is set to point to this same 
directory. This scheme of operation should be compatible to all 3rd party tools.
