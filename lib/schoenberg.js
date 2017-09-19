'use strict';

const manifestFactory = require('./manifest/manifest');
const _ = require('lodash');
const path = require('path');
const stack = require('callsite');

const getTraceIndex = function getTraceIndex(index) {
  if (index > 0) {
    return index - 1;
  }
  return 0;
};

const getResolvedPath = function getResolvedPath(value) {
  // Use callsite to resolve path from calling script.
  const base = require.resolve('../../../');
  const stackTrace = stack().reverse();
  let traceIndex = stackTrace.findIndex(
    trace => trace.getFileName() === base
  );
  traceIndex = getTraceIndex(traceIndex);
  return path.resolve(
    path.dirname(stackTrace[traceIndex].getFileName()),
    value
  );
};

module.exports = function schoenberg(semverishSource, configs, nameSpace) {
  let tmpConfig;
  let tmpSource;
  if (!configs) {
    throw new Error('Must have a valid semverist config to use schoenberg composer.');
  }
  else {
    tmpConfig = _.cloneDeep(configs);
  }

  if (!semverishSource) {
    tmpSource = getResolvedPath(tmpConfig[nameSpace].semverishObjectLocation);
  }
  else if (typeof semverishSource === 'string') {
    tmpSource = getResolvedPath(semverishSource);
  }
  else {
    tmpSource = semverishSource;
  }

  return manifestFactory(
      'composer',
      nameSpace,
      tmpConfig
    )
    .then(ManifestClass => Promise.all(
      [
        ManifestClass.createConverter(tmpSource),
        ManifestClass
      ]))
    .then((manifestIngredients) => {
      const ManifestClass = manifestIngredients[1];
      const converter = manifestIngredients[0][0];
      const converterClass = manifestIngredients[0][1];
      const composer = new ManifestClass(converter, converterClass);
      composer.init();
      return composer;
    });
};
