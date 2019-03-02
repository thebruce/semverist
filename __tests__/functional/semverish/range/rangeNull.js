const rangeFactory = require('../../../../lib/semverish/range');

const tmpConfig = {
  semveristBehaviors: {
    inheritence: null,
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
describe('Range null tests.', () => {
  test('setSemveristRangeNull', () => {
    expect.assertions(1);
    return rangeFactory('semverist', 'range')
      .then(RangeClass => {
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
      .then(obj => expect(obj).toMatchSnapshot());
  });
});
