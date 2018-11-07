import * as path from 'path';

import { Builder } from '../Builder';
import { ConfigPlugin } from '../ConfigPlugin';
import Spin from '../Spin';
import JSRuleFinder from './shared/JSRuleFinder';

export default class AngularPlugin implements ConfigPlugin {
  public configure(builder: Builder, spin: Spin) {
    const stack = builder.stack;

    if (stack.hasAll(['angular', 'webpack'])) {
      const webpack = builder.require('webpack');

      const jsRuleFinder = new JSRuleFinder(builder);
      const tsRule = jsRuleFinder.findAndCreateTSRule();
      builder.config = spin.merge(builder.config, {
        module: {
          rules: [
            {
              test: tsRule.test,
              use: { loader: 'angular2-template-loader', options: spin.createConfig(builder, 'angular2Template', {}) }
            },
            /**
             * Enabling the SystemJS parser for the .js files under @angular/core/ will disable
             * the deprecation warnings.
             * See https://prntscr.com/lezfmd
             *
             * SystemJS is disabled by default for webpack.
             * See https://webpack.js.org/configuration/module/#rule-parser
             *
             * Note that the webpack.ContextReplacementPlugin must also be properly configured (see below).
             */
            {
              test: /[\\\/]@angular[\\\/]core[\\\/].+\.js$/,
              parser: { system: true }
            }
          ]
        },
        plugins: [
          // Workaround for angular/angular#11580
          new webpack.ContextReplacementPlugin(
            /**
             * Override the initial configuration for ContextReplacementPlugin.
             * The argument /angular[\\\/]core[\\\/]@angular/ causes several warnings.
             * See https://prnt.sc/lezevh
             *
             * It's necessary to remove the @angular part and fix the issue by enabling
             * the proper module.rules.Rule for @angular/core/*.js files(see above).
             */
            /angular[\\\/]core/,
            path.join(builder.require.cwd, 'src'),
            {} // a map of your routes
          )
        ]
      });

      if (!stack.hasAny('dll') && stack.hasAny('web')) {
        builder.config = spin.merge(
          {
            entry: {
              index: [require.resolve('./angular/angular-polyfill.js')]
            }
          },
          builder.config
        );

        const { CheckerPlugin } = builder.require('awesome-typescript-loader');

        builder.config = spin.merge(builder.config, {
          module: {
            rules: [
              {
                test: /\.html$/,
                loader: 'html-loader',
                options: spin.createConfig(builder, 'html', {})
              }
            ]
          },
          plugins: [new CheckerPlugin()]
        });
      }
    }
  }
}
