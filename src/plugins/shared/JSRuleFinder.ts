import * as fs from 'fs';
import * as path from 'path';
import { Builder } from '../../Builder';

const projectPackages = {};
const projectModules = {};

export const excludeNonProjectModules = (projectRoot: string, includeNodeModulesRegexp?: RegExp) => modulePath => {
  const idx = modulePath.indexOf(path.sep + 'node_modules' + path.sep);
  if (idx >= 0) {
    if (includeNodeModulesRegexp && includeNodeModulesRegexp.test(modulePath)) {
      return false;
    }
    if (projectModules[modulePath] === undefined) {
      const pkgPathStart = modulePath[idx + 14] !== '@' ? idx + 14 : modulePath.indexOf(path.sep, idx + 14) + 1;
      let pkgPathEnd = modulePath.indexOf(path.sep, pkgPathStart);
      if (pkgPathEnd < 0) {
        pkgPathEnd = modulePath.length;
      }
      const pkgPath = modulePath.substr(0, pkgPathEnd);
      if (projectPackages[pkgPath] === undefined) {
        try {
          projectPackages[pkgPath] =
            fs.lstatSync(pkgPath).isSymbolicLink() && fs.realpathSync(pkgPath).indexOf(projectRoot) === 0;
        } catch (e) {
          projectPackages[pkgPath] = false;
        }
      }
      projectModules[modulePath] = projectPackages[pkgPath];
    }
    return !projectModules[modulePath];
  } else {
    return false;
  }
};

export default class JSRuleFinder {
  public builder: Builder;

  public jsRule: any;
  public tsRule: any;

  constructor(builder: Builder) {
    this.builder = builder;
  }

  public findJSRule(): any {
    if (!this.jsRule) {
      const jsCandidates = ['\\.js$/', '\\.jsx?$/'];

      for (const rule of this.builder.config.module.rules) {
        for (const candidate of jsCandidates) {
          if (String(rule.test).indexOf(candidate) >= 0) {
            this.jsRule = rule;
            break;
          }
        }
      }
    }

    return this.jsRule;
  }

  public createJSRule() {
    if (this.jsRule) {
      throw new Error('js rule already exists!');
    }
    this.jsRule = { test: /\.js$/, exclude: excludeNonProjectModules(this.builder.projectRoot) };
    this.builder.config.module.rules = this.builder.config.module.rules.concat(this.jsRule);
    return this.jsRule;
  }

  public findAndCreateJSRule(): any {
    return this.findJSRule() || this.createJSRule();
  }

  public findTSRule(): any {
    if (!this.tsRule) {
      const jsCandidates = ['\\.ts$/', '\\.tsx?$/'];

      for (const rule of this.builder.config.module.rules) {
        for (const candidate of jsCandidates) {
          if (String(rule.test).indexOf(candidate) >= 0) {
            this.tsRule = rule;
            break;
          }
        }
      }
    }

    return this.tsRule;
  }

  public createTSRule() {
    if (this.tsRule) {
      throw new Error('ts rule already exists!');
    }
    this.tsRule = { test: /\.ts$/, exclude: excludeNonProjectModules(this.builder.projectRoot) };
    this.builder.config.module.rules = this.builder.config.module.rules.concat(this.tsRule);
    return this.tsRule;
  }

  public findAndCreateTSRule(): any {
    return this.findTSRule() || this.createTSRule();
  }

  get extensions(): string[] {
    const result = [];

    this.findJSRule();
    this.findTSRule();
    const jsTestStr = String(this.jsRule ? this.jsRule.test : 'js');
    const tsTestStr = String(this.tsRule ? this.tsRule.test : '');

    if (tsTestStr.indexOf('tsx') >= 0) {
      result.push('tsx');
    }
    if (jsTestStr.indexOf('jsx') >= 0) {
      result.push('jsx');
    }
    if (tsTestStr.indexOf('ts') >= 0) {
      result.push('ts');
    }
    if (jsTestStr.indexOf('js') >= 0) {
      result.push('mjs');
      result.push('js');
    }
    return result;
  }
}
