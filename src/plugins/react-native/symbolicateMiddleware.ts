/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * MIT License
 *
 * Copyright (c) 2017 Mike Grabowski, SysGears INC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @flow
 *
 * --- OVERVIEW ---
 *
 *   When running in dev mode, React Native handles source map lookups by
 *   asking the packager to do it.
 *
 *   It does a POST to /symbolicate and passes the call stack and expects
 *   back the same structure, but with the appropriate lines, columns & files.
 *
 *   This is the express middleware which will handle that endpoint by reading
 *   the source map that is tucked away inside webpack's in-memory filesystem.
 *
 */
import * as fetch from 'node-fetch';
import * as path from 'path';
import { SourceMapConsumer } from 'source-map';

/**
 * Creates a SourceMapConsumer so we can query it.
 */
async function createSourceMapConsumer(compiler: any, url: string, logger: any) {
  const response = await fetch(url);
  const sourceMap = await response.text();

  // we stop here if we couldn't find that map
  if (!sourceMap) {
    logger.warn('Unable to find source map.');
    return null;
  }

  // feed the raw source map into our consumer
  try {
    return new SourceMapConsumer(sourceMap);
  } catch (err) {
    logger.error('There was a problem reading the source map. :(');
    return null;
  }
}

/**
 * Gets the stack frames that React Native wants us to convert.
 */
function getRequestedFrames(req) {
  if (typeof req.rawBody !== 'string') {
    return null;
  }

  let stack;

  try {
    const payload = JSON.parse(req.rawBody);
    stack = payload.stack;
  } catch (err) {
    // should happen, but at least we won't die
    stack = null;
  }

  if (!stack) {
    return null;
  }

  const newStack = stack.filter(stackLine => {
    const { methodName } = stackLine;
    const unwantedStackRegExp = new RegExp(/(__webpack_require__|haul|eval(JS){0,1})/);

    if (unwantedStackRegExp.test(methodName)) {
      return false;
    } // we don't need those

    const evalLine = methodName.indexOf('Object../');
    if (evalLine > -1) {
      const newMethodName = methodName.slice(evalLine + 9); // removing this prefix in method names
      stackLine.methodName = newMethodName; // eslint-disable-line
    }
    return true;
  });

  return newStack;
}

/**
 * Create an Express middleware for handling React Native symbolication requests
 */
export default function create(compiler, logger) {
  /**
   * The Express middleware for symbolicating'.
   */
  async function symbolicateMiddleware(req, res, next) {
    if (req.path !== '/symbolicate') {
      return next();
    }

    // grab the source stack frames
    const unconvertedFrames = getRequestedFrames(req);
    if (!unconvertedFrames || unconvertedFrames.length === 0) {
      return next();
    }

    // grab the platform and filename from the first frame (e.g. index.ios.bundle?platform=ios&dev=true&minify=false:69825:16)
    const filenameMatch = unconvertedFrames[0].file.match(/\/(\D+)\?/);
    const platformMatch = unconvertedFrames[0].file.match(/platform=([a-zA-Z]*)/);

    const filename: string = filenameMatch && filenameMatch[1];
    const platform = platformMatch && platformMatch[1];

    if (!filename || !platform) {
      return next();
    }

    const [name, ...rest] = filename.split('.');
    const bundleName = `${name}.mobile.${rest[rest.length - 1]}`;

    // grab our source map consumer
    const consumer = await createSourceMapConsumer(
      compiler,
      `http://localhost:${req.headers.host.split(':')[1]}/${bundleName}.map`,
      logger
    );
    // console.log('C', consumer);
    if (!consumer) {
      return next();
    }

    // the base directory
    const root = compiler.options.context;

    // error error on the wall, who's the fairest stack of all?
    const convertedFrames = unconvertedFrames.map(originalFrame => {
      // find the original home of this line of code.
      const lookup = consumer.originalPositionFor({
        line: originalFrame.lineNumber,
        column: originalFrame.column
      });

      // If lookup fails, we get the same shape object, but with
      // all values set to null
      if (lookup.source == null) {
        // It is better to gracefully return the original frame
        // than to throw an exception
        return originalFrame;
      }

      // convert the original source into an absolute path
      const mappedFile = lookup.source
        .replace('webpack:///~', path.resolve(root, 'node_modules'))
        .replace('webpack://', root);

      // convert these to a format which React Native wants
      return {
        lineNumber: lookup.line,
        column: lookup.column,
        file: mappedFile,
        methodName: originalFrame.methodName
      };
    });

    // send it back to React Native
    const responseObject = {
      stack: convertedFrames
    };
    const response = JSON.stringify(responseObject);
    res.end(response);

    return null;
  }

  return symbolicateMiddleware;
}
