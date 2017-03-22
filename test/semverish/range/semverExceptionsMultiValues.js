import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');
const _ = require('lodash');

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

test.serial('semverImpliedMultiValues', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const ranger = new RangeClass();
    ranger.init(tmpConfig);
    ranger.setLowerBounds('1.0.0');
    ranger.setSemverish('1');
    ranger.setSemverishArray('1');
    ranger.setSemveristElementType('attribute');
    ranger.setSemver('1.0.0');
    ranger.setOptions();
    ranger.setRange();
    ranger.setExceptions();
    ranger.addException('1.1');
    ranger.addException('1.2.1');
    ranger.addException('1.3');
    ranger.addException('1.2');
    return ranger.getExceptions();
  });
  t.deepEqual(
    t.context.data,
    [
      '1.1',
      '1.2',
      '1.3'
    ],
    'Lazy semver should be able to add lower semver items.'
  );
});

test.serial('semverImpliedThreeoValuesParentNotReplacedByChild', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    const range2 = _.cloneDeep(range);
    range2.init(tmpConfig);
    range2.setLowerBounds('1.0.0');
    range2.setSemverish('1');
    range2.setSemverishArray('1');
    range2.setSemveristElementType('attribute');
    range2.setSemver('1.0.0');
    range2.setOptions();
    range2.setRange();
    range2.setExceptions();
    range2.addException('1.2');
    range2.addException('1.3.1');
    range2.addException('1.4');
    return range2.getExceptions();
  });
  t.deepEqual(
    t.context.data,
    [
      '1.2',
      '1.3.1',
      '1.4'
    ],
    'Lazy semver should be able to add lower semver items.'
  );
});
