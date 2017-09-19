'use strict';

const manifestFactory = require('../../../lib/manifest/manifest');
const nestedConfig = require('../../helpers/nestedConfig.json');
const semveristObject = require('../../helpers/semverishObject');
const path = require('path');
const processedComposition = require('../../helpers/processedComposition');

const semverishPath = path.join(
   __dirname,
  '../../../',
  '__tests__/helpers/semverishObject'
);
let tmpMocks = [];
let manifestStarter;

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
    ])
  );
  tmpMocks.forEach(mock => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Source Converter Super test', () => {
  test('manifestDefaultClasses', () => {
    expect(manifestFactory(
      'composer',
      'useLazySemverist',
      nestedConfig.semverist
    )
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

test('Composer get and set composition tests.', () => {
  expect(manifestStarter
  .then((manifestIngredients) => {
    const ManifestClass = manifestIngredients[1];
    const converter = manifestIngredients[0][0];
    const converterClass = manifestIngredients[0][1];
    const schoenberg = new ManifestClass(converter, converterClass);
    schoenberg.init();
    schoenberg.setComposition({test: 'test'});
    return schoenberg.getComposition();
  })
  .then(obj => obj))
  .resolves.toEqual({
    test: 'test'
  });
});

test('Manifest get composition destination.', () => {
  expect(manifestStarter
    .then((manifestIngredients) => {
    const ManifestClass = manifestIngredients[1];
    const converter = manifestIngredients[0][0];
    const converterClass = manifestIngredients[0][1];
    const schoenberg = new ManifestClass(converter, converterClass);
    schoenberg.init();
    schoenberg.setComposition({test: 'test'});
    return schoenberg.getCompositionDestination();
  })
  .then(obj => obj))
  .resolves.toEqual(null);
});

test('Composer directory no destination error.', () => {
  expect(manifestFactory(
    'composer',
    'semverImpliedOrchestraDirectoryBroken',
    nestedConfig.semverist
  )
  .then(ManifestClass => Promise.all([
    ManifestClass.createConverter(semverishPath),
    ManifestClass]
  ))
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
  }));
});

test('strategizeComposition.', () => {
  expect(manifestStarter
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
  .then(obj => obj))
  .resolves.toEqual({
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
  });
});

test('prioritize component', () => {
  expect(manifestStarter
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
  .then(obj => obj))
  .resolves.toEqual([
    '1.orchestraDefault',
    '1.winds',
    '1.1.1.clarinet'
  ]);
});

test('prioritize component no groups', () => {
  expect(manifestFactory(
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
  .then(obj => obj))
  .resolves.toEqual([
    '1.orchestraDefault',
    '1.1.1.clarinet'
  ]);
});

test('prioritize component no defaults', () => {
  expect(manifestFactory(
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
  .then(obj => obj))
  .resolves.toEqual([
    '1.winds',
    '1.1.1.clarinet'
  ]);
});

  test('write composition.', () => {
    expect(manifestStarter
    .then((manifestIngredients) => {
      const ManifestClass = manifestIngredients[1];
      const converter = manifestIngredients[0][0];
      const converterClass = manifestIngredients[0][1];
      const schoenberg = new ManifestClass(converter, converterClass);
      schoenberg.init();
      schoenberg.writeComposition();
      return schoenberg.getComposition();
    })
    .then(obj => obj))
    .resolves.toEqual(processedComposition);
  });

  test('assemble manifest.', () => {
    expect(manifestStarter
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
    .resolves.toEqual(processedComposition);
  });
});
