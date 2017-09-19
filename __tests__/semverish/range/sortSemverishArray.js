const rangeFactory = require('../../../lib/semverish/range');

test('sortSemverishArray', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.sortSemverishArray(
      [
        '2.0.0',
        '1.0.0'
      ]
    );
  });
  expect(t.context.data).toEqual([
    '1.0.0',
    '2.0.0'
  ]);
});

test('sortSemverishArrayMixedSemverish', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.sortSemverishArray(
      [
        '1',
        '1.2',
        '1.1',
        '1.2.1'
      ]
    );
  });
  expect(t.context.data).toEqual([
    '1',
    '1.1',
    '1.2',
    '1.2.1'
  ]);
});

test('sortSemverishArrayWayMixedSemverish', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.sortSemverishArray(
      [
        '1',
        '1.2',
        '1.1',
        '1.5.1',
        '1.2.1',
        '1.3'
      ]
    );
  });
  expect(t.context.data).toEqual([
    '1',
    '1.1',
    '1.2',
    '1.2.1',
    '1.3',
    '1.5.1'
  ]);
});

test('sortSemverishArrayWayMixedSemverishWithEquivs', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.sortSemverishArray(
      [
        '1.0.0',
        '1.0',
        '1.1',
        '1.2',
        '1.1.0',
        '1.2.0',
        '1.3',
        '1.5.1',
        '1'
      ]
    );
  });
  expect(t.context.data).toEqual([
    '1',
    '1.0',
    '1.0.0',
    '1.1',
    '1.1.0',
    '1.2',
    '1.2.0',
    '1.3',
    '1.5.1'
  ]);
});

test('sortSemverishArrayNull', async () => {
  await expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortSemverishArray();
  })).toThrowError('Can not sort a semverish Array that is not actually range.');
});

test('sortSemverishArrayString', async () => {
  await expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortSemverishArray('not a range');
  })).toThrowError('Can not sort a semverish Array that is not actually range.');
});
