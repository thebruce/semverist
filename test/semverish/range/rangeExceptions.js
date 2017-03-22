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

test.serial('exceptionsNoValues', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [],
    'Exceptions should have no values.'
  );
});

test.serial('exceptionOneValueLazy', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [
      '1.1.0'
    ],
    'Lazy or Semver Implied inheritence should be able to add 1 exception to an empty exceptions.'
  );
});

test.serial('exceptionOneValueSemverImplied', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [
      '1.1.0'
    ],
    'Lazy or Semver Implied inheritence should be able to add 1 exception to an empty exceptions.'
  );
});

test.serial('exceptionOneValueLazyExisting', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [
      '1.1.0'
    ],
    'Lazy semver can not add a higher exception to range exceptions.'
  );
});

test.serial('exceptionOneValueSmallerLazyExisting', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [
      '1.0.1'
    ],
    'Lazy semver should be able to add lower semver items.'
  );
});

test.serial('outsideRange', async (t) => {
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
    range.addException('2.1.0');
    return range.getExceptions();
  });
  t.deepEqual(
    t.context.data,
    [],
    'Lazy semver should be able to add lower semver items.'
  );
});

test.serial('semverImpliedTwoValues', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [
      '1.0.1'
    ],
    'Lazy semver should be able to add lower semver items.'
  );
});

test.serial('semverImpliedTwoValuesChildReplacedByParent', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [
      '1.1'
    ],
    'Lazy semver should be able to add lower semver items.'
  );
});

test.serial('semverImpliedTwoValuesParentNotReplacedByChild', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [
      '1.1'
    ],
    'Lazy semver should be able to add lower semver items.'
  );
});
