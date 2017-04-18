import test from 'ava';

const configLoader = require('../../lib/configLoader');
const nestedConfig = require('../helpers/nestedConfig.json');

test.serial('init with overrides lazy Semverist', (t) => {
  t.context.data = configLoader('useLazySemverist', nestedConfig.semverist);
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'lazySemverist',
    'Overridden config should be set by providing new config to init.'
  );
});

test.serial('init with overrides semver Implied', (t) => {
  t.context.data = configLoader('useSemverImplied', nestedConfig.semverist);
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'semverImplied',
    'Overridden config should be set by providing new config to init.'
  );
});

test.serial('Config name space does not exist', (t) => {
  t.throws(() => {
    configLoader('notAKey', nestedConfig.semverist);
  },
  'Name space does not exist in passed configs.');
});

test.serial('init with overrides no name space', (t) => {
  t.context.data = configLoader(null, nestedConfig.semverist);
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'semverImplied',
    'Overridden config should be set by providing new config to init.'
  );
});

test.serial('init with defaults', (t) => {
  t.context.data = configLoader();
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'semverImplied',
    'Overridden config should be set by providing new config to init.'
  );
});
