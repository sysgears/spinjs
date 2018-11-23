# Concepts

SpinJS is based on several concepts. The key ideas in SpinJS are [builders](#builders), [plugins](#plugins), and the 
[use of webpack](#building-react-native-mobile-apps) to create project builds not only for web and server applications,
but for React Native mobile apps as well. 

## Builders

A **builder** in SpinJS is an object that contains platform configurations for your project. You can create a single 
builder with configurations for several platforms, or you can create separate builders for each platform and specify the 
common settings for all builders.

You can specify the builder settings in the following files in the `builders` property:

* `.spinrc`
* `.spinrc.js`
* `.spinrc.json`
* `package.json`

The `.spinrc.json`, `.spinrc`, or `.spinrc.js` files must be located in the root project directory next to
`package.json`. If you're using separate packages, you can specify the builder properties in the package root.

The following example shows how you can add a builder into a `package.json` file:

```json
{
  "spin": "webpack:babel:apollo:server"
}
```

The configuration above will tell SpinJS that it needs to build a server project with webpack, Babel, and Apollo 
(GraphQL).

You can configure SpinJS to set up and launch multiple builders in parallel. For that, you can use the property
`builders`:

```json
{
  "spin": {
    "builders": {
      "server": {
        "stack": "webpack:babel:apollo:ts:server"
      },
      "web": {
        "stack": "webpack:babel:apollo:react:styled-components:sass:web"
      },
      "mobile": {
        "stack": "webpack:babel:apollo:react-native:styled-components:sass:ios"
      }
    }
  }
}
```

You can learn more about builders in a the [docs/concepts.md#builders] section.

## Plugins

SpinJS comes with many plugins that handle generation of webpack configurations. Each SpinJS plugin is responsible for
its own subset of technologies that you specified in the stack.

For instance, if you're building a React application for the web platform, it's likely you're using the following stack:

* React
* Babel
* Webpack
* Some CSS preprocessor such as Sass

Each of the mentioned library is managed by it's own plugin. For example, to handle React, the SpinJS plugin
`ReactPlugin` configures webpack for you; similarly, `BabelPlugin` handles the Babel settings, and so on.

Currently, SpinJS provides the following plugins:

* AngularPlugin
* ApolloPlugin
* BabelPlugin
* CssProcessorPlugin
* FlowRuntimePlugin
* I18NextPlugin
* ReactHotLoaderPlugin
* ReactNativePlugin
* ReactNativeWebPlugin
* ReactPlugin
* StyledComponentsPlugin
* TCombPlugin
* TypeScriptPlugin
* VuePlugin
* WebAssetsPlugin
* WebpackPlugin

You can add any external plugins can be specified inside the `options.plugins` property in `.spinrc.js`.

## Building React Native Mobile Apps

Besides configuring webpack for server and client applications, SpinJS can also build the React Native bundles for
mobile apps.

Building bundles for React Native apps is a non-trivial task, as we go against the flow in this regard:
**SpinJS uses _webpack_ for React Native apps instead of the "standard" bundler &ndash; [Metro] by Facebook**. 

The most complex chunk of SpinJS functionality is actually replacing Metro for React Native apps and using webpack 
instead.

Metro is a dedicated bundler for React Native apps and it aims to replace webpack. However, using Metro and webpack for
building Universal JavaScript applications creates the following issues:

* Because we often create JavaScript applications that work for web, server, and mobile platforms at the same time
(recall the [Universal JavaScript] concept), we're forced to learn the specifics of yet another bundler besides webpack.
* We're forced to write our code differently for the web, server, and mobile platforms if we use different bundlers.
* Metro restricts you in how you can configure the project as compared to webpack.

SpinJS, however, allows you to write code for all the platforms &ndash; server, web, _and mobile_ &ndash; the same way
and use the same build tool for all of them.

[metro]: https://facebook.github.io/metro/
[universal javascript]: https://cdb.reacttraining.com/universal-javascript-4761051b7ae9
[docs/concepts.md#builders]: https://github.com/sysgears/spinjs/blob/master/docs/concepts.md#builders
