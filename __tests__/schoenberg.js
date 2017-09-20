'use strict';

const schoenberg = require('../lib/schoenberg');
const nestedConfig = require('./helpers/nestedConfig.json');
const semverishObject = require('./helpers/semverishObject');
const processedComposition = require('./helpers/processedComposition');

test('Schoenberg.', () => {
  expect(schoenberg(
    semverishObject,
    nestedConfig.semverist,
    'semverImpliedOrchestraObject')
  .then((composer) => {
    composer.assembleManifest();
    return composer.getComposition();
  })
  .then(obj => obj))
  .resolves.toEqual(processedComposition);
});

test('Schoenberg throws', () => {  // eslint-disable-line
  expect(() => {
    schoenberg(
      semverishObject,
      null,
      'semverImpliedOrchestraObject'
    );
  }).toThrowError('Must have a valid semverist config to use schoenberg composer.');
});
