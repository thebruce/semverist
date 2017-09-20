'use strict';

const rangeFactory = require('../../../lib/semverish/range');

let tmpMocks = [];
let ranger;

describe('Range tests', () => {
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
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.0');
      })
    .then(obj => obj.child)).resolves.toBe(true);
  });

  test('Semverish1ParentTo3Child', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.0.0');
      })
    .then(obj => obj.child)).resolves.toBe(true);
  });

  test('Semverish1ParentTo4Child', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.0.0-alpha');
      })
    .then(obj => obj.child)).resolves.toBe(true);
  });

  test('Semverish1ParentTo2ChildDifferentMinor', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.1');
      })
    .then(obj => obj.child)).resolves.toBe(true);
  });

  test('Semverish1ParentTo2ChildDifferentPatch', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.1.0');
      })
    .then(obj => obj.child)).resolves.toBe(true);
  });

  test('Semverish2ParentToChild', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0', '1.0.0');
      })
    .then(obj => obj.child)).resolves.toBe(true);
  });

  test('Semverish4ParentToChild', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha', '1.0.0-alpha.0');
      })
    .then(obj => obj.child)).resolves.toBe(true);
  });

  test('Semverish4ParentToNonAdjacent5Child', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha', '1.0.0-beta.0');
      })
    .then(obj => obj.child)).resolves.toBe(false);
  });

  test('Semverish76ParentToChild', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha.0', '1.0.0-alpha.1');
      })
    .then(obj => obj.child)).resolves.toBe(false);
  });

  test('adjacentPrereleasesDifferentGreek', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha.0', '1.0.0-beta.1');
      })
    .then(obj => obj.adjacent)).resolves.toBe(false);
  });


  test('Semverish5ParentToChild', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha.0', '1.0.0-alpha.0+build123');
      })
    .then(obj => obj.child)).resolves.toBe(true);
  });

  test('Semverish2toNonChild', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1', '1.2');
      })
    .then(obj => obj.child)).resolves.toBe(false);
  });

  test('Semverish3toNonChild', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1.0', '1.1.0-alpha');
      })
    .then(obj => obj.child)).resolves.toBe(false);
  });

  test('Semverish3toEqual', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1.0', '1.1.0');
      })
    .then(obj => obj.child)).resolves.toBe(false);
  });

  test('Semverish3to3', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha', '1.0.1');
      })
    .then(obj => obj.child)).resolves.toBe(false);
  });

  test('Semverish1to3', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '1.0.1-alpha');
      })
    .then(obj => obj.child)).resolves.toBe(true);
  });

  test('Semverish4to3', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.1-alpha', '1.0.2-alpha.0');
      })
    .then(obj => obj.child)).resolves.toBe(false);
  });

  test('Semverish4to5Major', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.1-alpha', '2.0.1-alpha.0');
      })
    .then(obj => obj.child)).resolves.toBe(false);
  });

  test('SemverishAdjacent', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.0.0', '1.0.1');
      })
    .then(obj => obj.adjacent)).resolves.toBe(true);
  });

  test('SemverishAdjacentMinorLevels', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1', '1.2');
      })
    .then(obj => obj.adjacent)).resolves.toBe(true);
  });

  test('SemverishAdjacentMajorLevels', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1', '2');
      })
    .then(obj => obj.adjacent)).resolves.toBe(true);
  });

  test('SemverishAdjacentAlphaLevels', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1.1-alpha.0', '1.1.1-alpha.1');
      })
    .then(obj => obj.adjacent)).resolves.toBe(true);
  });

  test('SemverishAdjacentPrereleaseLevels', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1.1-alpha', '1.1.1-beta');
      })
    .then(obj => obj.adjacent)).resolves.toBe(false);
  });

  test('SemverishAdjacentishExplicitLowerDespecifiedHigher', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.2.2', '1.3');
      })
    .then(obj => obj.adjacent)).resolves.toBe(false);
  });

  test('SemverishAdjacentishDespecifiedLowerExplicitHigher', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.init();
        rangeClass.setSemveristElementType('entity');
        rangeClass.setOptions();
        return rangeClass.analyzeSemverishAdjacency('1.1', '1.2.1');
      })
    .then(obj => obj.adjacent)).resolves.toBe(false);
  });
});