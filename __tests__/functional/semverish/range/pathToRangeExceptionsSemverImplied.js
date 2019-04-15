const rangeFactory = require('../../../../lib/semverish/range');

const tmpConfig = {
  semveristBehaviors: {
    inheritence: 'semverImplied',
    lazySemverist: {
      attribute: true,
      preReleaseForwards: false,
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
let ranger;

describe('Path to range exceptions semver Implied.', () => {
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

  test('exceptionRangeSixValuesWithMinorMerge', () => {
    expect.assertions(1);
    return ranger
      .then(RangeClass => {
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
        return range.pathToRange('1', {
          attributeType: 'attribute',
          inheritence: 'semverImplied',
        });
      })
      .then(obj =>
        expect(obj).toEqual(
          '>=1.0.0 <1.1.0 >=1.2.0 <1.2.1 >1.2.2 <1.3.0 >=1.5.0 <2.0.0'
        )
      );
  });
});
