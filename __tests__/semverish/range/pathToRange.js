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

test('pathToRangePathZeroLength', async () => {
  await expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.pathToRange('');
  })).toThrowError('The path must have atleast a single major component.');
});

test('pathToRangeInheritenceNull', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.pathToRange('1.0.0', {inheritence: null});
  });
  expect(t.context.data).toEqual('1.0.0');
});

test('semveristObjectTestsMaxLevel3', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.pathToRange(
      '1.0.0', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('1.0.0');
});

test('semveristObjectTestsMaxLevel4', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.pathToRange(
      '1.0.0-alpha.0+124', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('1.0.0-alpha.0');
});

test('semveristObjectTestsPartial1', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    range.setSemverish('1');
    range.setSemverParsed('1.0.0');
    return range.pathToRange(
      '1', {attributeType: 'semveristObject', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=1.0.0 <2.0.0');
});

test('semveristObjectTestsPartial2', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.pathToRange(
      '1.0', {attributeType: 'semveristObject', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=1.0.0 <1.1.0');
});

test('semveristObjectTestsAlpha', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    range.setLowerBounds('1.0.0-alpha.1');
    range.setSemverish('1.0.0-alpha.1.entity');
    range.setSemverishArray('1.0.0-alpha.1');
    range.setSemverParsed('1.0.0-alpha.1');
    range.setSemver('1.0.0-alpha.1');
    return range.pathToRange(
      '1.0.0-alpha.1', {attributeType: 'semveristObject', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=1.0.0-alpha.1 <1.0.0');
});

test('semverImpliedTestsMaxLevel3', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.pathToRange(
      '1.0.0', {attributeType: 'attribute', inheritence: 'semverImplied'}
    );
  });
  expect(t.context.data).toEqual('1.0.0');
});

test('semverImpliedTestsMaxLevel4', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.pathToRange(
      '1.0.0-alpha+124', {attributeType: 'attribute', inheritence: 'semverImplied'}
    );
  });
  expect(t.context.data).toEqual('1.0.0-alpha');
});

test('semverImpliedTestsPartial1', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.pathToRange(
      '1', {attributeType: 'attribute', inheritence: 'semverImplied'}
    );
  });
  expect(t.context.data).toEqual('>=1.0.0 <2.0.0');
});

test('semverImpliedTestsPartial2', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.pathToRange(
      '1.0', {attributeType: 'attribute', inheritence: 'semverImplied'}
    );
  });
  expect(t.context.data).toEqual('>=1.0.0 <1.1.0');
});

test('semverImpliedTestsAlpha', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    range.setLowerBounds('1.0.0-alpha.1');
    range.setSemverish('1.0.0-alpha.1');
    range.setSemverishArray('1.0.0-alpha.1');
    range.setSemver('1.0.0-alpha.1');
    return range.pathToRange(
      '1.0.0-alpha.1', {attributeType: 'attribute', inheritence: 'semverImplied'}
    );
  });
  expect(t.context.data).toEqual('>=1.0.0-alpha.1 <1.0.0');
});

test('toTildeRange', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.toTildeRange('1.0');
  });
  expect(t.context.data).toEqual('>=1.0.0 <1.1.0');
});

test('pathHasPrereleaseWithForwardingLeading0FullSemver', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();

    range.init(lazySemverConfig);
    range.setOptions();
    range.setSemveristConfig(lazySemverConfig);
    range.setSemverParsed('0.1.0-alpha.1');
    range.setSemver('0.1.0-alpha.1');
    range.setSemverishArray('0.1.0-alpha.1');

    return range.pathToRange(
      '0.1.0-alpha.1', {attributeType: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=0.1.0-alpha.1 <0.1.0 >=0.1.0 <1.0.0');
});

test('pathHasPrereleaseWithForwardingLeadingNonZeroFullSemver', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('1.1.0-alpha.1');
    range.setSemverishArray('1.1.0-alpha.1');
    range.setSemveristConfigItem(
      'semveristBehaviors.lazySemverist.preReleaseForwards',
      true
    );
    return range.pathToRange(
      '1.1.0-alpha.1', {attributeType: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=1.1.0-alpha.1 <1.1.0 >=1.1.0 <2.0.0');
});

test('pathHasPrereleaseWithForwardingLeadingZeroPartialSemver', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('0.1.0-alpha');
    range.setSemver('0.1.0-alpha');
    range.setSemverishArray('0.1.0-alpha');
    range.setSemveristConfigItem(
      'semveristBehaviors.lazySemverist.preReleaseForwards',
      true
    );
    return range.pathToRange(
      '0.1.0-alpha', {attributeType: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=0.1.0-alpha <0.1.0 >=0.1.0 <1.0.0');
});

test('pathHasPrereleaseWithForwardingLeadingNonZeroPartialSemver', async () => {
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
      '1.1.0-alpha', {attributeType: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=1.1.0-alpha <1.1.0 >=1.1.0 <2.0.0');
});

test('pathHasPrereleaseNoForwarding', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('1.1.0-alpha.1');
    range.setSemverishArray('1.1.0-alpha.1');
    return range.pathToRange(
      '1.1.0-alpha.1', {attributeType: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=1.1.0-alpha.1 <1.1.0');
});


test('lazySemveristNoPrerelease3Long', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('1.1.0');
    range.setSemver('1.1.0');
    range.setSemverishArray('1.1.0');
    return range.pathToRange(
      '1.1.0', {attributeType: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=1.1.0 <2.0.0');
});

test('lazySemveristNoPrerelease3LongLeadingZero', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('0.1.0');
    range.setSemverishArray('0.1.0');
    return range.pathToRange(
      '0.1.0', {attributeType: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=0.1.0 <1.0.0');
});

test('lazySemveristNoPrerelease2Long', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('1.1.0');
    range.setSemverishArray('1.1');
    return range.pathToRange(
      '1.1', {attributeType: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=1.1.0 <2.0.0');
});

test('lazySemveristNoPrerelease1Long', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemveristConfig(tmpConfig);
    range.setSemverParsed('1.0.0');
    range.setSemverishArray('1');
    return range.pathToRange(
      '1', {attributeType: 'attribute', inheritence: 'lazySemverist'}
    );
  });
  expect(t.context.data).toEqual('>=1.0.0 <2.0.0');
});
