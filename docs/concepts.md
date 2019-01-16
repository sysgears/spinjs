# Concepts

SpinJS comes with two key concepts &ndash; [builders](#builders) and [plugins](#plugins).

## Builders

A SpinJS **builder** is an object that contains configurations for a specific platform &ndash; client, server, or 
mobile (Android or iOS), according to the application type you're developing. SpinJS automatically creates a builder 
object for your project using the default configurations, so you don't need to configure SpinJS.
 
However, if your project needs to be built for different platforms, for example, for the client and server, you need to 
create a SpinJS configuration file and specify different settings for several builders. SpinJS also allows you to
reuse the same configurations across multiple builders.

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

The configuration above will tell SpinJS that you want to build a server project with webpack, Babel, and Apollo.

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

Otherwise, you can add a `.spinrc.js` file and configure several builders with various options there:

```js
// SpinJS configuration for multiple builders
let config = {
  builders: {
    server: {
      stack: "webpack:babel:apollo:ts:server",
      enabled: true
    },
    web: {
      stack: "webpack:babel:apollo:react:styled-components:sass:web",
      enabled: true
    },
    mobile: {
      stack: "webpack:babel:apollo:react-native:styled-components:sass:ios",
      enabled: false
    }
  }
};
```

## Plugins

SpinJS comes with many plugins that handle generation of build configurations. Each SpinJS plugin is responsible for its 
own subset of technologies that you specify in the stack.

For instance, if you're building a React application for the web platform, it's likely you're using the following stack:

* React
* Babel
* Webpack
* Some CSS preprocessor

Each of the mentioned dependency is managed by it's own plugin. For example, the SpinJS plugin `ReactPlugin` configures 
webpack for React; similarly, `BabelPlugin` handles the Babel settings, `WebpackPlugin` handles the basic webpack 
configurations, and so on.

Currently, SpinJS has the following plugins:

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

You can add your own external plugins by specifying them inside the [`plugins`] property in `.spinrc.js`.

[`plugins`]: https://github.com/sysgears/spinjs/blob/master/docs/configuration.md#plugins
