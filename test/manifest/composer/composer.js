import test from 'ava';

const manifestFactory = require('../../../lib/manifest/manifest');
const nestedConfig = require('../../helpers/nestedConfig.json');
const semveristObject = require('../../helpers/semverishObject');
const path = require('path');
const processedComposition = require('../../helpers/processedComposition');

const semverishPath = path.join(
   __dirname,
  '../../../',
  'test/helpers/semverishObject'
);

test('manifestDefaultClasses', async (t) => {
  t.context.data = await manifestFactory(
    'composer',
    'useLazySemverist',
    nestedConfig.semverist
  )
  .then((ManifestClass) => {
    const schoenberg = new ManifestClass();
    schoenberg.setManifestCapabilities();
    return schoenberg.getManifestCapabilities();
  });
  t.deepEqual(
    t.context.data.sort(),
    [
      'attribute',
      'default',
      'group'
    ],
    'Named plugins should get config based mixins as well as their own.'
  );
});

test('Composer get and set composition tests.', async (t) => {
  t.context.data = await manifestFactory(
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
    schoenberg.setComposition({test: 'test'});
    return schoenberg.getComposition();
  });
  t.deepEqual(
    t.context.data,
    {
      test: 'test'
    },
    'Converter class is a fully functioning converter class.'
  );
});

test('Manifest get composition destination.', async (t) => {
  t.context.data = await manifestFactory(
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
    schoenberg.setComposition({test: 'test'});
    return schoenberg.getCompositionDestination();
  });
  t.deepEqual(
    t.context.data,
    null,
    'Converter class is a fully functioning converter class.'
  );
});

test('Composer directory no destination error.', async (t) => {
  await t.throws(manifestFactory(
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
  }),
  'If the composition type is directory there must be a destination path');
});

test('strategizeComposition.', async (t) => {
  t.context.data = await manifestFactory(
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
    const draft = {
      1: {
        1: {
          1: {}
        }
      }
    };
    return schoenberg.strategizeComposition('clarinet', '1.1.1', draft);
  });
  t.deepEqual(
    t.context.data,
    {
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
    },
    'Composer strategize with merge functionality should merge all components down for an item.'
  );
});

test('prioritize component', async (t) => {
  t.context.data = await manifestFactory(
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
    const semveristArray = [
      'clarinet',
      '1.1.1'
    ];
    schoenberg.prioritizeComponent(semveristArray);
    return schoenberg.getManifestComponents().clarinet['1.1.1'].components;
  });
  t.deepEqual(
    t.context.data,
    [
      '1.orchestraDefault',
      '1.winds',
      '1.1.1.clarinet'
    ],
    'Composer strategize with merge functionality should merge all components down for an item.'
  );
});

test('prioritize component no groups', async (t) => {
  t.context.data = await manifestFactory(
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
  });
  t.deepEqual(
    t.context.data,
    [
      '1.orchestraDefault',
      '1.1.1.clarinet'
    ],
    'Composer strategize with merge functionality should merge all components down for an item.'
  );
});

test('prioritize component no defaults', async (t) => {
  t.context.data = await manifestFactory(
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
  });
  t.deepEqual(
    t.context.data,
    [
      '1.winds',
      '1.1.1.clarinet'
    ],
    'Composer strategize with merge functionality should merge all components down for an item.'
  );
});

test('write composition.', async (t) => {
  t.context.data = await manifestFactory(
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
    schoenberg.writeComposition();
    return schoenberg.getComposition();
  });
  t.deepEqual(
    t.context.data,
    processedComposition,
     'Should build out objects for all semver realizations.'
  );
});

test('assemble manifest.', async (t) => {
  t.context.data = await manifestFactory(
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
    schoenberg.assembleManifest();
    return schoenberg.getComposition();
  });
  t.deepEqual(
    t.context.data,
    processedComposition,
     'Should build out objects for all semver realizations.'
  );
});
