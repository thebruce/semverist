

const rangeFactory = require('../../../../lib/semverish/range');

let tmpMocks = [];
let ranger;

describe('Semver Adjacent', () => {
  beforeEach(() => {
    ranger = rangeFactory('semverist', 'range');
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Semverish1ParentToChild', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.0');
      })
      .then(obj => obj.child)
      .then(obj => expect(obj).toBe(true));
  });

  test('Semverish1ParentTo3Child', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.0.0');
      })
      .then(obj => obj.child)
      .then(obj => expect(obj).toBe(true));
  });

  test('Semverish1ParentTo4Child', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.0.0-alpha');
      })
      .then(obj => obj.child)
      .then(obj => expect(obj).toBe(true));
  });

  test('Semverish1ParentTo2ChildDifferentMinor', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.1');
      })
      .then(obj => expect(obj.child).toBe(true));
  });

  test('Semverish1ParentTo2ChildDifferentPatch', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.1.0');
      })
      .then(obj => expect(obj.child).toBe(true));
  });

  test('Semverish2ParentToChild', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0', '1.0.0');
      })
      .then(obj => expect(obj.child).toBe(true));
  });

  test('Semverish4ParentToChild', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha', '1.0.0-alpha.0');
      })
      .then(obj => expect(obj.child).toBe(true));
  });

  test('Semverish4ParentToNonAdjacent5Child', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha', '1.0.0-beta.0');
      })
      .then(obj => expect(obj.child).toBe(false));
  });

  test('Semverish76ParentToChild', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha.0', '1.0.0-alpha.1');
      })
      .then(obj => expect(obj.child).toBe(false));
  });

  test('adjacentPrereleasesDifferentGreek', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha.0', '1.0.0-beta.1');
      })
      .then(obj => expect(obj.adjacent).toBe(false));
  });


  test('Semverish5ParentToChild', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha.0', '1.0.0-alpha.0+build123');
      })
      .then(obj => expect(obj.child).toBe(true));
  });

  test('Semverish2toNonChild', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1', '1.2');
      })
      .then(obj => expect(obj.child).toBe(false));
  });

  test('Semverish3toNonChild', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1.0', '1.1.0-alpha');
      })
      .then(obj => expect(obj.child).toBe(false));
  });

  test('Semverish3toEqual', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1.0', '1.1.0');
      })
      .then(obj => expect(obj.child).toBe(false));
  });

  test('Semverish3to3', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha', '1.0.1');
      })
      .then(obj => expect(obj.child).toBe(false));
  });

  test('Semverish1to3', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.0.1-alpha');
      })
      .then(obj => expect(obj.child).toBe(true));
  });

  test('Semverish4to3', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.1-alpha', '1.0.2-alpha.0');
      })
      .then(obj => expect(obj.child).toBe(false));
  });

  test('Semverish4to5Major', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.1-alpha', '2.0.1-alpha.0');
      })
      .then(obj => expect(obj.child).toBe(false));
  });

  test('SemverishAdjacent', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0', '1.0.1');
      })
      .then(obj => expect(obj.adjacent).toBe(true));
  });

  test('SemverishAdjacentMinorLevels', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1', '1.2');
      })
      .then(obj => expect(obj.adjacent).toBe(true));
  });

  test('SemverishAdjacentMajorLevels', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '2');
      })
      .then(obj => expect(obj.adjacent).toBe(true));
  });

  test('SemverishAdjacentAlphaLevels', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1.1-alpha.0', '1.1.1-alpha.1');
      })
      .then(obj => expect(obj.adjacent).toBe(true));
  });

  test('SemverishAdjacentPrereleaseLevels', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1.1-alpha', '1.1.1-beta');
      })
      .then(obj => expect(obj.adjacent).toBe(false));
  });

  test('SemverishAdjacentishExplicitLowerDespecifiedHigher', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.2.2', '1.3');
      })
      .then(obj => expect(obj.adjacent).toBe(false));
  });

  test('SemverishAdjacentishDespecifiedLowerExplicitHigher', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1', '1.2.1');
      })
      .then(obj => expect(obj.adjacent).toBe(false));
  });
});
