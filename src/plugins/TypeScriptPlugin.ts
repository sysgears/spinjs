import * as fs from 'fs';
import * as path from 'path';

import { Builder } from '../Builder';
import { ConfigPlugin } from '../ConfigPlugin';
import Spin from '../Spin';
import JSRuleFinder from './shared/JSRuleFinder';
import { addParalleLoaders, hasParallelLoalder } from './shared/parallelLoader';

export default class TypeScriptPlugin implements ConfigPlugin {
  public configure(builder: Builder, spin: Spin) {
    const stack = builder.stack;

    if (stack.hasAll(['ts', 'webpack'])) {
      const atl = builder.require.probe('awesome-typescript-loader');
      const tsChecker = builder.require.probe('fork-ts-checker-webpack-plugin');
      const jsRuleFinder = new JSRuleFinder(builder);
      const tsRule = jsRuleFinder.findAndCreateTSRule();
      tsRule.test = /^(?!.*[\\\/]node_modules[\\\/]).*\.ts$/;
      tsRule.use = addParalleLoaders(builder, spin, [
        atl
          ? {
              loader: 'awesome-typescript-loader',
              options: spin.createConfig(builder, 'awesomeTypescript', { ...builder.tsLoaderOptions, useCache: true })
            }
          : {
              loader: 'ts-loader',
              options: spin.createConfig(builder, 'tsLoader', {
                transpileOnly: tsChecker ? true : false,
                experimentalWatchApi: true,
                happyPackMode: hasParallelLoalder(builder),
                ...builder.tsLoaderOptions
              })
            }
      ]);

      if (atl) {
        builder.config = spin.merge(builder.config, {
          plugins: [new (builder.require('awesome-typescript-loader')).CheckerPlugin()]
        });
      }

      if (tsChecker) {
        builder.config = spin.merge(builder.config, {
          plugins: [
            new (builder.require('fork-ts-checker-webpack-plugin'))({
              checkSyntacticErrors: hasParallelLoalder(builder)
            })
          ]
        });
      }

      builder.config.resolve.extensions = ['.']
        .map(prefix => jsRuleFinder.extensions.map(ext => prefix + ext))
        .reduce((acc, val) => acc.concat(val))
        .concat(['.json']);

      if (!stack.hasAny('dll')) {
        for (const key of Object.keys(builder.config.entry)) {
          const entry = builder.config.entry[key];
          for (let idx = 0; idx < entry.length; idx++) {
            const item = entry[idx];
            if (['.js', '.jsx', '.ts', '.tsx'].indexOf(path.extname(item)) >= 0 && item.indexOf('node_modules') < 0) {
              const baseItem = path.join(path.dirname(item), path.basename(item, path.extname(item)));
              for (const ext of ['.js', '.jsx', '.ts', '.tsx']) {
                if (fs.existsSync(baseItem + ext)) {
                  entry[idx] = (baseItem.startsWith('.') ? '' : './') + baseItem + ext;
                }
              }
            }
          }
        }
      }
    }
  }
}
