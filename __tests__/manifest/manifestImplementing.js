'use strict';

const path = require('path');

const manifestFactory = require('../../lib/manifest/manifest');
const nestedConfig = require('../helpers/nestedConfig.json');
const semveristObject = require('../helpers/semverishObject');
const digestedHelper = require('../helpers/semverImpliedProcessed.json');
const manifestSemverImpliedProcessed = require('../helpers/manifestSemverImpliedProcessed');
const semverUtils = require('semver-utils');

const semverishPath = path.join(
  __dirname,
  '../../',
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
  test('manifestNoPluginName still has capabilities', () => {
    expect(manifestFactory(null, 'useLazySemverist', nestedConfig.semverist)
      .then((ManifestClass) => {
        const schoenberg = new ManifestClass();
        schoenberg.setManifestCapabilities();
        return schoenberg.getManifestCapabilities();
      })
      .then(obj => obj.sort()))
      .resolves.toEqual([
        'attribute',
        'default',
        'group'
      ]);
  });

  test('manifestNoPluginName No Defaults', () => {
    expect(manifestFactory(null, 'semverImpliedNoDefaults', nestedConfig.semverist)
      .then((ManifestClass) => {
        const schoenberg = new ManifestClass();
        schoenberg.setManifestCapabilities();
        return schoenberg.getManifestCapabilities();
      })
      .then(obj => obj.sort()))
      .resolves.toEqual([
        'attribute',
        'group'
      ]);
  });

  test('manifestNoPluginName No Groups', () => {
    expect(manifestFactory(null, 'semverImpliedNoGroups', nestedConfig.semverist)
      .then((ManifestClass) => {
        const schoenberg = new ManifestClass();
        schoenberg.setManifestCapabilities();
        return schoenberg.getManifestCapabilities();
      })
      .then(obj => obj.sort()))
      .resolves.toEqual([
        'attribute',
        'default'
      ]);
  });

  test('manifestNoPluginName No Defaults No Groups', () => {
    expect(manifestFactory(
        null,
        'semverImpliedNoDefaultsNoGroups',
        nestedConfig.semverist
      )
      .then((ManifestClass) => {
        const schoenberg = new ManifestClass();
        schoenberg.setManifestCapabilities();
        return schoenberg.getManifestCapabilities();
      })
      .then(obj => obj.sort()))
      .resolves.toEqual([
        'attribute'
      ]);
  });

  test('manifestNoPluginName default config still has capabilities', () => {
    expect(manifestFactory()
      .then((ManifestClass) => {
        const schoenberg = new ManifestClass();
        schoenberg.setManifestCapabilities();
        return schoenberg.getManifestCapabilities();
      })
      .then(obj => obj.sort()))
      .resolves.toEqual([
        'attribute',
        'default',
        'group'
      ]);
  });

  test('Converter static object.', () => {
    expect(manifestFactory(
        null,
        'semverImpliedOrchestraObject',
        nestedConfig.semverist
      )
      .then(ManifestClass => ManifestClass.createConverter(semveristObject))
      .then(obj => obj[0]))
      .resolves.toEqual(digestedHelper);
  });

  test('Converter static object to manifest converter.', () => {
    expect(manifestFactory(
        null,
        'semverImpliedOrchestraObject',
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
        return schoenberg.getConverter();
      })
      .then(obj => obj))
      .resolves.toEqual(digestedHelper);
  });

  test('Directory Converter static object to manifest converter.', () => {
    expect(manifestFactory(
        null,
        'semverImpliedOrchestraDirectory',
        nestedConfig.semverist
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
        return schoenberg.getConverter();
      })
      .then(obj => obj))
      .resolves.toEqual(digestedHelper);
  });

  test('Manifest component Defaults.', () => {
    expect(manifestFactory(
        null,
        'semverImpliedOrchestraObject',
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
        return schoenberg.getManifestComponents();
      })
      .then(obj => obj.clarinet['1.1.1'].components.indexOf('1.orchestraDefault')))
      .resolves.not.toBe(-1);
  });

  test('Manifest component Groups.', () => {
    expect(manifestFactory(
        null,
        'semverImpliedOrchestraObject',
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
        return schoenberg.getManifestComponents();
      })
      .then(obj => obj.clarinet['1.1.1'].components.indexOf('1.winds')))
      .resolves.not.toBe(-1);
  });

  test('Manifest component no Groups.', () => {
    expect(manifestFactory(
        null,
        'semverImpliedNoDefaultsNoGroups',
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
        return schoenberg.getManifestComponents();
      })
      .then(obj => obj.clarinet['1.1.1'].components.indexOf('1.winds')))
      .resolves.toBe(-1);
  });

  test('Manifest component no Defaults.', () => {
    expect(manifestFactory(
        null,
        'semverImpliedNoDefaultsNoGroups',
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
        return schoenberg.getManifestComponents();
      })
      .then(obj => obj.clarinet['1.1.1'].components.indexOf('1.orchestraDefault')))
      .resolves.toBe(-1);
  });

  test('Manifest component attributes.', () => {
    expect(manifestFactory(
        null,
        'semverImpliedOrchestraObject',
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
        return schoenberg.getManifestComponents();
      })
      .then(obj => obj))
      .resolves.toEqual(manifestSemverImpliedProcessed);
  });

  test('Manifest converter class.', () => {
    expect(manifestFactory(
        null,
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
        return schoenberg.getConverterClass().getSemverishObject();
      })
      .then(obj => obj))
      .resolves.toEqual(semveristObject);
  });

  test('pathBuildImprovement.', () => {
    expect(manifestFactory(
        'composer',
        'semverImpliedOrchestraObject',
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
        const parsedPath = semverUtils.parse('1.1.1-alpha+124');
        return ManifestClass.pathBuildImprovement(parsedPath);
      })
      .then(obj => obj))
      .resolves.toEqual('1.1.1-alpha.124');
  });

  test('pathBuildImprovement no build.', () => {
    expect(manifestFactory(
        'composer',
        'semverImpliedOrchestraObject',
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
        const parsedPath = semverUtils.parse('1.1.1-alpha.1');
        return ManifestClass.pathBuildImprovement(parsedPath);
      })
      .then(obj => obj))
      .resolves.toEqual('1.1.1-alpha.1');
  });

  test('create semver hierarchy.', () => {
    expect(manifestFactory(
        'composer',
        'semverImpliedOrchestraObject',
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
        return schoenberg.createSemverHierarchy({});
      })
      .then(obj => obj))
      .resolves.toEqual({
        1: {
          0: {
            0: {},
            1: {},
            2: {}
          },
          1: {
            0: {},
            1: {},
          },
          2: {
            0: {},
          },
          3: {
            0: {},
          },
        },
        2: {
          0: {
            0: {},
            '0-alpha': {
              0: {},
              1: {},
            },
            '0-beta': {
              0: {},
            },
            1: {},
          }
        }
      }
    );
  });
});
