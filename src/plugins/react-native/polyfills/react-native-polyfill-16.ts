// tslint:disable:no-var-requires no-implicit-dependencies
require('react-native/Libraries/polyfills/Object.es6.js');
require('react-native/Libraries/polyfills/console.js');
require('react-native/Libraries/polyfills/error-guard.js');
require('react-native/Libraries/polyfills/Number.es6.js');
require('react-native/Libraries/polyfills/String.prototype.es6.js');
require('react-native/Libraries/polyfills/Array.prototype.es6.js');
require('react-native/Libraries/polyfills/Array.es6.js');
require('react-native/Libraries/polyfills/Object.es7.js');
require('react-native/Libraries/polyfills/babelHelpers.js');

declare var __DEV__;

(global as any).__DEV__ = __DEV__;
(global as any).__BUNDLE_START_TIME__ = (global as any).nativePerformanceNow
  ? (global as any).nativePerformanceNow()
  : Date.now();

if (!(global as any).self) {
  (global as any).self = global;
}
require('react-native/Libraries/Core/InitializeCore.js');
