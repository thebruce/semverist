import test from 'ava';

const SemveristSuperBase = require('../../../lib/supers/semveristSuperBase');

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

test('setPreleasePatternWithArg', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setPreReleasePattern(/\d-[A-Z]*/g);
  t.context.data = semveristSuperBase.getPreReleasePattern();
  t.deepEqual(
    t.context.data,
    /\d-[A-Z]*/g,
    'Setting the preReleasePattern to a value should result in that value.'
  );
});

test('setPreleasePatternNoArg', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.getPreReleasePattern();
  t.deepEqual(
    t.context.data,
    /\d+-([0-9A-Za-z-]*)((\.\d*(\+[a-zA-Z0-9-]*)|\.\d+\b)*\.?|\+[a-zA-Z0-9-]+\.?)?/g,
    'The default pattern for the PreReleasePattern is "/\d+-([0-9A-Za-z-]*)((\.\d*(\+[a-zA-Z0-9-]*)|\.\d+\b)*\.?|\+[a-zA-Z0-9-]+\.?)?/g"'  //eslint-disable-line
  );
});

test('setSourceGoodSource', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSource({test: []});
  t.context.data = semveristSuperBase.getSource();
  t.deepEqual(
    t.context.data,
    {test: []},
    'Sources are objects, so an object should be a valid source.'
  );
});

test('setSourceBadSource', (t) => {
  t.throws(() => {
    const semveristSuperBase = new SemveristSuperBase();
    semveristSuperBase.setSource('test');
  },
  'Could not set source, it must be an object.');
});

test('setDefaultsName', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setDefaultName('default');
  t.context.data = semveristSuperBase.getDefaultName();
  t.deepEqual(
    t.context.data,
    'default',
    'Set Default Name should be a clear pass through to default name value.'
  );
});

test('doesAttributeBelongToGroupTrue', (t) => {
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
  t.true(semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup'),
    'Attributes who are members of a group should report that they belong to that group.'
  );
});


test('doesAttributeBelongToGroupFalse', (t) => {
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
  t.false(semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup'),
    'Attributes who are not members of a group should not report that they belong to that group.'
  );
});

test('doesAttributeBelongToGroupError', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
    {
      testGroup: {}
    }
  );
  t.throws(() => {
    semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup');
  },
  'testGroup group is not properly formed and has no members array');
});

test('getSemveristGroups', (t) => {
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
  t.deepEqual(
    t.context.data.sort(),
    [
      'testGroup',
      'testGroup2'
    ],
    'Groups that have the attribute being sought should be added to the return'
  );
});

test('getSemveristConfig', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristConfig(
    {
      semveristBehaviors: {}
    });
  t.context.data = semveristSuperBase.getSemveristConfig();
  t.deepEqual(
    Object.keys(t.context.data),
    ['semveristBehaviors'],
    'Get Config should be a pass through to set config.'
  );
});

test('init with overrides', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init(alternateConfig);
  t.context.data = semveristSuperBase.getSemveristConfig().semveristBehaviors.inheritence;
  t.deepEqual(
    t.context.data,
    'lazySemverist',
    'Overridden config should be set by providing new config to init.'
  );
});
