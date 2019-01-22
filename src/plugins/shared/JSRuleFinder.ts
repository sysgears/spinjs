import * as fs from 'fs';
import * as path from 'path';
import { Builder } from '../../Builder';

const transpiledPackages = {};
const transpiledModules = {};
const KNOWN_RN_PACKAGES = [/expo.*/, /@expo.*/, /react-navigation.*/, /react-native.*/];

export const excludeNonProjectModules = (builder: Builder) => modulePath => {
  const idx = modulePath.lastIndexOf(path.sep + 'node_modules' + path.sep);
  if (idx >= 0) {
    if (transpiledModules[modulePath] === undefined) {
      const pkgPathStart = modulePath[idx + 14] !== '@' ? idx + 14 : modulePath.indexOf(path.sep, idx + 14) + 1;
      let pkgPathEnd = modulePath.indexOf(path.sep, pkgPathStart);
      if (pkgPathEnd < 0) {
        pkgPathEnd = modulePath.length;
      }
      const pkgPath = modulePath.substr(0, pkgPathEnd);
      if (transpiledPackages[pkgPath] === undefined) {
        const pkgName = pkgPath.substr(idx + 14);
        let shouldTranspile = KNOWN_RN_PACKAGES.some(regex => regex.test(pkgName));
        if (!shouldTranspile) {
          try {
            shouldTranspile =
              fs.lstatSync(pkgPath).isSymbolicLink() && fs.realpathSync(pkgPath).indexOf(builder.projectRoot) === 0;
          } catch (e) {}
        }
        if (!shouldTranspile) {
          let entryFileText;
          try {
            entryFileText = fs.readFileSync(builder.require.resolve(pkgName), 'utf8');
          } catch (e) {}
          shouldTranspile =
            !entryFileText || entryFileText.indexOf('__esModule') >= 0
              ? false
              : /^(export|import)[\s]/m.test(entryFileText);
        }
        transpiledPackages[pkgPath] = shouldTranspile;
      }
      transpiledModules[modulePath] = transpiledPackages[pkgPath];
    }
    return !transpiledModules[modulePath];
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
    this.jsRule = { test: /\.js$/, exclude: excludeNonProjectModules(this.builder) };
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
    this.tsRule = { test: /\.ts$/, exclude: excludeNonProjectModules(this.builder) };
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
