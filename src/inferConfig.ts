import * as fs from 'fs';
import * as path from 'path';
import createRequire from './createRequire';
import getDeps from './getDeps';
import upDirs from './upDirs';

const entryExts = ['js', 'jsx', 'ts', 'tsx'];
const entryDirs = ['.', 'src'];
let entryCandidates = [];
for (const dir of entryDirs) {
  entryCandidates = entryCandidates.concat(entryExts.map(ext => './' + path.join(dir, 'index.' + ext)));
}

const isSpinApp = (pkg: any): boolean => {
  return (
    Object.keys(pkg.dependencies || {})
      .concat(Object.keys(pkg.devDependencies || {}))
      .indexOf('spinjs') >= 0 ||
    (pkg.scripts && pkg.scripts.build && pkg.scripts.build.indexOf('spin build') >= 0)
  );
};

export default (pkgJsonPath: string): object => {
  if (!pkgJsonPath || !fs.existsSync(pkgJsonPath)) {
    return {};
  }
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  if (!isSpinApp(pkg)) {
    return {};
  }
  const pkgPathList = upDirs(path.dirname(pkgJsonPath), 'package.json');
  let deps: any = {};
  for (const pkgPath of pkgPathList) {
    if (fs.existsSync(pkgPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const requireDep = createRequire(path.dirname(pkgPath));
      deps = { ...deps, ...getDeps(pkgPath, requireDep, {}), ...(pkgJson.devDependencies || {}) };
    }
  }

  let entry;
  for (const entryPath of entryCandidates) {
    if (fs.existsSync(path.join(path.dirname(pkgJsonPath), entryPath))) {
      entry = entryPath;
      break;
    }
  }
  if (!entry) {
    throw new Error('Cannot find entry file, tried: ' + entryCandidates);
  }

  const stack = [];
  if (deps['apollo-server-express'] || deps.express) {
    stack.push('server');
  }
  if (deps['react-native']) {
    stack.push('android');
  } else if (deps['react-dom']) {
    stack.push('web');
  }
  if (deps['babel-core'] || deps['@babel/core']) {
    stack.push('es6');
  }
  stack.push('js');
  if (deps.typescript) {
    stack.push('ts');
  }
  if (deps['apollo-server-express'] || deps['react-apollo'] || deps['apollo-boost'] || deps['apollo-link']) {
    stack.push('apollo');
  }
  if (deps.react) {
    stack.push('react');
  }
  if (deps['react-native']) {
    stack.push('react-native');
  }
  if (deps['styled-components']) {
    stack.push('styled-components');
  }
  if (deps['css-loader']) {
    stack.push('css');
  }
  if (deps['sass-loader']) {
    stack.push('sass');
  }
  if (deps['less-loader']) {
    stack.push('less');
  }
  if (deps.webpack) {
    stack.push('webpack');
  }

  let config;
  const builderDefaults = {
    entry,
    silent: true,
    nodeDebugger: false,
    derived: true
  };
  if (stack.indexOf('react-native') >= 0) {
    const builderAndroid = {
      stack,
      ...builderDefaults
    };

    const iosStack = [...stack];
    iosStack[stack.indexOf('android')] = 'ios';
    const builderIOS = {
      stack: iosStack,
      ...builderDefaults
    };

    config = {
      builders: {
        [pkg.name + '-android']: builderAndroid,
        [pkg.name + '-ios']: builderIOS
      },
      options: {
        defines: {
          __DEV__: process.env.NODE_ENV !== 'production'
        }
      }
    };
  } else {
    const builder = {
      stack,
      ...builderDefaults
    };

    config = {
      builders: {
        [pkg.name]: builder
      }
    };
  }

  return config;
};
