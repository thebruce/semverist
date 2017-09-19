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

// Set Defaults for semverist objects.
const lazySemverConfig = {
  semveristBehaviors: {
    inheritence: 'lazySemverist',
    lazySemverist: {
      attribute: true,
      preReleaseForwards: true
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

test('exceptionsNoValues', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init(lazySemverConfig);
    range.setLowerBounds('1.0.0');
    range.setSemverish('1.0.0');
    range.setSemverishArray('1.0.0');
    range.setSemveristElementType('attribute');
    range.setSemver('1.0.0');
    range.setOptions();
    range.setRange();
    range.setExceptions();
    return range.getExceptions();
  });
  expect(t.context.data).toEqual([]);
});

test('exceptionOneValueLazy', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init(lazySemverConfig);
    range.setLowerBounds('1.0.0');
    range.setSemverish('1.0.0');
    range.setSemverishArray('1.0.0');
    range.setSemveristElementType('attribute');
    range.setSemver('1.0.0');
    range.setOptions();
    range.setRange();
    range.setExceptions();
    range.addException('1.1.0');
    return range.getExceptions();
  });
  expect(t.context.data).toEqual([
    '1.1.0'
  ]);
});

test('exceptionOneValueSemverImplied', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init(tmpConfig);
    range.setLowerBounds('1.0.0');
    range.setSemverish('1.0.0');
    range.setSemverishArray('1.0.0');
    range.setSemveristElementType('attribute');
    range.setSemver('1.0.0');
    range.setOptions();
    range.setRange();
    range.setExceptions();
    range.addException('1.1.0');
    return range.getExceptions();
  });
  expect(t.context.data).toEqual([
    '1.1.0'
  ]);
});

test('exceptionOneValueLazyExisting', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init(lazySemverConfig);
    range.setLowerBounds('1.0.0');
    range.setSemverish('1.0.0');
    range.setSemverishArray('1.0.0');
    range.setSemveristElementType('attribute');
    range.setSemver('1.0.0');
    range.setOptions();
    range.setRange();
    range.setExceptions();
    range.addException('1.1.0');
    range.addException('1.1.1');
    return range.getExceptions();
  });
  expect(t.context.data).toEqual([
    '1.1.0'
  ]);
});

test('exceptionOneValueSmallerLazyExisting', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init(lazySemverConfig);
    range.setLowerBounds('1.0.0');
    range.setSemverish('1.0.0');
    range.setSemverishArray('1.0.0');
    range.setSemveristElementType('attribute');
    range.setSemver('1.0.0');
    range.setOptions();
    range.setRange();
    range.setExceptions();
    range.addException('1.1.0');
    range.addException('1.0.1');
    return range.getExceptions();
  });
  expect(t.context.data).toEqual([
    '1.0.1'
  ]);
});

test('semverImpliedTwoValues', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init(tmpConfig);
    range.setLowerBounds('1.0.0');
    range.setSemverish('1.0');
    range.setSemverishArray('1.0');
    range.setSemveristElementType('attribute');
    range.setSemver('1.0.0');
    range.setOptions();
    range.setRange();
    range.setExceptions();
    range.addException('1.0.1');
    return range.getExceptions();
  });
  expect(t.context.data).toEqual([
    '1.0.1'
  ]);
});

test('semverImpliedTwoValuesChildReplacedByParent', async () => {
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
    range.addException('1.1.1');
    range.addException('1.1');
    return range.getExceptions();
  });
  expect(t.context.data).toEqual([
    '1.1'
  ]);
});

test('semverImpliedTwoValuesParentNotReplacedByChild', async () => {
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
    range.addException('1.1.1');
    return range.getExceptions();
  });
  expect(t.context.data).toEqual([
    '1.1'
  ]);
});
