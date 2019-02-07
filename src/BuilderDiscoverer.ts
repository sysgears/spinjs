import * as fs from 'fs';
import { glob } from 'glob';
import * as _ from 'lodash';
import * as path from 'path';

import { Builders } from './Builder';
import { ConfigPlugin } from './ConfigPlugin';
import ConfigReader from './ConfigReader';
import Spin from './Spin';

export default class BuilderDiscoverer {
  private configReader: ConfigReader;
  private cwd: string;
  private argv: any;

  constructor(spin: Spin, plugins: ConfigPlugin[], argv: any) {
    this.configReader = new ConfigReader(spin, plugins);
    this.cwd = spin.cwd;
    this.argv = argv;
  }

  public discover(builderOverrides: any): Builders {
    const packageRootPaths = this._detectRootPaths();
    return packageRootPaths.reduce((res: any, pathName: string) => {
      return { ...res, ...this._discoverRecursively(pathName, builderOverrides) };
    }, {});
  }

  private _discoverRecursively(dir: string, builderOverrides: any): Builders {
    if (path.basename(dir) === '.expo') {
      return undefined;
    }

    let builders = this.configReader.readConfig({
      filePath: this.argv.c ? path.join(dir, this.argv.c) : dir,
      builderOverrides
    });

    const files = fs.readdirSync(dir);
    for (const name of files) {
      const dirPath = path.join(dir, name);
      if (name !== 'node_modules' && fs.statSync(dirPath).isDirectory()) {
        builders = { ...builders, ...this._discoverRecursively(dirPath, builderOverrides) };
      }
    }

    return builders;
  }

  private _detectRootPaths(): string[] {
    const rootConfig = JSON.parse(fs.readFileSync(`${this.cwd}/package.json`, 'utf8'));
    return rootConfig.workspaces && rootConfig.workspaces.length
      ? _.flatten(rootConfig.workspaces.map((ws: string) => glob.sync(ws))).map((ws: string) => path.join(this.cwd, ws))
      : [this.cwd];
  }
}
