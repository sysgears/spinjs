# SpinJS Configuration

For SpinJS to work, it's enough to install the project dependencies and run [SpinJS scripts] from the root of the 
project &ndash; SpinJS will automatically configure, build, and run the project for you.

However, if you want more control over how SpinJS builds your project, you can add your own configurations.

You can configure SpinJS in following files: 

* `package.json`
* `.spinrc`
* `.spinrc.json`
* `.spinrc.js`

We recommend using the `.spinrc.js` file to configure SpinJS as this way you get the most flexibility. For example, you
can run additional checks before building the project. Throughout this document we'll use `.spinrc.js` file to give 
examples. 

Depending on the structure of your project, you can create separate `.spinrc.js` files for each independent package (if 
your project consists of several packages) or you can use just one root `.spinrc.js` file.

If you're using a single `.spinrc.js`, you can specify the [`options`](#options) property to give common configurations 
for all the builders that you create.

If you decide to configure SpinJS in `.spinrc`, `.spinrc.json` or `package.json`, then all the configurations must be 
stored in the `spin` property (it simply points to the configuration object). If you create SpinJS configurations in 
two files, for example, in `package.json` and `.spinrc.js`, then SpinJS will merge those configurations automatically.

## SpinJS Configuration File

To change SpinJS configurations, you need to add `.spinrc.js` file in the root of your project or package. `.spinrc.js`
must contain the configuration object with the following structure:

```javascript
const config = {
  builders: {
    web: {
      // Configurations for the client application
    },
    server: {
      // Configurations for the server application
    },
    android: {
      // Configurations for the mobile Android application
    },
    ios: {
      // Configurations for the mobile iOS application
    },
    test: {
      // Configurations for the testing
    }
  }
};
```

The SpinJS `config` object can have the following properties:

* [`builders`](#builders)
* [`options`](#options)
* [`backendBuildDir`](#backendbuilddir) (deprecated)
* [`backendUrl`](#backendurl) (deprecated)
* [`buildDir`](#builddir)
* [`cache`](#cache)
* [`defines`](#defines)
* [`devProxy`](#devproxy)
* [`dllBuildDir`](#dllbuilddir)
* [`dllExcludes`](#dllexcludes)
* [`enabled`](#enabled)
* [`entry`](#entry)
* [`frontendBuildDir`](#frontendbuilddir) (deprecated)
* [`frontendRefreshOnBackendChange`](#frontendrefreshonbackendchange)
* [`minify`](#minify)
* [`nodeDebugger`](#nodedebugger)
* [`roles`](#roles)
* [`persistGraphQL`](#persistgraphql)
* [`plugins`](#plugins)
* [`profile`](#profile)
* [`sourceMap`](#sourcemap)
* [`ssr`](#ssr)
* [`stack`](#stack)
* [`waitOn`](#waiton)
* [`webpackDevHost`](#webpackdevhost)
* [`webpackDevPort`](#webpackdevport)
* [`webpackDevProtocol`](#webpackdevprotocol)
* [`webpackDll`](#webpackdll)
* [`writeStats`](#writestats)
* [`{toolName}Config`](#toolnameconfig)

## Supported Technology Stacks

SpinJS supports the following platforms, which you need to specify in the `config.options.stack` property in 
`.spinrc.js`:

* `web`, targets the code for client-side applications
* `server`, targets the code for server applications
* `android`, targets the code for Android
* `ios`, targets the code for iOS

You can add these options to either `package.json` or `.spinrc.js`:

* `package.json`

```json
{
  "spin": ["web"]
}
```

* If you use a `.spinrc.js` file, then add the platform to `config.builders.{platform}.stack` where `{platform}` must be
replaced with the respective property &ndash; `web`, `server`, `android`, or `ios`. 

For example, if you're building your application for the web platform, you can use the following `config`:

```js
const config = {
  builders: {
    web: {
      stack: ['web'] // You can add "react", "es6", "css" to make the stack more specific
    }    
  }
}
```

## SpinJS Options

### `builders`

`builders` is the main property in the SpinJS `config` object. In the `builders` property, you can configure SpinJS for 
different platforms. Typically, `builders` contain at least one property &ndash; the platform such as `web`, `server`, 
`android`, `ios`, or `test`. You can specify multiple builders under the `builders` property. 

This is how you can configure SpinJS for the web platform and testing:

```js
const config = {
  builders: {
    web: {
      stack: ['web']
    },
    test: {
      // ...
    }
  }
}
```

### `backendBuildDir`

**Deprecated**! Use [`buildDir`](#builddir) instead.

Sets the path to the output directory for code targeted to run under Node.js.

### `backendUrl`

**Deprecated**! Use [`defines`](#defines) and [`waitOn`](#waiton) instead.

Sets the URL to a REST or GraphQL API endpoint. Defaults to [http://localhost:8080].

### `buildDir`

Sets the path to the output directory for the build code for a specific builder. The directory `build` is automatically
generated. The path is resolved from the current working directory where `.spinrc.js` is located.

Usage example:

```js
const config = {
  builders: {
    web: {
      buildDir: 'build/web'
    },
    server: {
      buildDir: 'build/server'
    }
  }
};
```

### `cache`

Enables or disables caching the build files. Accepts the following options:

* `true`, enables caching for production builds.
* `false`, disables caching
* `'auto'`, default option. Use it only for the development mode.

**Type**: `Boolean|String` <br />
**Default**: `true`

Usage example:

```js
const config = {
  builders: {
    web: {
      cache: true
    },
    server: {
      cache: false
    }
  }
};
```

### `defines`

Assigns the environment variables and various global properties such as the server port, API keys, and other properties
that will be available at compile time to the generated code. You can use whatever names for these properties.

Usage example. The following example sets the development mode to `true` in the `__DEV__` property; the back-end API
endpoint `__API_URL__` to `http://localhost:8080/graphql`; the website URL, and the Stripe publishable key:

```javascript
const config = {
  builders: {

  },
  options: {
    defines: {
      __DEV__: process.env.NODE_ENV !== 'production',
      __API_URL__: '"http://localhost:8080/graphql"',
      __WEBSITE_URL__: '"http://localhost:8080"',
      'process.env.STRIPE_PUBLIC_KEY': !!process.env.STRIPE_PUBLIC_KEY ? `"${process.env.STRIPE_PUBLIC_KEY}"` : undefined
    }
  }
};
```

### `devProxy`

Proxies all unknown requests from the front end to the back end in development mode.

**Type**: `Boolean` <br />
**Default**: `true`

Usage example:

```js
const config = {
  builders: {
    web: {
      devProxy: false // disables proxying the unknown requests to the back end
    }
  }
};
```

### `dllBuildDir`

Sets the output directory for the webpack DLL files, which are used to speed up the incremental builds.

Usage example:

```js
const config = {
  builders: {
    android: {
      buildDir: 'build/android', 
      dllBuildDir: 'build/android/dll' // webpack DLL files will be stored under `root/../build/android/dll`
    }
  }
}
```

### `dllExcludes`

Sets the list of regular expressions to match against the dependency package names that should be excluded from the
webpack DLL files.

### `enabled`

Enables or disables the current builder. Set to `false` if you don't need to build the code for a certain platform.

**Type**: `Boolean` <br />
**Default**: `true`

Usage example:

```js
const config = {
  builders: {
    // the React application won't be built
    react: {
      stack: ['web', 'react', 'es6', 'webpack', 'babel'],
      enabled: false
    },
    // the Angular app will be built
    angular: {
      stack: ['web', 'angular', 'ts', 'webpack'],
      enabled: true
    }
  }
}
```

### `entry`

Sets the path to the entry file of the project or package for the current builder. Typically, the file is `index.js`. 
You can also use `.jsx`, `.ts`, or `.tsx` extensions in your project.

**Default**: `src/{platform}/index.{js,jsx,ts,tsx}`.

Usage example:

```js
const config = {
  builders: {
    web: {
      entry: './packages/client/index.js'
    }
  }
}
```

### `frontendBuildDir`

**Deprecated**! Use [`buildDir`](#builddir) instead.

Sets the output directory for code targeted to run in the browser or on a mobile device.

### `frontendRefreshOnBackendChange`

Triggers refreshing the front-end code when the back-end code changes. **Use this property only for the server 
builders**.

**Type**: `Boolean` <br />
**Default**: `false`

Usage example:

```js
const config = {
  builders: {
    server: {
      entry: './src/index.ts',
      stack: ['server'],
      frontendRefreshOnBackendChange: true
    }
  }
};
```

### `minify`

Minifies the output code for production.

**Type**: `Boolean` <br />
**Default**: `true`

Usage example:

```js
const config = {
  builders: {
    server: {
      minify: true
    }
  }
};
```

### `nodeDebugger`

Enables the Node.js debugger.

**Type**: `Boolean` <br />
**Default**: `true`

Usage example:

```js
const config = {
  builders: {
    server: {
      stack: ['server'],
      nodeDebugger: true
    }
  }
};
```

### `openBrowser`

Opens the browser when the build is created. Use this option only for web builders.

**Type**: `Boolean`
**Default**: `true`

Usage example:

```js
const config = {
  builders: {
    web: {
      stack: ['web'],
      openBrowser: true
    }
  }
};
```

### `options`

Allows you to set the global configurations for all builders in the current SpinJS configuration file. SpinJS will copy 
the options in `options` into each builder.

Usage example:

```js
const config = {
  builders: { /* Your builders */ },
  options: {
    /* Global options to be re-used for all builders */
  }
}
```

### `roles`

Configures the builder roles. Use the following values: `build`, `watch`, or `test`.

**Default**: `["build", "watch"]`

* `build`, defines the builder for build
* `watch`, defines the builder for development mode with live or hot reload
* `test`, defines the builder for testing mode

Usage example:

```js
const config = {
  builders: {
    server: {
      entry: './src/index.js'
    },
    test: {
      role: ['test']
    }
  }
};
```

### `persistGraphQL`

Generates and uses Apollo persistent GraphQL queries.

**Type**: `Boolean` <br />
**Default**: `true`

Usage example:

```js
const config = {
  builders: {
    server: {
      persistGraphQL: true
    }
  }
};
```

### `plugins`

Sets the additional module names for SpinJS plugins.

### `profile`

Enables generation of the builder profiling data for use in Chrome Performance tab.

### `sourceMap`

Enables source maps generation for the output code.

**Type**: `Boolean` <br />
**Default**: `true`

### `ssr`

Enables server side rendering (SSR). Enabling this option will make it possible to require the client-side assets inside 
the server code.

**Type**: `Boolean` <br />
**Default**: `true`

### `stack`

Defines the technology stack for the platform. You can provide an array of string values or a string with technologies
separated by a colon

The `stack` property can accept the following technologies:

| Option            | Description                                  |
| ----------------- | -------------------------------------------- |
| babel             | Transpile ES6 and ES7 code to ECMAScript 5   |
| ts                | Transpile TypeScript code to ECMAScript 5    |
| vue               | Vue                                          |
| i18next           | Loader to generate resources for `i18next`   |
| angular           | Angular                                      |
| react             | React                                        |
| react-native      | React Native with Expo                       |
| react-hot-loader  | Use React Hot Loader during development      |
| styled-components | Styled Components                            |
| storybook         | Generate Webpack config for Storybook        |
| css               | CSS                                          |
| sass              | SCSS code is transpiled to CSS               |
| less              | LESS code is transpiled to CSS               |
| apollo            | Apollo GraphQL                               |
| server            | The code is targeted to the server platform  |
| android           | The code is targeted to the Android platform |
| ios               | The code is targeted to the iOS platform     |
| web               | The code is targeted to run in a web browser |

Usage example:

```js
const config = {
  builders: {
    web: {
      stack: ['web', 'babel', 'react', 'es6', 'css', 'sass'] // use an array of strings
    },
    server: {
      stack: "server:ts:apollo:i18next" // use a string with values separated by a colon
    },
    ios: {
      stack: ['ios', 'less']
    }
  }
}
```

### `waitOn`

Sets the URL in the format as defined by the [wait-on] NPM package. Enabling this property allows the web builder to
wait for files, ports, sockets, and HTTP or HTTPS resources to become available **before** emitting the compiled code.

**Type**: `Boolean` <br />
**Default**: `true`

Usage example:

```js
const config = {
  builders: {
    web: {
      // wait for the server to start prior to letting webpack to load the client pages
      waitOn: ['tcp:localhost:8080']
    },
  }
}
```

This option is useful to force the front end wait until the back end code was fully compiled and the server application 
has started in development mode.

### `webpackDevHost`

Sets the [webpack-dev-server host]. Use this option only when you need to host the development server in the cloud!

Usage example:

```js
const config = {
  builders: {
    web: {
      webpackDevHost: '0.0.0.0'
    }
  }
}
```

### `webpackDevPort`

Sets the local port used by webpack-dev-server to host the files.

**Type**: `Number` <br />
**Default**: `8080`

Usage example:

```javascript
const config = {
  builders: {
    web: {
      webpackDevPort: 4000 // your web application will run on this port
    }
  }
}
```

### `webpackDevProtocol`

Sets the protocol for webpack-dev-server. You can set `webpackDevProtocol` to `http` and `https`.

**Type**: `String` <br />
**Default**: `http`

Usage example:

```javascript
const config = {
  builders: {
    web: {
      webpackDevProtocol: 'https'
    }
  }
}
```

### `webpackDll`

Enables generating the webpack DLL files to speed up incremental builds.

**Type**: `Boolean` <br />
**Default**: `true`

```javascript
const config = {
  builders: {
    web: {
      webpackDLL: false // disables generating webpack DLL files
    }
  }
}
```

### `writeStats`

Write `stats.json` to your HDD or SSD.

**Type**: `Boolean` <br />
**Default**: `true`

### `{toolName}Config`

Sets additional configuration options for various tools such as loaders, webpack, or other tools.

SpinJS auto-generates configurations for the tools such as webpack and Babel, but if you want to tweak the 
configurations, you can set additional properties in the `.spinrc.js` file.

The SpinJS `config` object accepts such properties as `webpackConfig`, `babelConfig`, and similar. Notice the pattern:
`{toolName}Config`, where the tool name must be all lowercase letters. The `{toolName}` is the name of the library or 
loader. For example, you can add your specific configurations for webpack by using the `webpackConfig` property on the
builder object; by using `babelConfig` for Babel settings; `sassConfig` for Sass, etc. 
as you need.

Instead of adding your specific properties to one builder, you can add them to `builders.options` to use your custom 
configuration options for _all_ builders defined in `config.builders`.

Your additional configurations will be merged with the auto-generated configs with the utility called [`webpack-merge`].

Usage example:

```js
const config = {
  builders: {
    web: {
      webpackConfig: {
        plugins: [
          new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html')
          })
        ],
        devServer: {
          disableHostCheck: true
        }
      }
    }
  }
};
```

[three SpinJS scripts]: https://github.com/sysgears/spinjs/blob/master/docs/scripts.md
[spin with `-v` option]: https://github.com/sysgears/spinjs/blob/master/README.md
[`webpack-merge` strategies documentation]: https://github.com/survivejs/webpack-merge#merging-with-strategies
[wait-on]: https://www.npmjs.com/package/wait-on
[webpack-dev-server host]: https://webpack.js.org/configuration/dev-server/#devserver-host
