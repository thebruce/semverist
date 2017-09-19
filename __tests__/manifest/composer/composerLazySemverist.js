'use strict';

const manifestFactory = require('../../../lib/manifest/manifest');
const nestedConfig = require('../../helpers/nestedConfig.json');
const semveristObject = require('../../helpers/semverishObject');
const path = require('path');
const processedLazySemverist = require('../../helpers/processedCompositionLazySemverist');

const semverishPath = path.join(
   __dirname,
  '../../../',
  '__tests__/helpers/semverishObject'
);
let tmpMocks = [];

beforeEach(() => {
  tmpMocks.forEach(mock => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Source Converter Super test', () => {
  test('Lazy semverist manifest.', () => {
    expect(manifestFactory(
      'composer',
      'lazySemveristOrchestraObject',
      nestedConfig.semverist
    )
    .then(ManifestClass => Promise.all(
      [
        ManifestClass.createConverter(semveristObject),
        ManifestClass
      ])
    )
    .then((manifestIngredients) => {
      const ManifestClass = manifestIngredients[1];
      const converter = manifestIngredients[0][0];
      const converterClass = manifestIngredients[0][1];
      const schoenberg = new ManifestClass(converter, converterClass);
      schoenberg.init();
      schoenberg.assembleManifest();
      return schoenberg.getComposition();
    })
    .then(obj => obj))
    .resolves.toEqual(processedLazySemverist);
  });

  test('Lazy semverist directory manifest.', () => {
    expect(manifestFactory(
      'composer',
      'lazySemveristOrchestraDirectory',
      nestedConfig.semverist
    )
    .then(ManifestClass => Promise.all(
      [
        ManifestClass.createConverter(semverishPath),
        ManifestClass
      ])
    )
    .then((manifestIngredients) => {
      const ManifestClass = manifestIngredients[1];
      const converter = manifestIngredients[0][0];
      const converterClass = manifestIngredients[0][1];
      const schoenberg = new ManifestClass(converter, converterClass);
      schoenberg.init();
      schoenberg.assembleManifest();
      return schoenberg.getComposition();
    })
    .then(obj => obj))
    .resolves.toEqual(processedLazySemverist);
  });
});
