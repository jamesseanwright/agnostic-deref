import fs from 'fs';
import path from 'path';
import clone from 'clone';
import { getRefFilePath } from '../utils';

var cwd = process.cwd();

/**
 * Resolves a file link of a json schema to the actual value it references
 * @param refValue the value. String. Ex. `/some/path/schema.json#/definitions/foo`
 * @param options
 *              baseFolder - the base folder to get relative path files from. Default is `process.cwd()`
 * @returns {*}
 * @private
 */
export default function (refValue, options) {
  let refPath = refValue;
  const baseFolder = options.baseFolder ? path.resolve(cwd, options.baseFolder) : cwd;

  if (refPath.indexOf('file:') === 0) {
    refPath = refPath.substring(5);
  } else {
    refPath = path.resolve(baseFolder, refPath);
  }

  const filePath = getRefFilePath(refPath);

  let newValue;
  try {
    var data = fs.readFileSync(filePath);
    newValue = options.parser ? options.parser(data) : JSON.parse(data);
  } catch (e) {}

  return newValue;
};
