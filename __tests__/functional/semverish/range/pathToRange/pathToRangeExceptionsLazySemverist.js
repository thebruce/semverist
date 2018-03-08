

const rangeFactory = require('../../../../../lib/semverish/range');

// Set Defaults for semverist objects.
const tmpConfig = {
  semveristBehaviors: {
    inheritence: 'lazySemverist',
    lazySemverist: {
      attribute: true,
      preReleaseForwards: true,
    },
    default: true,
    defaultName: 'default',
    groups: true,
    mergeStrategy: 'lastIn',
    preReleasePattern: /\d-[a-zA-Z]*/g,
  },
  groups: {},
  prereleaseOrdering: {},
};

let tmpMocks = [];

describe('Path to Range with Exceptions using lazy semverist.', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('exceptionRangeSixValuesWithMinorMerge', () => {
    expect.assertions(1);
    return rangeFactory('semverist', 'range')
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
        range.addException('1.2.2');
        range.addException('1.3');
        range.addException('1.4');
        range.addException('1.4.1');
        return range.pathToRange(
          '1', {
            attributeType: 'attribute',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.0.0 <1.1.0'));
  });
});
