

const semverishFactory = require('../../../lib/semverish/semverish');

let tmpMocks = [];
let semverah;

describe('Semverist Element Type tests', () => {
  beforeEach(() => {
    semverah = semverishFactory('semverist', 'semverish')
      .then(SemverishSuperClass => new SemverishSuperClass());
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('determineSemveristElementTypeAttribute', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
        testGroup: {
          members: [
            'testItem',
          ],
        },
        fakeGroup: {
          members: [
            'punk',
          ],
        },
        testGroup2: {
          members: [
            'punk',
            'testItem',
          ],
        },
      });
      semverishSuper.setDefaultName('default');
      return semverishSuper.determineSemveristElementType('testItem');
    })
      .then(obj => expect(obj).toEqual('attribute'));
  });

  test('determineSemveristElementTypeGroup', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
        testGroup: {
          members: [
            'testItem',
          ],
        },
        fakeGroup: {
          members: [
            'punk',
          ],
        },
        testGroup2: {
          members: [
            'punk',
            'testItem',
          ],
        },
      });
      semverishSuper.setDefaultName('default');
      return semverishSuper.determineSemveristElementType('testGroup2');
    })
      .then(obj => expect(obj).toEqual('group'));
  });

  test('determineSemveristElementTypeDefault', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
        testGroup: {
          members: [
            'testItem',
          ],
        },
        fakeGroup: {
          members: [
            'punk',
          ],
        },
        testGroup2: {
          members: [
            'punk',
            'testItem',
          ],
        },
      });
      semverishSuper.setDefaultName('default');
      return semverishSuper.determineSemveristElementType('default');
    })
      .then(obj => expect(obj).toEqual('default'));
  });


  test('setElementTypeAttribute', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
        testGroup: {
          members: [
            'testItem',
          ],
        },
        fakeGroup: {
          members: [
            'punk',
          ],
        },
        testGroup2: {
          members: [
            'punk',
            'testItem',
          ],
        },
      });
      semverishSuper.setDefaultName('default');
      semverishSuper.setSemveristElementType('testItem');
      return semverishSuper.getSemveristElementType();
    })
      .then(obj => expect(obj).toEqual('attribute'));
  });

  test('setElementTypeGroup', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
        testGroup: {
          members: [
            'testItem',
          ],
        },
        fakeGroup: {
          members: [
            'punk',
          ],
        },
        testGroup2: {
          members: [
            'punk',
            'testItem',
          ],
        },
      });
      semverishSuper.setDefaultName('default');
      semverishSuper.setSemveristElementType('testGroup2');
      return semverishSuper.getSemveristElementType();
    })
      .then(obj => expect(obj).toEqual('group'));
  });

  test('setElementTypeDefault', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
        testGroup: {
          members: [
            'testItem',
          ],
        },
        fakeGroup: {
          members: [
            'punk',
          ],
        },
        testGroup2: {
          members: [
            'punk',
            'testItem',
          ],
        },
      });
      semverishSuper.setDefaultName('default');
      semverishSuper.setSemveristElementType('default');
      return semverishSuper.getSemveristElementType();
    })
      .then(obj => expect(obj).toEqual('default'));
  });
});
