const semverishFactory = require('../../lib/semverish/semverish');

test('determineSemveristElementTypeAttribute', async () => {
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
  expect(t.context.data).toEqual('attribute');
});

test('determineSemveristElementTypeGroup', async () => {
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
  expect(t.context.data).toEqual('group');
});

test('determineSemveristElementTypeDefault', async () => {
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
  expect(t.context.data).toEqual('default');
});


test('setElementTypeAttribute', async () => {
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
  expect(t.context.data).toEqual('attribute');
});

test('setElementTypeGroup', async () => {
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
  expect(t.context.data).toEqual('group');
});

test('setElementTypeDefault', async () => {
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
  expect(t.context.data).toEqual('default');
});
