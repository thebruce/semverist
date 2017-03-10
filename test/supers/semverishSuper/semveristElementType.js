import test from 'ava';

const SemverishSuper = require('../../../lib/supers/semverishSuper');

test('determineSemveristElementTypeAttribute', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristGroups(
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
  semverishSuper.setDefaultName('default');
  t.context.data = semverishSuper.determineSemveristElementType('testItem');
  t.deepEqual(
    t.context.data,
    'attribute',
    'Attributes should report back that they are attributes.'
  );
});

test('determineSemveristElementTypeGroup', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristGroups(
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
  semverishSuper.setDefaultName('default');
  t.context.data = semverishSuper.determineSemveristElementType('testGroup2');
  t.deepEqual(
    t.context.data,
    'group',
    'Groups should report back that they are groups.'
  );
});

test('determineSemveristElementTypeDefault', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristGroups(
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
  semverishSuper.setDefaultName('default');
  t.context.data = semverishSuper.determineSemveristElementType('default');
  t.deepEqual(
    t.context.data,
    'default',
    'Defaults should report back that they are defaults.'
  );
});


test('setElementTypeAttribute', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristGroups(
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
  semverishSuper.setDefaultName('default');
  semverishSuper.setSemveristElementType('testItem');
  t.context.data = semverishSuper.getSemveristElementType();
  t.deepEqual(
    t.context.data,
    'attribute',
    'Attributes should report back that they are attributes.'
  );
});

test('setElementTypeGroup', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristGroups(
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
  semverishSuper.setDefaultName('default');
  semverishSuper.setSemveristElementType('testGroup2');
  t.context.data = semverishSuper.getSemveristElementType();
  t.deepEqual(
    t.context.data,
    'group',
    'Groups should report back that they are groups.'
  );
});

test('setElementTypeDefault', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristGroups(
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
  semverishSuper.setDefaultName('default');
  semverishSuper.setSemveristElementType('default');
  t.context.data = semverishSuper.getSemveristElementType();
  t.deepEqual(
    t.context.data,
    'default',
    'Defaults should report back that they are defaults.'
  );
});
