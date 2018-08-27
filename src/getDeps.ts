import * as fs from 'fs';
import { RequireFunction } from './createRequire';

export interface Dependencies {
  [x: string]: string;
}

const getDeps = (packageJsonPath: string, requireDep: RequireFunction, deps: Dependencies): Dependencies => {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const pkgDeps: any = Object.keys(pkg.dependencies || {});
  let result = { ...deps };
  for (const dep of pkgDeps) {
    if (!dep.startsWith('.') && !result[dep]) {
      let depPkg;
      try {
        depPkg = requireDep.resolve(dep + '/package.json');
      } catch (e) {}
      if (depPkg) {
        result[dep] = depPkg;
        const subDeps = getDeps(depPkg, requireDep, result);
        result = { ...result, ...subDeps };
      }
    }
  }
  return result;
};

export default getDeps;
