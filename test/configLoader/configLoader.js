import test from 'ava';

const configLoader = require('../../lib/configLoader');
const nestedConfig = require('../helpers/nestedConfig.json');

test('init with overrides lazy Semverist', (t) => {
  t.context.data = configLoader('useLazySemverist', nestedConfig.semverist);
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'lazySemverist',
    'Overridden config should be set by providing new config to init.'
  );
});

test('init with overrides semver Implied', (t) => {
  t.context.data = configLoader('useSemverImplied', nestedConfig.semverist);
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'semverImplied',
    'Overridden config should be set by providing new config to init.'
  );
});

test('Config name space does not exist', (t) => {
  t.throws(() => {
    configLoader('notAKey', nestedConfig.semverist);
  },
  'Configuration property "semverist.notAKey" is not defined');
});

test('init with overrides no name space', (t) => {
  t.context.data = configLoader(null, nestedConfig.semverist);
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'semverImplied',
    'Overridden config should be set by providing new config to init.'
  );
});

test('init with defaults', (t) => {
  t.context.data = configLoader();
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'semverImplied',
    'Overridden config should be set by providing new config to init.'
  );
});
