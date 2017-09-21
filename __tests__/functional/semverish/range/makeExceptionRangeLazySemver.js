'use strict';

const rangeFactory = require('../../../../lib/semverish/range');
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

let ranger;
let tmpMocks = [];

describe('Make Exception Range for Lazy Semver', () => {
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

  test('lazySemver', () => {
    const thing = [];
    thing.push(ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init(lazySemverConfig);
        range.setLowerBounds('1.0.0');
        range.setSemverish('1');
        range.setSemverishArray('1');
        range.setSemveristElementType('attribute');
        range.setSemver('1.0.0');
        range.setOptions();
        range.setRange();
        range.setExceptions();
        range.addException('1.7');
        return range.makeExceptionRange();
      }));
    expect(thing[0]).resolves.toEqual('<1.7.0');
  });
});
