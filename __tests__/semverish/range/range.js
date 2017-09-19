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

test('rangeClassNoPlugins', async () => {
  t.context.data = await rangeFactory('semverist')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.sortRangeArray;
  });
  expect(t.context.data).toEqual(undefined);
});

test('lowerBounds', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('1.0.0');
    return rangeClass.getLowerBounds();
  });
  expect(t.context.data).toEqual('1.0.0');
});

test('semverishPlugin', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setSemverish('1.0');
    return rangeClass.getSemverish();
  });
  expect(t.context.data).toEqual('1.0');
});

test('semveristElementPlugin', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setSemveristElement('entity');
    return rangeClass.getSemveristElement();
  });
  expect(t.context.data).toEqual('entity');
});

test('satisfiesRangeWillSatisfy', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.range = '< 1.0.0';
    return rangeClass.satisfiesRange('0.0.9');
  });
  expect(t.context.data).toEqual(true);
});

test('satisfiesRangeCantGetMeNoSatisfaction', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.range = '< 1.0.0';
    return rangeClass.satisfiesRange('2.0.0');
  });
  expect(t.context.data).toEqual(false);
});

test('setRangeGetRange', async () => {
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
  expect(t.context.data).toEqual('>=1.0.0-alpha <1.0.0');
});

test('setRangeNoUpperNoElement', async () => {
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
  expect(t.context.data).toEqual('>=1.0.0-alpha <1.0.0');
});

test('SetRangeNoLowerBounds', async () => {
  await expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.setRange();
  })).toThrowError('Can not create a range without a lower bounds value.');
});

test('setSemveristRange', async () => {
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


test('sortRangeArrayString', async () => {
  await expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortRangeArray('not a range');
  })).toThrowError('Can not sort a range Array that is not a range.');
});

test('testForFinalItem', async () => {
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
  expect(t.context.data).toEqual(true);
});

test('sortRangeArrayStringThrow', async () => {
  await expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortRangeArray('not a range');
  })).toThrowError('Can not sort a range Array that is not a range.');
});
