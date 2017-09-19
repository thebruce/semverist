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

test('exceptionRangeOneValue', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
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
    return range.makeExceptionRange();
  });
  expect(t.context.data).toEqual('<1.1.0 >=1.2.0');
});

test('exceptionRangeThreeValuesTwoAdjacent', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
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
    return range.makeExceptionRange();
  });
  expect(t.context.data).toEqual('<1.1.0 >=1.2.0 <1.2.1 >1.2.2');
});


test('exceptionRangeSixValuesFourAdjacent', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
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
    range.addException('1.4.0');
    range.addException('1.4.1');
    return range.makeExceptionRange();
  });
  expect(t.context.data).toEqual('<1.1.0 >=1.2.0 <1.2.1 >1.2.2 <1.3.0 >1.4.1');
});

test('exceptionRangeSixValuesWithMinorMerge', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
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
    return range.makeExceptionRange();
  });
  expect(t.context.data).toEqual('<1.1.0 >=1.2.0 <1.2.1 >1.2.2 <1.3.0 >=1.5.0');
});

test('no exceptions', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
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
    return range.makeExceptionRange();
  });
  expect(t.context.data).toEqual(null);
});

test('exceptionRangeSameValuewWithAdjacents', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
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
    range.addException('1.0');
    range.addException('1.1');
    range.addException('1.1.1');
    range.addException('1.2.0');
    range.addException('1.4');
    range.addException('1.5.1');
    range.setRange();
    range.setSemveristRange();
    return range.getSemveristRange();
  });
  expect(t.context.data.range).toEqual('>=1.2.1 <1.4.0 >=1.5.0 <1.5.1 >=1.5.2 <2.0.0');
});
