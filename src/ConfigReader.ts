import * as fs from 'fs';
import * as path from 'path';
import * as merge from 'webpack-merge';

import { Builders } from './Builder';
import { ConfigPlugin } from './ConfigPlugin';
import createRequire from './createRequire';
import EnhancedError from './EnhancedError';
import inferConfig from './inferConfig';
import Spin from './Spin';
import Stack from './Stack';

interface ReadConfigOptions {
  filePath: string;
  inferedConfig?: any;
  builderOverrides?: any;
}

export default class ConfigReader {
  private spin: Spin;
  private plugins: ConfigPlugin[];

  constructor(spin: Spin, plugins: ConfigPlugin[]) {
    this.spin = spin;
    this.plugins = plugins;
  }

  public readConfig(options: ReadConfigOptions): Builders {
    const { filePath, inferedConfig, builderOverrides } = options;
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      const dir = filePath;
      const candidates = ['.spinrc.json', '.spinrc', '.spinrc.js', 'package.json'];
      for (const fileName of candidates) {
        const configPath = path.join(dir, fileName);
        const derivedConfig = inferConfig(path.join(dir, 'package.json'));
        try {
          const builders = this.readConfig({ filePath: configPath, inferedConfig: derivedConfig, builderOverrides });
          if (builders) {
            return builders;
          }
        } catch (e) {
          e.message = `while processing ${configPath}: ${e.message}`;
          throw e;
        }
      }
    } else {
      const derivedConfig = inferedConfig || inferConfig(path.join(path.dirname(filePath), 'package.json'));
      let configObject: any;
      if (fs.existsSync(filePath)) {
        process.chdir(path.dirname(filePath));
        try {
          const extname = path.extname(filePath);
          if (['.json', ''].indexOf(extname) >= 0) {
            try {
              configObject = JSON.parse(fs.readFileSync(filePath).toString());
              if (path.basename(filePath) === 'package.json') {
                configObject = configObject.spin;
              }
            } catch (e) {
              throw new EnhancedError(`Error parsing ${path.resolve(filePath)}`, e);
            }
          } else {
            const exports = require(path.resolve(filePath));
            configObject = exports instanceof Function ? exports(this.spin) : exports;
          }
        } finally {
          process.chdir(this.spin.cwd);
        }
      }
      return typeof configObject === 'undefined' && !fs.existsSync(filePath)
        ? undefined
        : this._createBuilders(
            filePath,
            configObject && configObject.builders ? configObject : this.spin.merge(derivedConfig, configObject),
            builderOverrides
          );
    }
  }

  private _createBuilders(filePath: string, config: any, builderOverrides: any): Builders {
    if (typeof config === 'string' || (typeof config === 'object' && config.constructor === Array)) {
      config = {
        builders: {
          app: config
        }
      };
    }

    config.options = config.options || {};

    const relativePath = path.relative(this.spin.cwd, path.dirname(filePath));
    const builders: Builders = {};
    const { stack, plugins, ...options } = config.options;
    for (const name of Object.keys(config.builders || {})) {
      const builderVal = config.builders[name];
      const builder: any = this.spin.mergeWithInStrategy(
        typeof builderVal === 'object' && builderVal.constructor !== Array ? { ...builderVal } : { stack: builderVal },
        builderOverrides
      );
      builder.name = name;
      builder.require = createRequire(path.resolve(relativePath));
      builder.stack = new Stack(
        builder.name,
        config.options.stack || [],
        typeof builder === 'object' ? builder.stack : builder
      );
      builder.plugins = (config.plugins || []).concat(builder.plugins || []);
      builder.roles = builder.roles || ['build', 'watch'];
      const merged = merge(options, builder);
      for (const key of Object.keys(merged)) {
        builder[key] = merged[key];
      }
      const builderId = `${relativePath}[${builder.name}]`;
      builder.id = builderId;
      builder.configPath = filePath;
      builders[builderId] = builder;
      // TODO: remove backendBuildDir, frontendBuildDir in 0.5.x
      builder.buildDir = builder.backendBuildDir || builder.frontendBuildDir ? undefined : builder.buildDir || 'build';
      builder.nodeDebugger = typeof builder.nodeDebugger !== 'undefined' ? builder.nodeDebugger : true;
      builder.webpackDll = typeof builder.webpackDll !== 'undefined' ? builder.webpackDll : true;
      builder.sourceMap = typeof builder.sourceMap !== 'undefined' ? builder.sourceMap : true;
      builder.minify = typeof builder.minify !== 'undefined' ? builder.minify : true;
      builder.cache =
        typeof builder.cache === 'string' && builder.cache !== 'auto'
          ? builder.cache
          : typeof builder.cache !== 'undefined'
            ? builder.cache
            : 'auto';
      if (builder.derived) {
        builder.dllBuildDir =
          builder.dllBuildDir ||
          path.join(typeof builder.cache === 'string' && builder.cache !== 'auto' ? builder.cache : '.cache', 'dll');
      } else {
        builder.dllBuildDir = builder.dllBuildDir || 'build/dll';
      }
      builder.plugins = this.plugins.concat((builder.plugins || []).map(pluginName => new (require(pluginName))()));
    }
    return builders;
  }
}
