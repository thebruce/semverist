'use strict';

const rangeFactory = require('../../../lib/semverish/range');

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

  test('rangeClassNoPlugins', () => {
    expect(rangeFactory('semverist')
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        return rangeClass.sortRangeArray;
      }))
      .resolves.toEqual(undefined);
  });

  test('lowerBounds', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.setLowerBounds('1.0.0');
        return rangeClass.getLowerBounds();
      }))
      .resolves.toEqual('1.0.0');
  });

  test('semverishPlugin', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.setSemverish('1.0');
        return rangeClass.getSemverish();
      }))
      .resolves.toEqual('1.0');
  });

  test('semveristElementPlugin', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.setSemveristElement('entity');
        return rangeClass.getSemveristElement();
      }))
      .resolves.toEqual('entity');
  });

  test('satisfiesRangeWillSatisfy', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.range = '< 1.0.0';
        return rangeClass.satisfiesRange('0.0.9');
      }))
      .resolves.toEqual(true);
  });

  test('satisfiesRangeCantGetMeNoSatisfaction', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.range = '< 1.0.0';
        return rangeClass.satisfiesRange('2.0.0');
      }))
      .resolves.toEqual(false);
  });

  test('setRangeGetRange', () => {
    expect(ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setLowerBounds('1.0.0-alpha');
        range.setSemveristElement('entity');
        range.setSemverish('1.0.0-alpha');
        range.setSemverishArray('1.0.0-alpha');
        range.setSemver('1.0.0-alpha.0');
        range.setOptions();
        range.setRange();
        return range.getRange();
      }))
      .resolves.toEqual('>=1.0.0-alpha <1.0.0');
  });

  test('setRangeNoUpperNoElement', () => {
    expect(ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setLowerBounds('1.0.0-alpha');
        range.setSemverish('1.0.0-alpha');
        range.setSemverishArray('1.0.0-alpha');
        range.setSemver('1.0.0-alpha.0');
        range.setOptions();
        range.setRange();
        return range.getRange();
      }))
      .resolves.toEqual('>=1.0.0-alpha <1.0.0');
  });

  test('SetRangeNoLowerBounds', () => {
    rangeFactory('semverist', 'range')
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        return range.setRange();
      })
      .catch((e) => {
        expect(e.message).toEqual('Can not create a range without a lower bounds value.');
      });
  });

  test('setSemveristRange', () => {
    expect(ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init(tmpConfig);
        range.setOptions();
        range.setLowerBounds('1.0.0');
        range.setSemveristElement('entity');
        range.setSemveristElementType('attribute');
        range.setSemverish('1');
        range.setSemverishArray('1');
        range.setSemver('1.0.0');
        range.setExceptions();
        range.addException('1.1');
        range.setRange();
        range.setTerminalBounds('<2.0.0');
        range.setSemveristRange();
        return range.getSemveristRange();
      })
    )
    .resolves.toEqual({
      adjustedExceptions: [
        '1.1'
      ],
      lowerBounds: '1.0.0',
      semveristElement: 'entity',
      semveristElementType: 'attribute',
      semverishValue: '1',
      exceptionRange: '<1.1.0 >=1.2.0',
      exceptions: [
        '1.1'
      ],
      range: '>=1.0.0 <1.1.0 >=1.2.0 <2.0.0',
      terminalBounds: '<2.0.0'
    });
  });


  test('sortRangeArrayString', () => {
    rangeFactory('semverist', 'range')
      .then((RangeClass) => {
        const range = new RangeClass();
        return range.sortRangeArray('not a range');
      })
      .catch((e) => {
        expect(e.message).toEqual('Can not sort a range Array that is not a range.');
      });
  });

  test('testForFinalItem', () => {
    expect(ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init(tmpConfig);
        range.setOptions();
        range.setLowerBounds('1.0.0');
        range.setSemveristElement('entity');
        range.setSemveristElementType('attribute');
        range.setSemverish('1');
        range.setSemverishArray('1');
        range.setSemver('1.0.0');
        range.setExceptions();
        range.addException('1.1');
        range.setRange();
        range.setTerminalBounds('<2.0.0');
        range.setSemveristRange();
        return range.testFinalItemAgainstRangeSemverish('1.1.1', '1.1.1');
      })).resolves.toEqual(true);
  });

  test('sortRangeArrayStringThrow', () => {
    ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        return range.sortRangeArray('not a range');
      })
      .catch((e) => {
        expect(e.message).toEqual('Can not sort a range Array that is not a range.');
      });
  });
});
