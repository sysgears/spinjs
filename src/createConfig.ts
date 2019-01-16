import * as cluster from 'cluster';
import * as fs from 'fs';
import * as minilog from 'minilog';
import * as path from 'path';
import upDirs from './upDirs';

import { Builder } from './Builder';
import BuilderDiscoverer from './BuilderDiscoverer';
import { ConfigPlugin } from './ConfigPlugin';
import ConfigReader from './ConfigReader';
import AngularPlugin from './plugins/AngularPlugin';
import ApolloPlugin from './plugins/ApolloPlugin';
import BabelPlugin from './plugins/BabelPlugin';
import CssProcessorPlugin from './plugins/CssProcessorPlugin';
import FlowRuntimePLugin from './plugins/FlowRuntimePlugin';
import I18NextPlugin from './plugins/I18NextPlugin';
import ReactHotLoaderPlugin from './plugins/ReactHotLoaderPlugin';
import ReactNativePlugin from './plugins/ReactNativePlugin';
import ReactNativeWebPlugin from './plugins/ReactNativeWebPlugin';
import ReactPlugin from './plugins/ReactPlugin';
import StyledComponentsPlugin from './plugins/StyledComponentsPlugin';
import TCombPlugin from './plugins/TCombPlugin';
import TypeScriptPlugin from './plugins/TypeScriptPlugin';
import VuePlugin from './plugins/VuePlugin';
import WebAssetsPlugin from './plugins/WebAssetsPlugin';
import WebpackPlugin from './plugins/WebpackPlugin';
import Spin from './Spin';
import Stack from './Stack';

const WEBPACK_OVERRIDES_NAME = 'webpack.overrides.js';

const spinLogger = minilog('spin');

const getProjectRoot = (builder: Builder): string => {
  const pkgPathList = upDirs(builder.require.cwd, 'package.json');
  let projectRoot;
  for (const pkg of pkgPathList) {
    if (fs.existsSync(pkg)) {
      try {
        JSON.parse(fs.readFileSync(pkg, 'utf8'));
        projectRoot = path.dirname(pkg);
      } catch (e) {}
    }
  }
  return projectRoot;
};

// const getAppModuleRegexp = (projectRoot: string): string => {
//   const regexp = '';
//   const files = fs.readdirSync(projectRoot);
//   files.forEach(file => {
//     if (file === 'node_modules') {
//       // searchInside();
//     }
//     console.log(file, fs.statSync(file).isDirectory());
//   });
//   return regexp;
// };

const createConfig = (cwd: string, cmd: string, argv: any, builderName?: string) => {
  const builders = {};

  const plugins = [
    new WebpackPlugin(),
    new WebAssetsPlugin(),
    new CssProcessorPlugin(),
    new ApolloPlugin(),
    new TypeScriptPlugin(),
    new BabelPlugin(),
    new ReactPlugin(),
    new ReactHotLoaderPlugin(),
    new TCombPlugin(),
    new FlowRuntimePLugin(),
    new ReactNativePlugin(),
    new ReactNativeWebPlugin(),
    new StyledComponentsPlugin(),
    new AngularPlugin(),
    new VuePlugin(),
    new I18NextPlugin()
  ];
  const spin = new Spin(cwd, cmd);
  let role = cmd;
  if (cmd === 'exp') {
    role = 'build';
  } else if (cmd === 'start') {
    role = 'watch';
  }

  let discoveredBuilders;
  if (cluster.isMaster) {
    const builderDiscoverer = new BuilderDiscoverer(spin, plugins, argv);

    discoveredBuilders = builderDiscoverer.discover();
  } else {
    discoveredBuilders = new ConfigReader(spin, plugins).readConfig(process.env.BUILDER_CONFIG_PATH);
  }
  if (!discoveredBuilders) {
    throw new Error('Cannot find spinjs config');
  }
  if (cluster.isMaster && argv.verbose) {
    spinLogger.log('SpinJS Config:\n', require('util').inspect(discoveredBuilders, false, null));
  }

  for (const builderId of Object.keys(discoveredBuilders)) {
    const builder = discoveredBuilders[builderId];
    const stack = builder.stack;
    if (builder.roles.indexOf(role) < 0 || (process.env.BUILDER_ID && builderId !== process.env.BUILDER_ID)) {
      continue;
    }

    builder.enabled =
      (builder.enabled !== false && !argv.d) ||
      (builder.enabled !== false && argv.d && ![].concat(argv.d).some(regex => new RegExp(regex).test(builder.name))) ||
      (builder.enabled === false && argv.e && [].concat(argv.e).some(regex => new RegExp(regex).test(builder.name))) ||
      builder.name === builderName;

    if (builder.enabled && !cluster.isMaster) {
      builder.projectRoot = getProjectRoot(builder);
      // builder.appModuleRegexp = getAppModuleRegexp(builder.projectRoot);
    }

    if (spin.dev && builder.webpackDll && !stack.hasAny('server') && !builderName) {
      const dllBuilder: Builder = { ...builder };
      dllBuilder.name = builder.name + 'Dll';
      dllBuilder.require = builder.require;
      dllBuilder.parent = builder;
      dllBuilder.stack = new Stack(dllBuilder.stack.technologies, 'dll');
      builders[`${builderId.split('[')[0]}[${builder.name}Dll]`] = dllBuilder;
      builder.child = dllBuilder;
    }
    builders[builderId] = builder;
  }

  for (const builderId of Object.keys(builders)) {
    const builder = builders[builderId];
    if (!builder.enabled) {
      continue;
    }

    const overridesConfig = builder.overridesConfig || WEBPACK_OVERRIDES_NAME;
    const overrides = fs.existsSync(overridesConfig) ? builder.require('./' + overridesConfig) : {};

    builder.depPlatforms = overrides.dependencyPlatforms || builder.depPlatforms || {};
    builder.dllExcludes = builder.dllExcludes || [];
    builder.plugins.forEach((plugin: ConfigPlugin) => plugin.configure(builder, spin));

    const strategy = {
      entry: 'replace',
      stats: 'replace'
    };
    if (overrides[builder.name]) {
      builder.config = spin.mergeWithStrategy(strategy, builder.config, overrides[builder.name]);
    }
    builder.config = spin.createConfig(builder, 'webpack', builder.config);
  }

  return { builders, spin };
};

export default createConfig;
