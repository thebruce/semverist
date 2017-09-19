const rangeFactory = require('../../../lib/semverish/range');

test('Semverish1ParentToChild', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.0');
  });
  expect(t.context.data.child).toBe(true);
});

test('Semverish1ParentTo3Child', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.0.0');
  });
  expect(t.context.data.child).toBe(true);
});

test('Semverish1ParentTo4Child', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.0.0-alpha');
  });
  expect(t.context.data.child).toBe(true);
});

test('Semverish1ParentTo2ChildDifferentMinor', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.1');
  });
  expect(t.context.data.child).toBe(true);
});

test('Semverish1ParentTo2ChildDifferentPatch', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.1.0');
  });
  expect(t.context.data.child).toBe(true);
});

test('Semverish2ParentToChild', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0', '1.0.0');
  });
  expect(t.context.data.child).toBe(true);
});

test('Semverish4ParentToChild', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha', '1.0.0-alpha.0');
  });
  expect(t.context.data.child).toBe(true);
});

test('Semverish4ParentToNonAdjacent5Child', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha', '1.0.0-beta.0');
  });
  expect(t.context.data.child).toBe(false);
});

test('Semverish76ParentToChild', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha.0', '1.0.0-alpha.1');
  });
  expect(t.context.data.child).toBe(false);
});

test('adjacentPrereleasesDifferentGreek', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha.0', '1.0.0-beta.1');
  });
  expect(t.context.data.adjacent).toBe(false);
});


test('Semverish5ParentToChild', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha.0', '1.0.0-alpha.0+build123');
  });
  expect(t.context.data.child).toBe(true);
});

test('Semverish2toNonChild', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1', '1.2');
  });
  expect(t.context.data.child).toBe(false);
});

test('Semverish3toNonChild', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1.0', '1.1.0-alpha');
  });
  expect(t.context.data.child).toBe(false);
});

test('Semverish3toEqual', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1.0', '1.1.0');
  });
  expect(t.context.data.child).toBe(false);
});

test('Semverish3to3', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha', '1.0.1');
  });
  expect(t.context.data.child).toBe(false);
});

test('Semverish1to3', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.0.1-alpha');
  });
  expect(t.context.data.child).toBe(true);
});

test('Semverish4to3', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.1-alpha', '1.0.2-alpha.0');
  });
  expect(t.context.data.child).toBe(false);
});

test('Semverish4to5Major', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.1-alpha', '2.0.1-alpha.0');
  });
  expect(t.context.data.child).toBe(false);
});

test('SemverishAdjacent', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.0', '1.0.1');
  });
  expect(t.context.data.adjacent).toBe(true);
});

test('SemverishAdjacentMinorLevels', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1', '1.2');
  });
  expect(t.context.data.adjacent).toBe(true);
});

test('SemverishAdjacentMajorLevels', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '2');
  });
  expect(t.context.data.adjacent).toBe(true);
});

test('SemverishAdjacentAlphaLevels', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1.1-alpha.0', '1.1.1-alpha.1');
  });
  expect(t.context.data.adjacent).toBe(true);
});

test('SemverishAdjacentPrereleaseLevels', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1.1-alpha', '1.1.1-beta');
  });
  expect(t.context.data.adjacent).toBe(false);
});

test('SemverishAdjacentishExplicitLowerDespecifiedHigher', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.2.2', '1.3');
  });
  expect(t.context.data.adjacent).toBe(false);
});

test('SemverishAdjacentishDespecifiedLowerExplicitHigher', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1', '1.2.1');
  });
  expect(t.context.data.adjacent).toBe(false);
});
