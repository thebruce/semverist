'use strict';

const manifestFactory = require('./manifest/manifest');
const _ = require('lodash');

const molotovDefaults = {
  overrides: {},
  cocktailClasses: [],
};

module.exports = function schoenberg(semverishSource, configs, nameSpace, molotovConfig = molotovDefaults) { // eslint-disable-line max-len
  let tmpConfig;
  let tmpSource;
  if (!configs) {
    throw new Error('Must have a valid semverist config to use schoenberg composer.');
  }
  else {
    tmpConfig = _.cloneDeep(configs);
  }

  if (!semverishSource) {
    tmpSource = tmpConfig[nameSpace].semverishObjectLocation;
  }
  else if (typeof semverishSource === 'string') {
    tmpSource = semverishSource;
  }
  else {
    tmpSource = semverishSource;
  }

  return manifestFactory(
      'composer',
      nameSpace,
      tmpConfig,
      molotovConfig
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
