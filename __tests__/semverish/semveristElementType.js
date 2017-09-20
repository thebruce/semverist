'use strict';

const semverishFactory = require('../../lib/semverish/semverish');

let tmpMocks = [];
let semverah;

describe('Range tests', () => {
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
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
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
      });
      semverishSuper.setDefaultName('default');
      return semverishSuper.determineSemveristElementType('testItem');
    })).resolves.toEqual('attribute');
  });

  test('determineSemveristElementTypeGroup', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
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
      });
      semverishSuper.setDefaultName('default');
      return semverishSuper.determineSemveristElementType('testGroup2');
    })).resolves.toEqual('group');
  });

  test('determineSemveristElementTypeDefault', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
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
      });
      semverishSuper.setDefaultName('default');
      return semverishSuper.determineSemveristElementType('default');
    })).resolves.toEqual('default');
  });


  test('setElementTypeAttribute', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
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
      });
      semverishSuper.setDefaultName('default');
      semverishSuper.setSemveristElementType('testItem');
      return semverishSuper.getSemveristElementType();
    })).resolves.toEqual('attribute');
  });

  test('setElementTypeGroup', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
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
      });
      semverishSuper.setDefaultName('default');
      semverishSuper.setSemveristElementType('testGroup2');
      return semverishSuper.getSemveristElementType();
    })).resolves.toEqual('group');
  });

  test('setElementTypeDefault', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemveristGroups({
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
      });
      semverishSuper.setDefaultName('default');
      semverishSuper.setSemveristElementType('default');
      return semverishSuper.getSemveristElementType();
    })).resolves.toEqual('default');
  });
});
