import * as fs from 'fs';
import * as path from 'path';

import { Builder } from '../../Builder';

interface ResolveResult {
  realPath: string;
  shouldTranspile: boolean;
}

const resolvePackagesCache: { [pkgPath: string]: ResolveResult } = {};
const resolveModulesCache: { [modulePath: string]: ResolveResult } = {};
const KNOWN_RN_PACKAGES = [/expo.*/, /@expo.*/, /react-navigation.*/, /react-native.*/];

export default (builder: Builder, modulePath: string): ResolveResult => {
  const idx = modulePath.lastIndexOf(path.sep + 'node_modules' + path.sep);
  if (idx >= 0) {
    if (resolveModulesCache[modulePath] === undefined) {
      const pkgPathStart = modulePath[idx + 14] !== '@' ? idx + 14 : modulePath.indexOf(path.sep, idx + 14) + 1;
      let pkgPathEnd = modulePath.indexOf(path.sep, pkgPathStart);
      if (pkgPathEnd < 0) {
        pkgPathEnd = modulePath.length;
      }
      const pkgPath = modulePath.substr(0, pkgPathEnd);
      if (resolvePackagesCache[pkgPath] === undefined) {
        const pkgName = pkgPath.substr(idx + 14);
        let shouldTranspile = KNOWN_RN_PACKAGES.some(regex => regex.test(pkgName));
        let resolvedPath = pkgPath;
        if (!shouldTranspile) {
          try {
            if (fs.lstatSync(pkgPath).isSymbolicLink()) {
              const realPath = fs.realpathSync(pkgPath);
              resolvedPath = realPath;
              shouldTranspile = realPath.indexOf(builder.projectRoot) === 0;
            }
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
        resolvePackagesCache[pkgPath] = {
          realPath: resolvedPath,
          shouldTranspile
        };
      }
      const resolvedPkg = resolvePackagesCache[pkgPath];
      resolveModulesCache[modulePath] = {
        realPath: path.join(resolvedPkg.realPath, modulePath.substr(pkgPathEnd + 1)),
        shouldTranspile: resolvedPkg.shouldTranspile
      };
    }
    // console.log(resolveModulesCache[modulePath]);
    return resolveModulesCache[modulePath];
  } else {
    // console.log({ realPath: modulePath, shouldTranspile: true });
    return { realPath: modulePath, shouldTranspile: true };
  }
};
