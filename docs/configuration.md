# SpinJS Configuration

For SpinJS to work, it's enough to install the project dependencies, add [three SpinJS scripts] to the `package.json`
file, and run a script &ndash; SpinJS will automatically configure, build, and run the project for you.

However, if you want more control over how SpinJS builds your project, you can add your own configurations.

You can configure SpinJS in three ways: in `package.json`, `.spinrc.json`, or `.spinrc.js`. Admittedly, the most
convenient way for configuring SpinJS is using a `.spinrc.js` file (or multiple files if your project has several
independent packages). You should save this file under the project or package root directory.

If you decide to configure SpinJS in `.spinrc.json` or `package.json`, then you need to add the `spin` property, which
will point to the configuration object. If you create configurations in two files, such as `package.json` and
`.spinrc.js`, SpinJS will merge the configurations automatically.

## SpinJS Configuration File

To change SpinJS configurations, you need to add `.spinrc.js` file in the root of your project or package. `.spinrc.js`
must contain the configuration object with the following structure:

```javascript
const config = {
  builders: {
    web: {
      // Configurations for client application
    },
    server: {
      // Configurations for server application
    },
    android: {
      // Configurations for mobile Android application
    },
    ios: {
      // Configurations for mobile iOS application
    },
    test: {
      // Configurations for testing
    }
  }
};
```

If your project has separate packages &ndash; client, server, and mobile, then each package should have its own SpinJS
configuration file with its particular setup. You can view this approach implemented in [Apollo Universal Starter Kit].

Besides the config,

The SpinJS `config` object accepts the following properties:

* [`builders`](#builders)
* [`options`](#options)
* [`backendBuildDir`](#backendbuilddir)
* [`backendUrl`](#backendurl)
* [`buildDir`](#builddir)
* [`cache`](#cache)
* [`defines`](#defines)
* [`devProxy`](#devproxy)
* [`dllBuildDir`](#dllbuilddir)
* [`dllExcludes`](#dllexcludes)
* [`enabled`](#enabled)
* [`entry`](#entry)
* [`frontendBuildDir`](#frontendbuilddir)
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

SpinJS supports the following platforms, which you must specify in the `config.options.stack` property in 
`.spinrc.js`:

* `web`, targets the code for the web platform (the client-side applications)
* `server`, targets the code for the server platform (the server-side applications)
* `android`, targets the code for the Android mobile platform
* `ios`, targets the code for the iOS mobile platform

You can add these option to either `package.json` or `.spinrc.js`:

* `package.json`

```json
{
  "spin": ["web"]
}
```

* If you use a `.spinrc.js` file, then add the platform to `config.builders.platform.stack` where `platform` must be
replaced with the respective property. For example, if you're building your application for web, you can use the
following `config`:

```js
const config = {
  builders: {
    web: {
      stack: ['web']
    }    
  }
}
```

## SpinJS Options

### `builders`

`builders` is the main property in the `config` object. In the `builders` property, you can configure SpinJS for the
platforms. Typically, `builders` contain at least one property, the platform such as `web`, `server`, `android`, `ios`,
or `test`. But you can specify multiple builders. This is how you can configure SpinJS for
the web platform and testing:

```js
const config = {
  builders: {
    web: {
      stack: ['web']
    },
    test: {
    }
  }
}
```

### `options`

Allows you to set global configurations for all builders in the current SpinJS configuration file. SpinJS will copy the
global options into each builder.

Usage example:

```js
const config = {
  builders: { /* Your builders */ },
  options: {
    /* Global options for all builders */
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
generated. The path is resolved from the current directory where `.spinrc.js` is located.

Usage example:

```js
const config = {
  builders: {
    web: {
      buildDir: 'build/web'
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

### `defines`

Assigns the environment variables and various global properties such as the server port, API keys, and other properties
that will be available at compile time to the generated code.

Usage example. The following example sets the development mode to true in the `__DEV__` property; the back-end API
endpoint `__API_URL__`; the website URL, and the Stripe publishable key:

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

Proxies all unknown requests from front end to back end in development mode.

**Type**: `Boolean` <br />
**Default**: `true`

Usage example:

```js
const config = {
  builders: {
    web: {
      devProxy: false
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
      dllBuildDir: 'build/android/dll'
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
    web: {
      enabled: false // set to true to build the client-side code
    }
  }
}
```

### `entry`

Sets the path to the main project or package file for the current builder. Typically, the file is `index.js`. You can
also use `.jsx`, `.ts`, or `.tsx` extensions in your project.

Defaults to `src/{platform}/index.{js,jsx,ts,tsx}`.

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

**Deprecated**. Use `buildDir` instead.

Sets the output directory for code targeted to run in the browser or on a mobile device.

### `frontendRefreshOnBackendChange`

Triggers refreshing the front-end code when the back-end code changes. Use this property only for the server builders.

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

### `roles`

Configures the builder roles. Use the following values: `build`, `watch`, or `test`.

Default: `["build", "watch"]`.

* `build`, defaults the builder for build
* `watch`, defines the builder for development mode
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

Enables server side rendering (SSR) for the application. Enabling this option will make it possible to require the
client-side assets inside the server code.

**Type**: `Boolean` <br />
**Default**: `true`

### `stack`

Defines the technology stack for the platform. You can provide an array of string values or a string with technologies
separated by a colon.

The `stack` property can accept the following technologies:

| Option            | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| babel             | Transpile ECMAScript 6 and ECMAScript 7 code to ECMAScript 5 |
| ts                | Transpile TypeScript code to ECMAScript 5                    |
| vue               | Vue.js                                                       |
| i18next           | Loader to generate resources for `i18next`                   |
| angular           | Angular                                                      |
| react             | React                                                        |
| react-native      | React Native with Expo                                       |
| react-hot-loader  | Use React Hot Loader during development                      |
| styled-components | Styled Components                                            |
| css               | CSS                                                          |
| sass              | SCSS code is transpiled to CSS                               |
| less              | LESS code is transpiled to CSS                               |
| apollo            | Apollo GraphQL                                               |
| server            | The code is targeted to the Node.js platform                 |
| android           | The code is targeted to the Android platform                 |
| ios               | The code is targeted to the iOS platform                     |
| web               | The code is targeted to run in a web browser                 |

Usage example:

```js
const config = {
  builders: {
    web: {
      stack: ['web', 'babel', 'react', 'css', 'sass']
    }
  }
}
```

Alternately, you can pass a string with technologies separated by colons:

```js
const config = {
  builders: {
    web: {
      stack: 'web:babel:react:css:sass'
    }
  }
}
```

### `waitOn`

Sets the URL in the format as defined by the [wait-on] NPM package. Enabling this property will allow the web builder to
to wait for files, ports, sockets, and HTTP or HTTPS resources to become available **before** emitting the compiled
code.

**Type**: `Boolean` <br />
**Default**: `true`

Usage example:

```js
const config = {
  builders: {
    web: {
      // Wait for the server to start prior to letting webpack to load the client pages
      waitOn: ['tcp:localhost:8080']
    },
  }
}
```

This option is useful to force the front end wait until the back end code is fully compiled and starts first in
development mode.

### `webpackDevHost`

Sets the domain name used for webpack-dev-server. Use this option only when you need to host the development server in
the cloud!

Usage example:

```js

```

### `webpackDevPort`

Sets the local port used by webpack-dev-server process to host the web front-end files.

**Type**: `Number` <br />
**Default**: `8080`

### `webpackDevProtocol`

Sets the protocol for webpack-dev-server. You can set `webpackDevProtocol` to `http` and `https`.

**Type**: `String` <br />
**Default**: `http`

### `webpackDll`

Enables generating the webpack DLL files to speed up incremental builds.

**Type**: `Boolean` <br />
**Default**: `true`

### `writeStats`

Write `stats.json` to your HDD or SSD.

**Type**: `Boolean` <br />
**Default**: `true`

### `{toolName}Config`

Sets additional configuration options for various tools such as webpack, loaders, or other tools.

Spin auto-generates configurations for the tools such as webpack and Babel, but if you want to tweak the generated
configurations, you can set additional properties in the `.spinrc.js` file.

The Spin `config` object accepts such properties as `webpackConfig`, `babelConfig`, and similar (the pattern is
`{toolName}Config`), which you can add to each builder and set the configurations for the tool as you need.

Instead of adding these properties to a builder, you can also add them to `builders.options` to enable the configuration
options for _all_ builders defined in `config.builders`.

The additional specific configurations that you provided for the tools will be merged with the auto-generated configs
with the utility called [`webpack-merge`].

You can view the result of merging the configurations by running [Spin with the `-v` option].

The `{toolName}` is the name of the library or loader. For example, you can add your specific configurations for
webpack with `webpackConfig`; for Babel with `babelConfig`; for Sass with `sassConfig`; etc.

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
[apollo universal starter kit]: https://github.com/sysgears/apollo-universal-starter-kit
[spin with `-v` option]: https://github.com/sysgears/spinjs/blob/master/README.md
[`webpack-merge` strategies documentation]: https://github.com/survivejs/webpack-merge#merging-with-strategies
[wait-on]: https://www.npmjs.com/package/wait-on
