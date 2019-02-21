import { Builder } from '../Builder';
import { ConfigPlugin } from '../ConfigPlugin';
import Spin from '../Spin';
import SwaggerWebpackPlugin from './webpack/SwaggerWebpackPlugin';

export default class VuePlugin implements ConfigPlugin {
  public configure(builder: Builder, spin: Spin) {
    const stack = builder.stack;

    if (stack.hasAll(['webpack', 'server', 'rest'])) {
      if (builder.require.probe('swagger-jsdoc') && builder.require.probe('webpack-virtual-modules')) {
        builder.config = spin.merge(builder.config, {
          plugins: [new SwaggerWebpackPlugin(builder, spin)]
        });
      }
    }
  }
}
