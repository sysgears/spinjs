// tslint:disable:no-var-requires no-implicit-dependencies
require('react-native/packager/src/Resolver/polyfills/polyfills.js');
require('react-native/packager/src/Resolver/polyfills/console.js');
require('react-native/packager/src/Resolver/polyfills/error-guard.js');
require('react-native/packager/src/Resolver/polyfills/Number.es6.js');
require('react-native/packager/src/Resolver/polyfills/String.prototype.es6.js');
require('react-native/packager/src/Resolver/polyfills/Array.prototype.es6.js');
require('react-native/packager/src/Resolver/polyfills/Array.es6.js');
require('react-native/packager/src/Resolver/polyfills/Object.es7.js');
require('react-native/packager/src/Resolver/polyfills/babelHelpers.js');

declare var __DEV__;

(global as any).__DEV__ = __DEV__;
(global as any).__BUNDLE_START_TIME__ = Date.now();

if (!(global as any).self) {
  (global as any).self = global;
}
require('react-native/Libraries/Core/InitializeCore.js');
