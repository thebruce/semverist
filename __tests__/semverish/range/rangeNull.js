const rangeFactory = require('../../../lib/semverish/range');

const tmpConfig = {
  semveristBehaviors: {
    inheritence: null,
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

test('setSemveristRangeNull', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
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
  });
  expect(t.context.data).toEqual({
    adjustedExceptions: [],
    lowerBounds: '1.0.0',
    semveristElement: 'entity',
    semveristElementType: 'attribute',
    semverishValue: '1',
    exceptionRange: null,
    exceptions: [],
    range: '1.0.0',
    terminalBounds: '<2.0.0'
  });
});
