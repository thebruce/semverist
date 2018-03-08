'use strict';

const manifestFactory = require('../../../../lib/manifest/manifest');
const nestedConfig = require('../../../__helpers__/nestedConfig.json');
const semveristObject = require('../../../__helpers__/semverishObject');
const path = require('path');
const processedComposition = require('../../../__helpers__/processedComposition');

const semverishPath = '__tests__/__helpers__/semverishObject';
let tmpMocks = [];
let manifestStarter;
describe('Composer tests', () => {
  beforeEach(() => {
    manifestStarter = manifestFactory(
        'composer',
        'semverImpliedOrchestraObject',
        nestedConfig.semverist
      )
      .then(ManifestClass => Promise.all(
        [
          ManifestClass.createConverter(semveristObject),
          ManifestClass
        ]));
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('manifestDefaultClasses', () => {
    expect.assertions(1);
    return manifestFactory(
          'composer',
          'useLazySemverist',
          nestedConfig.semverist
        )
        .then((ManifestClass) => {
          const schoenberg = new ManifestClass();
          schoenberg.setManifestCapabilities();
          return schoenberg.getManifestCapabilities();
        })
        .then(obj => obj.sort())
        .then(obj => expect(obj).toEqual([
          'attribute',
          'default',
          'group'
        ]));
  });

  test('Composer get and set composition tests.', () => {
    expect.assertions(1);
    return manifestStarter
        .then((manifestIngredients) => {
          const ManifestClass = manifestIngredients[1];
          const converter = manifestIngredients[0][0];
          const converterClass = manifestIngredients[0][1];
          const schoenberg = new ManifestClass(converter, converterClass);
          schoenberg.init();
          schoenberg.setComposition({
            test: 'test'
          });
          return schoenberg.getComposition();
        })
        .then(obj => expect(obj).toEqual({
          test: 'test'
        }));
  });

  test('Manifest get composition destination.', () => {
    expect.assertions(1);
    return manifestStarter
        .then((manifestIngredients) => {
          const ManifestClass = manifestIngredients[1];
          const converter = manifestIngredients[0][0];
          const converterClass = manifestIngredients[0][1];
          const schoenberg = new ManifestClass(converter, converterClass);
          schoenberg.init();
          schoenberg.setComposition({
            test: 'test'
          });
          return schoenberg.getCompositionDestination();
        })
        .then(obj => expect(obj).toBeNull());
  });

  test('Composer directory no destination error.', () => {
    expect.assertions(1);
    const tempConfig = Object.assign({}, nestedConfig.semverist);
    tempConfig.semverImpliedOrchestraDirectoryBroken.callPath = path.join(__dirname, './../../../../');
    return manifestFactory(
        'composer',
        'semverImpliedOrchestraDirectoryBroken',
        tempConfig
      )
      .then(ManifestClass => Promise.all([
        ManifestClass.createConverter(semverishPath),
        ManifestClass
      ]))
      .then((manifestIngredients) => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
      })
      .catch((e) => {
        expect(e.message)
          .toEqual(
            'If the composition type is directory there must be a destination path'
          );
      });
  });

  test('strategizeComposition.', () => {
    expect.assertions(1);
    return manifestStarter
        .then((manifestIngredients) => {
          const ManifestClass = manifestIngredients[1];
          const converter = manifestIngredients[0][0];
          const converterClass = manifestIngredients[0][1];
          const schoenberg = new ManifestClass(converter, converterClass);
          schoenberg.init();
          const draft = {
            1: {
              1: {
                1: {}
              }
            }
          };
          return schoenberg.strategizeComposition('clarinet', '1.1.1', draft);
        })
        .then(obj => expect(obj).toEqual({
          1: {
            1: {
              1: {
                clarinet: {
                  fromClarinet: 'this is from 1.1.1',
                  fromDefault: 'this is from 1',
                  fromWinds: 'this is from 1',
                  toItem: 'clarinet',
                },
              },
            },
          }
        }));
  });

  test('prioritize component', () => {
    expect.assertions(1);
    return manifestStarter
        .then((manifestIngredients) => {
          const ManifestClass = manifestIngredients[1];
          const converter = manifestIngredients[0][0];
          const converterClass = manifestIngredients[0][1];
          const schoenberg = new ManifestClass(converter, converterClass);
          schoenberg.init();
          const semveristArray = [
            'clarinet',
            '1.1.1'
          ];
          schoenberg.prioritizeComponent(semveristArray);
          return schoenberg.getManifestComponents().clarinet['1.1.1'].components;
        })
        .then(obj => expect(obj).toEqual([
          '1.orchestraDefault',
          '1.winds',
          '1.1.1.clarinet'
        ]));
  });

  test('prioritize component no groups', () => {
    expect.assertions(1);
    return manifestFactory(
          'composer',
          'semverImpliedOrchestraObjectNoGroups',
          nestedConfig.semverist
        )
        .then(ManifestClass => Promise.all(
          [
            ManifestClass.createConverter(semveristObject),
            ManifestClass
          ]))
        .then((manifestIngredients) => {
          const ManifestClass = manifestIngredients[1];
          const converter = manifestIngredients[0][0];
          const converterClass = manifestIngredients[0][1];
          const schoenberg = new ManifestClass(converter, converterClass);
          schoenberg.init();
          const semveristArray = [
            'clarinet',
            '1.1.1'
          ];
          schoenberg.prioritizeComponent(semveristArray);
          return schoenberg.getManifestComponents().clarinet['1.1.1'].components;
        })
        .then(obj => expect(obj).toEqual([
          '1.orchestraDefault',
          '1.1.1.clarinet'
        ]));
  });

  test('prioritize component no defaults', () => {
    expect.assertions(1);
    return manifestFactory(
          'composer',
          'semverImpliedOrchestraObjectNoDefaults',
          nestedConfig.semverist
        )
        .then(ManifestClass => Promise.all(
          [
            ManifestClass.createConverter(semveristObject),
            ManifestClass
          ]))
        .then((manifestIngredients) => {
          const ManifestClass = manifestIngredients[1];
          const converter = manifestIngredients[0][0];
          const converterClass = manifestIngredients[0][1];
          const schoenberg = new ManifestClass(converter, converterClass);
          schoenberg.init();
          const semveristArray = [
            'clarinet',
            '1.1.1'
          ];
          schoenberg.prioritizeComponent(semveristArray);
          return schoenberg.getManifestComponents().clarinet['1.1.1'].components;
        })
        .then(obj => expect(obj).toEqual([
          '1.winds',
          '1.1.1.clarinet'
        ]));
  });

  test('write composition.', () => {
    expect.assertions(1);
    return manifestStarter
        .then((manifestIngredients) => {
          const ManifestClass = manifestIngredients[1];
          const converter = manifestIngredients[0][0];
          const converterClass = manifestIngredients[0][1];
          const schoenberg = new ManifestClass(converter, converterClass);
          schoenberg.init();
          schoenberg.writeComposition();
          return schoenberg.getComposition();
        })
        .then(obj => expect(obj).toEqual(processedComposition));
  });

  test('assemble manifest.', () => {
    expect.assertions(1);
    return manifestStarter
        .then((manifestIngredients) => {
          const ManifestClass = manifestIngredients[1];
          const converter = manifestIngredients[0][0];
          const converterClass = manifestIngredients[0][1];
          const schoenberg = new ManifestClass(converter, converterClass);
          schoenberg.init();
          schoenberg.assembleManifest();
          return schoenberg.getComposition();
        })
        .then(obj => expect(obj).toEqual(processedComposition));
  });
});
