const path = require('path');

const manifestFactory = require('../../../lib/manifest/manifest');
const nestedConfig = require('../../__helpers__/nestedConfig.json');
const semveristObject = require('../../__helpers__/semverishObject');
const digestedHelper = require('../../__helpers__/semverImpliedProcessed.json');
const manifestSemverImpliedProcessed = require('../../__helpers__/manifestSemverImpliedProcessed');
const semverUtils = require('semver-utils');

const semverishPath = '__tests__/__helpers__/semverishObject';

let tmpMocks = [];

describe('Manifest Implementing tests', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('manifestNoPluginName still has capabilities', () => {
    expect.assertions(1);
    return manifestFactory(null, 'useLazySemverist', nestedConfig.semverist)
      .then(ManifestClass => {
        const schoenberg = new ManifestClass();
        schoenberg.setManifestCapabilities();
        return schoenberg.getManifestCapabilities();
      })
      .then(obj => obj.sort())
      .then(obj => expect(obj).toEqual(['attribute', 'default', 'group']));
  });

  test('manifestNoPluginName No Defaults', () => {
    expect.assertions(1);
    return manifestFactory(
      null,
      'semverImpliedNoDefaults',
      nestedConfig.semverist
    )
      .then(ManifestClass => {
        const schoenberg = new ManifestClass();
        schoenberg.setManifestCapabilities();
        return schoenberg.getManifestCapabilities();
      })
      .then(obj => obj.sort())
      .then(obj => expect(obj).toEqual(['attribute', 'group']));
  });

  test('manifestNoPluginName No Groups', () => {
    expect.assertions(1);
    return manifestFactory(
      null,
      'semverImpliedNoGroups',
      nestedConfig.semverist
    )
      .then(ManifestClass => {
        const schoenberg = new ManifestClass();
        schoenberg.setManifestCapabilities();
        return schoenberg.getManifestCapabilities();
      })
      .then(obj => obj.sort())
      .then(obj => expect(obj).toEqual(['attribute', 'default']));
  });

  test('manifestNoPluginName No Defaults No Groups', () => {
    expect.assertions(1);
    return manifestFactory(
      null,
      'semverImpliedNoDefaultsNoGroups',
      nestedConfig.semverist
    )
      .then(ManifestClass => {
        const schoenberg = new ManifestClass();
        schoenberg.setManifestCapabilities();
        return schoenberg.getManifestCapabilities();
      })
      .then(obj => obj.sort())
      .then(obj => expect(obj).toEqual(['attribute']));
  });

  test('manifestNoPluginName default config still has capabilities', () => {
    expect.assertions(1);
    return manifestFactory()
      .then(ManifestClass => {
        const schoenberg = new ManifestClass();
        schoenberg.setManifestCapabilities();
        return schoenberg.getManifestCapabilities();
      })
      .then(obj => obj.sort())
      .then(obj => expect(obj).toEqual(['attribute', 'default', 'group']));
  });

  test('Converter static object.', () => {
    expect.assertions(1);
    return manifestFactory(
      null,
      'semverImpliedOrchestraObject',
      nestedConfig.semverist
    )
      .then(ManifestClass => ManifestClass.createConverter(semveristObject))
      .then(obj => obj[0])
      .then(obj => expect(obj).toEqual(digestedHelper));
  });

  test('Converter static object to manifest converter.', () => {
    expect.assertions(1);
    return manifestFactory(
      null,
      'semverImpliedOrchestraObject',
      nestedConfig.semverist
    )
      .then(ManifestClass =>
        Promise.all([
          ManifestClass.createConverter(semveristObject),
          ManifestClass,
        ])
      )
      .then(manifestIngredients => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        return schoenberg.getConverter();
      })
      .then(obj => expect(obj).toEqual(digestedHelper));
  });

  test('Directory Converter static object to manifest converter.', () => {
    expect.assertions(1);
    const clonedConfig = Object.assign({}, nestedConfig.semverist);
    clonedConfig.semverImpliedOrchestraDirectory.callPath = path.join(
      __dirname,
      '../../../'
    );
    return manifestFactory(
      null,
      'semverImpliedOrchestraDirectory',
      clonedConfig
    )
      .then(ManifestClass =>
        Promise.all([
          ManifestClass.createConverter(semverishPath),
          ManifestClass,
        ])
      )
      .then(manifestIngredients => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        return schoenberg.getConverter();
      })
      .then(obj => expect(obj).toEqual(digestedHelper));
  });

  test('Manifest component Defaults.', () => {
    expect.assertions(1);
    return manifestFactory(
      null,
      'semverImpliedOrchestraObject',
      nestedConfig.semverist
    )
      .then(ManifestClass =>
        Promise.all([
          ManifestClass.createConverter(semveristObject),
          ManifestClass,
        ])
      )
      .then(manifestIngredients => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
        return schoenberg.getManifestComponents();
      })
      .then(obj =>
        obj.clarinet['1.1.1'].components.indexOf('1.orchestraDefault')
      )
      .then(obj => expect(obj).not.toBe(-1));
  });

  test('Manifest component Groups.', () => {
    expect.assertions(1);
    return manifestFactory(
      null,
      'semverImpliedOrchestraObject',
      nestedConfig.semverist
    )
      .then(ManifestClass =>
        Promise.all([
          ManifestClass.createConverter(semveristObject),
          ManifestClass,
        ])
      )
      .then(manifestIngredients => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
        return schoenberg.getManifestComponents();
      })
      .then(obj => obj.clarinet['1.1.1'].components.indexOf('1.winds'))
      .then(obj => expect(obj).not.toBe(-1));
  });

  test('Manifest component no Groups.', () => {
    expect.assertions(1);
    return manifestFactory(
      null,
      'semverImpliedNoDefaultsNoGroups',
      nestedConfig.semverist
    )
      .then(ManifestClass =>
        Promise.all([
          ManifestClass.createConverter(semveristObject),
          ManifestClass,
        ])
      )
      .then(manifestIngredients => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
        return schoenberg.getManifestComponents();
      })
      .then(obj => obj.clarinet['1.1.1'].components.indexOf('1.winds'))
      .then(obj => expect(obj).toBe(-1));
  });

  test('Manifest component no Defaults.', () => {
    expect.assertions(1);
    return manifestFactory(
      null,
      'semverImpliedNoDefaultsNoGroups',
      nestedConfig.semverist
    )
      .then(ManifestClass =>
        Promise.all([
          ManifestClass.createConverter(semveristObject),
          ManifestClass,
        ])
      )
      .then(manifestIngredients => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
        return schoenberg.getManifestComponents();
      })
      .then(obj =>
        obj.clarinet['1.1.1'].components.indexOf('1.orchestraDefault')
      )
      .then(obj => expect(obj).toBe(-1));
  });

  test('Manifest component attributes.', () => {
    expect.assertions(1);
    return manifestFactory(
      null,
      'semverImpliedOrchestraObject',
      nestedConfig.semverist
    )
      .then(ManifestClass =>
        Promise.all([
          ManifestClass.createConverter(semveristObject),
          ManifestClass,
        ])
      )
      .then(manifestIngredients => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
        return schoenberg.getManifestComponents();
      })
      .then(obj => expect(obj).toEqual(manifestSemverImpliedProcessed));
  });

  test('Manifest converter class.', () => {
    expect.assertions(1);
    return manifestFactory(
      null,
      'semverImpliedOrchestraObjectNoGroups',
      nestedConfig.semverist
    )
      .then(ManifestClass =>
        Promise.all([
          ManifestClass.createConverter(semveristObject),
          ManifestClass,
        ])
      )
      .then(manifestIngredients => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
        return schoenberg.getConverterClass().getSemverishObject();
      })
      .then(obj => expect(obj).toEqual(semveristObject));
  });

  test('pathBuildImprovement.', () => {
    expect.assertions(1);
    return manifestFactory(
      'composer',
      'semverImpliedOrchestraObject',
      nestedConfig.semverist
    )
      .then(ManifestClass =>
        Promise.all([
          ManifestClass.createConverter(semveristObject),
          ManifestClass,
        ])
      )
      .then(manifestIngredients => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
        const parsedPath = semverUtils.parse('1.1.1-alpha+124');
        return ManifestClass.pathBuildImprovement(parsedPath);
      })
      .then(obj => expect(obj).toEqual('1.1.1-alpha.124'));
  });

  test('pathBuildImprovement no build.', () => {
    expect.assertions(1);
    return manifestFactory(
      'composer',
      'semverImpliedOrchestraObject',
      nestedConfig.semverist
    )
      .then(ManifestClass =>
        Promise.all([
          ManifestClass.createConverter(semveristObject),
          ManifestClass,
        ])
      )
      .then(manifestIngredients => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
        const parsedPath = semverUtils.parse('1.1.1-alpha.1');
        return ManifestClass.pathBuildImprovement(parsedPath);
      })
      .then(obj => expect(obj).toEqual('1.1.1-alpha.1'));
  });

  test('create semver hierarchy.', () => {
    expect.assertions(1);
    return manifestFactory(
      'composer',
      'semverImpliedOrchestraObject',
      nestedConfig.semverist
    )
      .then(ManifestClass =>
        Promise.all([
          ManifestClass.createConverter(semveristObject),
          ManifestClass,
        ])
      )
      .then(manifestIngredients => {
        const ManifestClass = manifestIngredients[1];
        const converter = manifestIngredients[0][0];
        const converterClass = manifestIngredients[0][1];
        const schoenberg = new ManifestClass(converter, converterClass);
        schoenberg.init();
        return schoenberg.createSemverHierarchy({});
      })
      .then(obj => expect(obj).toMatchSnapshot());
  });
});
