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

test('rangeClassNoPlugins', async (t) => {
  t.context.data = await rangeFactory('semverist')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.sortRangeArray;
  });
  t.deepEqual(
    t.context.data,
    undefined,
    'Range class with no plugins should not have access to plugin functions.'
  );
});

test('lowerBounds', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('1.0.0');
    return rangeClass.getLowerBounds();
  });
  t.deepEqual(
    t.context.data,
    '1.0.0',
    'Semverish get should return from semverish set.'
  );
});

test('semverishPlugin', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setSemverish('1.0');
    return rangeClass.getSemverish();
  });
  t.deepEqual(
    t.context.data,
    '1.0',
    'Semverish get should return from semverish set.'
  );
});

test('semveristElementPlugin', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setSemveristElement('entity');
    return rangeClass.getSemveristElement();
  });
  t.deepEqual(
    t.context.data,
    'entity',
    'Semverish get should return from semverish set.'
  );
});

test('satisfiesRangeWillSatisfy', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.range = '< 1.0.0';
    return rangeClass.satisfiesRange('0.0.9');
  });
  t.deepEqual(
    t.context.data,
    true,
    'Semverish get should return from semverish set.'
  );
});

test('satisfiesRangeCantGetMeNoSatisfaction', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.range = '< 1.0.0';
    return rangeClass.satisfiesRange('2.0.0');
  });
  t.deepEqual(
    t.context.data,
    false,
    'Semverish get should return from semverish set.'
  );
});

test('setRangeGetRange', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const ranger = new RangeClass();
    ranger.init();
    ranger.setLowerBounds('1.0.0-alpha');
    ranger.setSemveristElement('entity');
    ranger.setSemverish('1.0.0-alpha');
    ranger.setSemverishArray('1.0.0-alpha');
    ranger.setSemver('1.0.0-alpha.0');
    ranger.setOptions();
    ranger.setRange();
    return ranger.getRange();
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0-alpha <1.0.0',
    'Semverist Objects at max level are a pass through.'
  );
});

test('setRangeNoUpperNoElement', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
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
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0-alpha <1.0.0',
    'Semverist Objects at max level are a pass through.'
  );
});

test('SetRangeNoLowerBounds', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.setRange();
  }),
  'Can not create a range without a lower bounds value.'
  );
});

test('setSemveristRange', async (t) => {
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
  t.deepEqual(
    t.context.data,
    {
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
    },
    'Semverist Objects at max level are a pass through.'
  );
});


test('sortRangeArrayString', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortRangeArray('not a range');
  }),
  'Can not sort a range Array that is not a range.'
  );
});

test('testForFinalItem', async (t) => {
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
    return range.testFinalItemAgainstRangeSemverish('1.1.1', '1.1.1');
  });
  t.deepEqual(
    t.context.data,
    true,
    'Semverist Objects at max level are a pass through.'
  );
});

test('sortRangeArrayStringThrow', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortRangeArray('not a range');
  }),
  'Can not sort a range Array that is not a range.'
  );
});
