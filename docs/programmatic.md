# SpinJS Programmatic Usage

## Storybook Full Control integration example

`.storybook/webpack.config.js`:
``` js
const createConfig = require('spinjs').createConfig;

module.exports = function (baseConfig, configType) {
  return createConfig({
    cmd: configType === 'DEVELOPMENT' ? 'watch' : 'build',
    builderOverrides: { stack: ['storybook'] },
    genConfigOverrides: Object.assign({ merge: { entry: 'replace', output: 'replace' } }, baseConfig)
  });
};
```
