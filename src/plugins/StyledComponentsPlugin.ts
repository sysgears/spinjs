import { Builder } from '../Builder';
import { ConfigPlugin } from '../ConfigPlugin';
import Spin from '../Spin';
import JSRuleFinder from './shared/JSRuleFinder';

export default class StyledComponentsPlugin implements ConfigPlugin {
  public configure(builder: Builder, spin: Spin) {
    const stack = builder.stack;

    if (
      stack.hasAll(['styled-components', 'webpack']) &&
      (stack.hasAny('web') || (stack.hasAny('server') && builder.ssr))
    ) {
      const jsRuleFinder = new JSRuleFinder(builder);
      const jsRule = jsRuleFinder.findJSRule();
      if (jsRule && jsRule.use) {
        for (let idx = 0; idx < jsRule.use.length; idx++) {
          const rule = jsRule.use[idx];
          if (rule.loader.indexOf('babel') >= 0 && !rule.options.babelrc) {
            jsRule.use[idx] = spin.merge(jsRule.use[idx], {
              options: {
                plugins: [['babel-plugin-styled-components', { ssr: builder.ssr }]]
              }
            });
          }
        }
      }
    }
  }
}
