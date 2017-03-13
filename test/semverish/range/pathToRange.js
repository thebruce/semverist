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

test('pathToRangePathZeroLength', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange('');
  }),
  'The path must have atleast a single major component.');
});

test('pathToRangeOptionsNoInheritence', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange('1', {});
  }),
  'The options object must have inheritence defined even if its value is null.');
});

test('pathToRangeOptionsBadInheritence', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange('1', {inheritence: 'bad'});
  }),
  String.prototype.concat('The options inheritence attribute must one of the following values:',
  ' semverImplied, undefined, or lazySemverist'
  ));
});

test('pathToRangeInheritenceNull', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange('1.0.0', {inheritence: null});
  });
  t.deepEqual(
    t.context.data,
    '1.0.0',
    'Null inheritence value means that we have a direct pass through.'
  );
});

test('semveristObjectTestsMaxLevel3', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange(
      '1.0.0', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '1.0.0',
    'Semverist Objects at max level are a pass through.'
  );
});

test('semveristObjectTestsMaxLevel4', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange(
      '1.0.0-alpha.0+124', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '1.0.0-alpha.0+124',
    'Semverist Objects at max level are a pass through.'
  );
});

test('semveristObjectTestsPartial1', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange(
      '1', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <2.0.0',
    'Semverist Objects with 1 object should be set to ~x'
  );
});

test('semveristObjectTestsPartial2', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange(
      '1.0', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <1.1.0',
    'Semverist Objects with 2 objects should be set to ~x.y'
  );
});

test('semveristObjectTestsAlpha', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange(
      '1.0.0-alpha.1', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0-alpha.1 <1.1.0',
    'Semverist Objects with 3 objects and prerelease should be set to ~x.y.z-[0-9A-Za-z]'
  );
});

test('semverImpliedTestsMaxLevel3', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange(
      '1.0.0', {attribute: 'attribute', inheritence: 'semverImplied'}
    );
  });
  t.deepEqual(
    t.context.data,
    '1.0.0',
    'Semverist Objects at max level are a pass through.'
  );
});

test('semverImpliedTestsMaxLevel4', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange(
      '1.0.0-alpha.0+124', {attribute: 'attribute', inheritence: 'semverImplied'}
    );
  });
  t.deepEqual(
    t.context.data,
    '1.0.0-alpha.0+124',
    'Semverist Objects at max level are a pass through.'
  );
});

test('semverImpliedTestsPartial1', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange(
      '1', {attribute: 'attribute', inheritence: 'semverImplied'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <2.0.0',
    'Semverist Objects with 1 object should be set to ~x'
  );
});

test('semverImpliedTestsPartial2', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange(
      '1.0', {attribute: 'attribute', inheritence: 'semverImplied'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <1.1.0',
    'Semverist Objects with 2 objects should be set to ~x.y'
  );
});

test('semverImpliedTestsAlpha', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange(
      '1.0.0-alpha.1', {attribute: 'attribute', inheritence: 'semverImplied'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0-alpha.1 <1.1.0',
    'Semverist Objects with 3 objects and prerelease should be set to ~x.y.z-[0-9A-Za-z]'
  );
});

test('toTildeRange', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.toTildeRange('1.0');
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <1.1.0',
    'Tilde values should pass back the correct range'
  );
});

test('pathHasPrereleaseWithForwardingLeading0FullSemver', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('0.1.0-alpha.1');
    range.setSemverishArray('0.1.0-alpha.1');
    range.setSemveristConfigItem(
      'semveristBehaviors.lazySemverist.preReleaseForwards',
      true
    );
    return range.pathToRange(
      '0.1.0-alpha.1', {attribute: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=0.1.0-alpha.1 <1.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('pathHasPrereleaseWithForwardingLeadingNonZeroFullSemver', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('1.1.0-alpha.1');
    range.setSemverishArray('1.1.0-alpha.1');
    range.setSemveristConfigItem(
      'semveristBehaviors.lazySemverist.preReleaseForwards',
      true
    );
    return range.pathToRange(
      '1.1.0-alpha.1', {attribute: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.1.0-alpha.1 <2.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('pathHasPrereleaseWithForwardingLeadingZeroPartialSemver', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('0.1.0-alpha');
    range.setSemverishArray('0.1.0-alpha');
    range.setSemveristConfigItem(
      'semveristBehaviors.lazySemverist.preReleaseForwards',
      true
    );
    return range.pathToRange(
      '0.1.0-alpha', {attribute: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=0.1.0-alpha.0 <1.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('pathHasPrereleaseWithForwardingLeadingNonZeroPartialSemver', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('1.1.0-alpha');
    range.setSemverishArray('1.1.0-alpha');
    range.setSemveristConfigItem(
      'semveristBehaviors.lazySemverist.preReleaseForwards',
      true
    );
    return range.pathToRange(
      '1.1.0-alpha', {attribute: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.1.0-alpha <2.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('pathHasPrereleaseNoForwarding', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('1.1.0-alpha.1');
    range.setSemverishArray('1.1.0-alpha.1');
    return range.pathToRange(
      '1.1.0-alpha.1', {attribute: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.1.0-alpha.1 <1.2.0',
    'Tilde values should pass back the correct range'
  );
});


test('lazySemveristNoPrerelease3Long', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('1.1.0');
    range.setSemverishArray('1.1.0');
    return range.pathToRange(
      '1.1.0', {attribute: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.1.0 <2.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('lazySemveristNoPrerelease3LongLeadingZero', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('0.1.0');
    range.setSemverishArray('0.1.0');
    return range.pathToRange(
      '0.1.0', {attribute: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=0.1.0 <1.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('lazySemveristNoPrerelease2Long', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('1.1.0');
    range.setSemverishArray('1.1');
    return range.pathToRange(
      '1.1', {attribute: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.1.0 <2.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('lazySemveristNoPrerelease1Long', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('1.0.0');
    range.setSemverishArray('1');
    return range.pathToRange(
      '1', {attribute: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <2.0.0',
    'Tilde values should pass back the correct range'
  );
});
