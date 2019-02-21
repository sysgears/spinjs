import * as path from 'path';

import { RawSource } from 'webpack-sources';
import { Builder } from '../../Builder';
import Spin from '../../Spin';

export default class SwaggerWebpackPlugin {
  private _config: any;
  private _swaggerJsDoc: any;
  private _VirtualModules: any;
  private _builder: any;
  private _bail: any;
  private _pkgJson: any;

  constructor(builder: Builder, spin: Spin) {
    const pkgJson = builder.require('./package.json');
    this._pkgJson = pkgJson;
    this._config = spin.createConfig(builder, 'swaggerJsDoc', {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: { title: pkgJson.name, version: pkgJson.version, description: pkgJson.description }
      },
      apis: ['!(node_modules)/**/*.js', '!(node_modules)/**/*.ts']
    });
    this._builder = builder;
    this._bail = !spin.dev;
    this._swaggerJsDoc = builder.require('swagger-jsdoc');
    this._VirtualModules = builder.require('webpack-virtual-modules');
  }

  public apply(compiler) {
    const swaggerJsonPath = path.join(this._builder.projectRoot, 'node_modules', 'swagger.json');
    const pkgJson = this._pkgJson;
    const emptyDoc = {
      openapi: '3.0.0',
      info: { title: pkgJson.name, version: pkgJson.version, description: pkgJson.description }
    };
    const virtualModules = new this._VirtualModules({
      [swaggerJsonPath]: JSON.stringify(emptyDoc)
    });
    virtualModules.apply(compiler);
    const pluginName = 'SwaggerJSDocPlugin';
    compiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.normalModuleLoader.tap(pluginName, (_, module) => {
        if (module.resource === swaggerJsonPath) {
          let result;
          let error;
          try {
            result = this._swaggerJsDoc(this._config);
          } catch (e) {
            error = e;
          }
          module.loaders.push({
            loader: require.resolve('./virtualModuleLoader'),
            options: { result, error }
          });
        }
      });
    });
  }
}
