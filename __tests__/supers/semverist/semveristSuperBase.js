const SemveristSuperBase = require('../../../lib/supers/semverist');

const alternateConfig = {
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
};

test('setPreleasePatternWithArg', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setPreReleasePattern(/\d-[A-Z]*/g);
  t.context.data = semveristSuperBase.getPreReleasePattern();
  expect(t.context.data).toEqual(/\d-[A-Z]*/g);
});

test('setPreleasePatternNoArg', () => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.getPreReleasePattern();
  expect(t.context.data).toEqual(
    /\d+-([0-9A-Za-z-]*)((\.\d*(\+[a-zA-Z0-9-]*)|\.\d+\b)*\.?|\+[a-zA-Z0-9-]+\.?)?/g
  );
});

test('setSourceGoodSource', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSource({test: []});
  t.context.data = semveristSuperBase.getSource();
  expect(t.context.data).toEqual({test: []});
});

test('setSourceBadSource', () => {
  expect(() => {
    const semveristSuperBase = new SemveristSuperBase();
    semveristSuperBase.setSource('test');
  }).toThrowError('Could not set source, it must be an object.');
});

test('setDefaultName', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setDefaultName('default');
  t.context.data = semveristSuperBase.getDefaultName();
  expect(t.context.data).toEqual('default');
});

test('doesAttributeBelongToGroupTrue', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
    {
      testGroup: {
        members: [
          'testItem'
        ]
      }
    }
  );
  expect(semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup')).toBe(true);
});


test('doesAttributeBelongToGroupFalse', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
    {
      testGroup: {
        members: [
          'junkItem'
        ]
      }
    }
  );
  expect(semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup')).toBe(false);
});

test('doesAttributeBelongToGroupError', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
    {
      testGroup: {}
    }
  );
  expect(() => {
    semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup');
  }).toThrowError('testGroup group is not properly formed and has no members array');
});

test('getSemveristGroups', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
    {
      testGroup: {
        members: [
          'testItem'
        ]
      },
      fakeGroup: {
        members: [
          'punk'
        ]
      },
      testGroup2: {
        members: [
          'punk',
          'testItem'
        ]
      }
    }
  );
  t.context.data = semveristSuperBase.getSemveristAttributeGroups('testItem');
  expect(t.context.data.sort()).toEqual([
    'testGroup',
    'testGroup2'
  ]);
});

test('getSemveristConfig', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristConfig(
    {
      semveristBehaviors: {}
    });
  t.context.data = semveristSuperBase.getSemveristConfig();
  expect(Object.keys(t.context.data)).toEqual(['semveristBehaviors']);
});

test('init with overrides', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init(alternateConfig);
  t.context.data = semveristSuperBase.getSemveristConfig().semveristBehaviors.inheritence;
  expect(t.context.data).toEqual('lazySemverist');
});

test('get Semver Level index', () => {
  t.context.data = SemveristSuperBase.getSemverLevelIndex('prerelease');
  expect(t.context.data).toEqual(3);
});

