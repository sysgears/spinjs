import * as path from 'path';

import createBuilders from './createBuilders';

interface CreateConfigOptions {
  cwd?: string;
  cmd?: string;
  builderName?: string;
  builderOverrides?: any;
  genConfigOverrides?: any;
}

export default (options?: CreateConfigOptions): any => {
  const defaultOptions: CreateConfigOptions = {};
  const { cwd, cmd, builderName, builderOverrides, genConfigOverrides } = options || defaultOptions;
  const dir = path.resolve(cwd || '.');
  const { builders } = createBuilders({
    cwd: dir,
    cmd: cmd || 'watch',
    argv: {},
    builderOverrides,
    genConfigOverrides
  });
  let builder;
  if (builderName) {
    builder = builders[builder];
  } else {
    const builderNames = Object.keys(builders || {}).filter(name => !builders[name].parent);
    if (builderNames.length > 1) {
      throw new Error('Too many matching builders declared you must pick the right one');
    } else {
      builder = builders[builderNames[0]];
    }
  }
  return builder.config;
};
