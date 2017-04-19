'use strict';

const manifestFactory = require('./manifest/manifest');
const config = require('config');
const _ = require('lodash');

module.exports = function schoenberg(semverishSource, configs, nameSpace) {
  let tmpConfig;
  if (!configs) {
    if (_.has(config, 'semverist')) {
      tmpConfig = config.get('semverist');
    }
    else {
      throw new Error('Must have a valid semverist config to use schoenberg composer.');
    }
  }
  else {
    tmpConfig = _.cloneDeep(configs);
  }

  return manifestFactory(
      'composer',
      nameSpace,
      tmpConfig
    )
    .then(ManifestClass => Promise.all(
      [
        ManifestClass.createConverter(semverishSource),
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
