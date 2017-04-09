import test from 'ava';

const configLoader = require('../../lib/configLoader');

const nestedConfig = {
  useLazySemverist: {
    semveristBehaviors: {
      inheritence: 'lazySemverist',
      lazySemverist: {
        attribute: true,
        preReleaseForwards: false
      },
      default: true,
      defaultName: 'default',
      groups: true,
      mergeStrategy: 'lastIn',
      preReleasePattern: /\d-[a-zA-Z]*/g
    },
    groups: {},
    prereleaseOrdering: {}
  },
  useSemverImplied: {
    semveristBehaviors: {
      inheritence: 'semverImplied',
      lazySemverist: {
        attribute: true,
        preReleaseForwards: false
      },
      default: true,
      defaultName: 'default',
      groups: true,
      mergeStrategy: 'lastIn',
      preReleasePattern: /\d-[a-zA-Z]*/g
    },
    groups: {},
    prereleaseOrdering: {}
  },
  useNoInheritence: {
    semveristBehaviors: {
      inheritence: null,
      lazySemverist: {
        attribute: true,
        preReleaseForwards: false
      },
      default: true,
      defaultName: 'default',
      groups: true,
      mergeStrategy: 'lastIn',
      preReleasePattern: /\d-[a-zA-Z]*/g
    },
    groups: {},
    prereleaseOrdering: {}
  }
};

test('init with overrides lazy Semverist', (t) => {
  t.context.data = configLoader('useLazySemverist', nestedConfig);
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'lazySemverist',
    'Overridden config should be set by providing new config to init.'
  );
});

test('init with overrides semver Implied', (t) => {
  t.context.data = configLoader('useSemverImplied', nestedConfig);
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'semverImplied',
    'Overridden config should be set by providing new config to init.'
  );
});

test('Config name space does not exist', (t) => {
  t.throws(() => {
    configLoader('notAKey', nestedConfig);
  },
  'Configuration property "semverist.notAKey" is not defined');
});

test('init with overrides no name space', (t) => {
  t.context.data = configLoader(null, nestedConfig);
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
