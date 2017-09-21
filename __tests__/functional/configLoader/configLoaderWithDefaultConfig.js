'use strict';

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
let tmpMocks = [];
describe('Config Loader with Default tests', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const configLoader = require('../../../lib/configLoader');

  test('init with overrides lazy Semverist', () => {
    const conf = configLoader('useLazySemverist', config);
    expect(conf.semveristBehaviors.inheritence).toEqual('lazySemverist');
  });
});
