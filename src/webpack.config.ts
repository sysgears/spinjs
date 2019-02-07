// TODO: remove in 0.5.x
import createBuilders from './createBuilders';

const builders = createBuilders({
  cwd: process.env.SPIN_CWD || process.cwd(),
  cmd: 'test',
  argv: { c: process.env.SPIN_CONFIG }
}).builders;
const testConfig = builders[Object.keys(builders)[0]].config;

// console.log("test config:", require('util').inspect(testConfig, false, null));
export default testConfig;
