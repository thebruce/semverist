

const manifestFactory = require('../../../../lib/manifest/manifest');
const nestedConfig = require('../../../__helpers__/nestedConfig.json');
const semveristObject = require('../../../__helpers__/semverishObject');
const path = require('path');
const processedLazySemverist = require('../../../__helpers__/processedCompositionLazySemverist');

const semverishPath = '__tests__/__helpers__/semverishObject';
let tmpMocks = [];

describe('Composer Lazy Semverist Super test', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Lazy semverist manifest.', () => {
    expect.assertions(1);
    const confer = Object.assign({}, nestedConfig.semverist);
    confer.lazySemveristOrchestraObject.callPath = path.join(__dirname, './../../../../');
    return manifestFactory(
      'composer',
      'lazySemveristOrchestraObject',
      confer
    )
      .then(ManifestClass => Promise.all(
        [
          ManifestClass.createConverter(semveristObject),
          ManifestClass,
        ]))
      .then((manifestIngredients) => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
        schoenberg.assembleManifest();
        return schoenberg.getComposition();
      })
      .then(obj => expect(obj).toEqual(processedLazySemverist));
  });

  test('Lazy semverist directory manifest.', () => {
    expect.assertions(1);
    const confer = Object.assign({}, nestedConfig.semverist);
    confer.lazySemveristOrchestraDirectory.callPath = path.join(__dirname, './../../../../');
    return manifestFactory(
      'composer',
      'lazySemveristOrchestraDirectory',
      confer
    )
      .then(ManifestClass => Promise.all(
        [
          ManifestClass.createConverter(semverishPath),
          ManifestClass,
        ]))
      .then((manifestIngredients) => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
        schoenberg.assembleManifest();
        return schoenberg.getComposition();
      })
      .then(obj => expect(obj).toEqual(processedLazySemverist));
  });
});
