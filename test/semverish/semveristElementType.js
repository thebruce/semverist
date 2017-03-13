import test from 'ava';

const semverishFactory = require('../../lib/semverish/semverish');

test('determineSemveristElementTypeAttribute', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
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
    return semverishSuper.determineSemveristElementType('testItem');
  });
  t.deepEqual(
    t.context.data,
    'attribute',
    'Attributes should report back that they are attributes.'
  );
});

test('determineSemveristElementTypeGroup', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
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
    return semverishSuper.determineSemveristElementType('testGroup2');
  });
  t.deepEqual(
    t.context.data,
    'group',
    'Groups should report back that they are groups.'
  );
});

test('determineSemveristElementTypeDefault', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
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
    return semverishSuper.determineSemveristElementType('default');
  });
  t.deepEqual(
    t.context.data,
    'default',
    'Defaults should report back that they are defaults.'
  );
});


test('setElementTypeAttribute', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
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
    return semverishSuper.getSemveristElementType();
  });
  t.deepEqual(
    t.context.data,
    'attribute',
    'Attributes should report back that they are attributes.'
  );
});

test('setElementTypeGroup', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
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
    return semverishSuper.getSemveristElementType();
  });
  t.deepEqual(
    t.context.data,
    'group',
    'Groups should report back that they are groups.'
  );
});

test('setElementTypeDefault', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
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
    return semverishSuper.getSemveristElementType();
  });
  t.deepEqual(
    t.context.data,
    'default',
    'Defaults should report back that they are defaults.'
  );
});
