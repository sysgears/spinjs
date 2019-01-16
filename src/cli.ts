import * as cluster from 'cluster';
import * as minilog from 'minilog';
import * as yargs from 'yargs';

import createConfig from './createConfig';
import execute from './executor';

minilog.enable();
const logger = minilog('spin');
try {
  const VERSION = require('../package.json').version; // tslint:disable-line
  const argv = yargs
    .command('build', 'compiles package for usage in production')
    .command(['watch', 'start'], 'launches package in development mode with hot code reload')
    .command('exp', 'launches server for exp and exp tool')
    .command('expo', 'launches server for expo and expo tool')
    .command('test [mocha-webpack options]', 'runs package tests')
    .demandCommand(1, '')
    .option('c', {
      describe: 'Specify path to config file',
      type: 'string'
    })
    .option('d', {
      describe: 'Disable builders with names having regexp',
      type: 'string'
    })
    .option('e', {
      describe: 'Enable builders with names having regexp',
      type: 'string'
    })
    .option('n', {
      describe: 'Show builder names',
      default: false,
      type: 'boolean'
    })
    .option('verbose', {
      alias: 'v',
      default: false,
      describe: 'Show generated config',
      type: 'boolean'
    })
    .version(VERSION).argv;

  const cmd: string = argv._[0];
  let config;

  if (argv.help && !(cmd === 'exp' || cmd === 'expo')) {
    yargs.showHelp();
  } else {
    const cwd = process.cwd();
    if (['exp', 'expo', 'build', 'test', 'watch', 'start'].indexOf(cmd) >= 0) {
      config = createConfig(cwd, cmd, argv);
    }
    if (cluster.isMaster) {
      logger.info(`Version ${VERSION}`);
      if (argv.n) {
        logger.info('Builders:');
        const builderNames = Object.keys(config.builders)
          .map(key => (config.builders[key].enabled ? '+' : '-') + key)
          .sort();
        builderNames.forEach(key => logger.info('    ' + key));
      }
    }
    const enabledBuilders = Object.keys(config.builders)
      .filter(key => config.builders[key].enabled)
      .reduce((out, key) => {
        out[key] = config.builders[key];
        return out;
      }, {});

    if (Object.keys(enabledBuilders).length === 0) {
      throw new Error('No enabled spinjs builders found, exiting.');
    }
    execute(cmd, argv, enabledBuilders, config.spin);
  }
} catch (e) {
  logger.error(e);
}
