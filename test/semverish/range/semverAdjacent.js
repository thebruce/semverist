import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('Semverish1ParentToChild', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.0');
  });
  t.true(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish1ParentTo3Child', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.0.0');
  });
  t.true(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish1ParentTo4Child', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.0.0-alpha');
  });
  t.true(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish1ParentTo2ChildDifferentMinor', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.1');
  });
  t.true(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish1ParentTo2ChildDifferentPatch', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.1.0');
  });
  t.true(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish2ParentToChild', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0', '1.0.0');
  });
  t.true(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish4ParentToChild', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha', '1.0.0-alpha.0');
  });
  t.true(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish5ParentToChild', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha.0', '1.0.0-alpha.0+build123');
  });
  t.true(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish2toNonChild', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1', '1.2');
  });
  t.false(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish3toNonChild', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1.0', '1.1.0-alpha');
  });
  t.false(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish3toEqual', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1.0', '1.1.0');
  });
  t.false(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish3to3', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.0-alpha', '1.0.1');
  });
  t.false(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish1to3', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '1.0.1-alpha');
  });
  t.true(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish4to3', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.1-alpha', '1.0.2-alpha.0');
  });
  t.false(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('Semverish4to5Major', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.1-alpha', '2.0.1-alpha.0');
  });
  t.false(
    t.context.data.child,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('SemverishAdjacent', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.0.0', '1.0.1');
  });
  t.true(
    t.context.data.adjacent,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('SemverishAdjacentMinorLevels', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1', '1.2');
  });
  t.true(
    t.context.data.adjacent,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('SemverishAdjacentMajorLevels', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1', '2');
  });
  t.true(
    t.context.data.adjacent,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('SemverishAdjacentAlphaLevels', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1.1-alpha.0', '1.1.1-alpha.1');
  });
  t.true(
    t.context.data.adjacent,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('SemverishAdjacentPrereleaseLevels', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1.1-alpha', '1.1.1-beta');
  });
  t.false(
    t.context.data.adjacent,
    'Adjacency can only be guaranteed for number sub prereleases.'
  );
});

test('SemverishAdjacentishExplicitLowerDespecifiedHigher', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.2.2', '1.3');
  });
  t.false(
    t.context.data.adjacent,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});

test('SemverishAdjacentishDespecifiedLowerExplicitHigher', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.analyzeSemverishAdjacency('1.1', '1.2.1');
  });
  t.false(
    t.context.data.adjacent,
    'A child path of a parent should return as a child when semverish values are compared.'
  );
});
