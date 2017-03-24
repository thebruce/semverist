import test from 'ava';

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

test.serial('exceptionRangeOneValue', async (t) => {
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
  t.deepEqual(
    t.context.data,
    '<1.1.0 >=1.2.0',
    'Exceptions should have no values.'
  );
});

test.serial('exceptionRangeThreeValuesTwoAdjacent', async (t) => {
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
  t.deepEqual(
    t.context.data,
    '<1.1.0 >1.2.0 <1.2.1 >1.2.2',
    'Exceptions should have no values.'
  );
});


test.serial('exceptionRangeSixValuesFourAdjacent', async (t) => {
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
  t.deepEqual(
    t.context.data,
    '<1.1.0 >1.2.0 <1.2.1 >1.2.2 <1.3.0 >1.4.1',
    'Exceptions should have no values.'
  );
});

test.serial('exceptionRangeSixValuesWithMinorMerge', async (t) => {
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
  t.deepEqual(
    t.context.data,
    '<1.1.0 >1.2.0 <1.2.1 >1.2.2 <1.3.0 >=1.5.0',
    'Exceptions should have no values.'
  );
});

test.serial('no exceptions', async (t) => {
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
  t.deepEqual(
    t.context.data,
    null,
    'Exceptions should have no values.'
  );
});
