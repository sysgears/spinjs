# Concepts

In this section, you'll know more about SpinJS [builders](#builders) and [plugins](#plugins).

## Builders

The key SpinJS concept is **_builders_**. A builder is just an object that contains the configurations for a specific 
platform. 

You can configure SpinJS to have either one or multiple builders depending on the requirements of your project. SpinJS,
depending on the configurations, can configure and launch multiple builders in parallel. If you specify the `stack` 
property for your project, then only one builder will run.

If you need to specify multiple builders, use the following configurations in `package.json`:

```json
{
    "spin": {
        "builders": {
            "backend": {
                "stack": "webpack:babel:apollo:react:styled-components:sass:server"
            },
            "frontend": {
                "stack": "webpack:babel:apollo:react:styled-components:sass:web"
            },
            "mobile": {
                "stack": "webpack:babel:apollo:react-native:styled-components:sass:ios"
            }
        }
    }
}
```

## Plugins

SpinJS comes with many plugins that handle generation of webpack configurations for a technology. Each SpinJS plugin 
tries to handle the subset of technologies in the builder stack to configure build tools usually used for this stack the 
best way.

### Webpack DLL

DLL Webpack is a bundle that's get generated from runtime dependencies of the project. In other words, SpinJS generates 
the bundle only once. And then, if you changes the project code, the incremental bundle is created, but webpack doesn't
re-compiles all the dependencies again. 

You can consider webpack DLL files as cache for your builds in development mode. In other words, SpinJS is able to 
generate code and also cache the code to increase the speed of the next build.

SpinJS also tries to use various caching mechanisms depending on the tools and technologies used in your project. All
this functionality is broken into multiple plugins.

There are several built-in plugins supplied with `spinjs`. External plugins can be specified inside
`options -> plugins` property.

## Building React Native-based Mobile Apps

Besides configuring webpack for server and client applications, SpinJS can also build the React Native bundles for 
mobile apps.

Building bundles for React Native apps is a non-trivial task for SpinJS: our build tool go against the flow in that it
uses _webpack_ for React Native apps instead of the "industrial standard" &ndash; the [Metro bundler], yet another tool 
created by Facebook. The most complex chunk of SpinJS functionality is replacing Metro for React Native apps and using 
webpack instead.

Metro is a replacement for webpack and can be used _only_ for React Native, which creates several issues: 

* Because we often create JavaScript applications that work for web, server, and mobile platforms at the same time 
(recall the Universal JavaScript concept), we're forced to learn the specifics of yet another bundler besides webpack.
* We're forced to write our code differently for the web, server, and mobile platforms if using different bundlers.
* Metro restricts you in what you can configure compared to webpack.

This is when SpinJS is useful: SpinJS allows you to write code for all the platforms &ndash; server, web, _and mobile_ 
&ndash; the same way and use the same build tool for all of them.

## Current Working Directory

SpinJS recursively reads the configurations in `.spinrc.js` files in all the child directories. When a configuration in 
each child directory is read or a builder is executed, the current working directory is set to point to this same 
directory. This scheme of operation should be compatible to all 3rd party tools.

## Profiling builders

To troubleshoot builder performance set `profile: true` option on the builder. This will generate
`profileEvents.json` file inside `build` dir. In order to view the profile file:
  - Go to Chrome, open `DevTools`, and go to the `Performance tab` (formerly Timeline).
  - Drag and drop generated file `profileEvents.json` into the profiler.

It will then display timeline stats and calls info.

[metro bundler]: https://facebook.github.io/metro/
[`webpack-merge` strategies documentation]: https://github.com/survivejs/webpack-merge#mergestrategy-field-prependappendreplaceconfiguration-configuration