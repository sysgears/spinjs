import * as os from 'os';
import * as path from 'path';

import { Builder } from '../../Builder';
import Spin from '../../Spin';

export const hasParallelLoalder = (builder: Builder) => {
  return !!builder.require.probe('thread-loader');
};

export const addParalleLoaders = (builder: Builder, spin: Spin, compilerRules) => {
  const cacheLoader = builder.require.probe('cache-loader');
  const threadLoader = builder.require.probe('thread-loader');
  const result = compilerRules.slice(0);
  if (threadLoader) {
    result.unshift({
      loader: 'thread-loader',
      options: spin.createConfig(builder, 'threadLoader', {
        workers: os.cpus().length - 1
      })
    });
  }
  if (cacheLoader && !!builder.cache) {
    result.unshift({
      loader: 'cache-loader',
      options: spin.createConfig(builder, 'cacheLoader', {
        cacheDirectory: path.join(
          typeof builder.cache === 'string' && builder.cache !== 'auto' ? builder.cache : '.cache',
          'cache-loader'
        )
      })
    });
  }
  return result;
};
