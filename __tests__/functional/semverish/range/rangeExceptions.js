'use strict';

const rangeFactory = require('../../../../lib/semverish/range');

const tmpConfig = {
  semveristBehaviors: {
    inheritence: 'semverImplied',
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

// Set Defaults for semverist objects.
const lazySemverConfig = {
  semveristBehaviors: {
    inheritence: 'lazySemverist',
    lazySemverist: {
      attribute: true,
      preReleaseForwards: true
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

let tmpMocks = [];
let ranger;

describe('Range Exception tests', () => {
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

  test('exceptionsNoValues', () => {
    expect.assertions(1);
    return ranger
    .then((RangeClass) => {
      const range = new RangeClass();
      range.init(lazySemverConfig);
      range.setLowerBounds('1.0.0');
      range.setSemverish('1.0.0');
      range.setSemverishArray('1.0.0');
      range.setSemveristElementType('attribute');
      range.setSemver('1.0.0');
      range.setOptions();
      range.setRange();
      range.setExceptions();
      return range.getExceptions();
    })
    .then(obj => expect(obj).toEqual([]));
  });

  test('exceptionOneValueLazy', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init(lazySemverConfig);
        range.setLowerBounds('1.0.0');
        range.setSemverish('1.0.0');
        range.setSemverishArray('1.0.0');
        range.setSemveristElementType('attribute');
        range.setSemver('1.0.0');
        range.setOptions();
        range.setRange();
        range.setExceptions();
        range.addException('1.1.0');
        return range.getExceptions();
      })
      .then(obj => expect(obj).toEqual([
        '1.1.0'
      ]));
  });

  test('exceptionOneValueSemverImplied', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init(tmpConfig);
        range.setLowerBounds('1.0.0');
        range.setSemverish('1.0.0');
        range.setSemverishArray('1.0.0');
        range.setSemveristElementType('attribute');
        range.setSemver('1.0.0');
        range.setOptions();
        range.setRange();
        range.setExceptions();
        range.addException('1.1.0');
        return range.getExceptions();
      })
      .then(obj => expect(obj).toEqual([
        '1.1.0'
      ]));
  });

  test('exceptionOneValueLazyExisting', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init(lazySemverConfig);
        range.setLowerBounds('1.0.0');
        range.setSemverish('1.0.0');
        range.setSemverishArray('1.0.0');
        range.setSemveristElementType('attribute');
        range.setSemver('1.0.0');
        range.setOptions();
        range.setRange();
        range.setExceptions();
        range.addException('1.1.0');
        range.addException('1.1.1');
        return range.getExceptions();
      })
      .then(obj => expect(obj).toEqual([
        '1.1.0'
      ]));
  });

  test('exceptionOneValueSmallerLazyExisting', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init(lazySemverConfig);
        range.setLowerBounds('1.0.0');
        range.setSemverish('1.0.0');
        range.setSemverishArray('1.0.0');
        range.setSemveristElementType('attribute');
        range.setSemver('1.0.0');
        range.setOptions();
        range.setRange();
        range.setExceptions();
        range.addException('1.1.0');
        range.addException('1.0.1');
        return range.getExceptions();
      })
      .then(obj => expect(obj).toEqual([
        '1.0.1'
      ]));
  });

  test('semverImpliedTwoValues', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init(tmpConfig);
        range.setLowerBounds('1.0.0');
        range.setSemverish('1.0');
        range.setSemverishArray('1.0');
        range.setSemveristElementType('attribute');
        range.setSemver('1.0.0');
        range.setOptions();
        range.setRange();
        range.setExceptions();
        range.addException('1.0.1');
        return range.getExceptions();
      })
      .then(obj => expect(obj).toEqual([
        '1.0.1'
      ]));
  });

  test('semverImpliedTwoValuesChildReplacedByParent', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init(tmpConfig);
        range.setLowerBounds('1.0.0');
        range.setSemverish('1');
        range.setSemverishArray('1');
        range.setSemveristElementType('attribute');
        range.setSemver('1.0.0');
        range.setOptions();
        range.setRange();
        range.setExceptions();
        range.addException('1.1.1');
        range.addException('1.1');
        return range.getExceptions();
      })
      .then(obj => expect(obj).toEqual([
        '1.1'
      ]));
  });

  test('semverImpliedTwoValuesParentNotReplacedByChild', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init(tmpConfig);
        range.setLowerBounds('1.0.0');
        range.setSemverish('1');
        range.setSemverishArray('1');
        range.setSemveristElementType('attribute');
        range.setSemver('1.0.0');
        range.setOptions();
        range.setRange();
        range.setExceptions();
        range.addException('1.1');
        range.addException('1.1.1');
        return range.getExceptions();
      })
      .then(obj => expect(obj).toEqual([
        '1.1'
      ]));
  });
});
