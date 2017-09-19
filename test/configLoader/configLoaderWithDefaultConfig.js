import test from 'ava';

// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

// set up test config dirs.
const config = {
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
      mergeStrategy: 'lastIn'
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
      mergeStrategy: 'lastIn'
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
      mergeStrategy: 'lastIn'
    },
    groups: {},
    prereleaseOrdering: {}
  },
  semverImpliedNoDefaults: {
    semveristBehaviors: {
      inheritence: 'semverImplied',
      lazySemverist: {
        attribute: true,
        preReleaseForwards: false
      },
      default: false,
      defaultName: 'default',
      groups: true,
      mergeStrategy: 'lastIn'
    },
    groups: {},
    prereleaseOrdering: {}
  },
  semverImpliedNoGroups: {
    semveristBehaviors: {
      inheritence: 'semverImplied',
      lazySemverist: {
        attribute: true,
        preReleaseForwards: false
      },
      default: true,
      defaultName: 'default',
      groups: false,
      mergeStrategy: 'lastIn'
    },
    groups: {},
    prereleaseOrdering: {}
  },
  semverImpliedNoDefaultsNoGroups: {
    semveristBehaviors: {
      inheritence: 'semverImplied',
      lazySemverist: {
        attribute: true,
        preReleaseForwards: false
      },
      default: false,
      defaultName: 'default',
      groups: false,
      mergeStrategy: 'lastIn'
    },
    groups: {},
    prereleaseOrdering: {}
  },
  semverImpliedOrchestraObject: {
    semveristBehaviors: {
      inheritence: 'semverImplied',
      lazySemverist: {
        preReleaseForwards: false,
        attributes: true
      },
      default: true,
      defaultName: 'orchestraDefault',
      groups: true,
      mergeStrategy: 'lastIn'
    },
    groups: {
      strings: {
        members: [
          'violin',
          'viola'
        ]
      },
      winds: {
        members: [
          'flute',
          'clarinet'
        ]
      },
      brass: {
        members: [
          'trumpet',
          'trombone'
        ]
      }
    },
    directoryFileIgnorePattern: 'json$'
  },
  semverImpliedOrchestraDirectory: {
    semveristBehaviors: {
      inheritence: 'semverImplied',
      lazySemverist: {
        preReleaseForwards: false,
        attributes: true
      },
      default: true,
      defaultName: 'orchestraDefault',
      groups: true,
      mergeStrategy: 'lastIn'
    },
    groups: {
      strings: {
        members: [
          'violin',
          'viola'
        ]
      },
      winds: {
        members: [
          'flute',
          'clarinet'
        ]
      },
      brass: {
        members: [
          'trumpet',
          'trombone'
        ]
      }
    },
    directoryFileIgnorePattern: 'json$',
    converterType: 'directory'
  }
};
// And require here so that later requires will use this cached version.
const configLoader = require('../../lib/configLoader');

test.serial('init with overrides lazy Semverist', (t) => {
  t.context.data = configLoader('useLazySemverist', config);
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'lazySemverist',
    'Overridden config should be set by providing new config to init.'
  );
});
