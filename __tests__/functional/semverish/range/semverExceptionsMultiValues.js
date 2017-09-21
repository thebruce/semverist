'use strict';

const rangeFactory = require('../../../../lib/semverish/range');
const _ = require('lodash');

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

let tmpMocks = [];
let ranger;

describe('Semver Exceptions MultiValues', () => {
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

  test('semverImpliedMultiValues', () => {
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
        range.addException('1.2.1');
        range.addException('1.3');
        range.addException('1.2');
        return range.getExceptions();
      })
      .then(obj => expect(obj).toEqual([
        '1.1',
        '1.2',
        '1.3'
      ]));
  });

  test('semverImpliedThreeoValuesParentNotReplacedByChild', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        const range2 = _.cloneDeep(range);
        range2.init(tmpConfig);
        range2.setLowerBounds('1.0.0');
        range2.setSemverish('1');
        range2.setSemverishArray('1');
        range2.setSemveristElementType('attribute');
        range2.setSemver('1.0.0');
        range2.setOptions();
        range2.setRange();
        range2.setExceptions();
        range2.addException('1.2');
        range2.addException('1.3.1');
        range2.addException('1.4');
        return range2.getExceptions();
      })
      .then(obj => expect(obj).toEqual([
        '1.2',
        '1.3.1',
        '1.4'
      ]));
  });
});
