const SemveristSuperBase = require('../../../lib/supers/semverist');

const alternateConfig = {
  semveristBehaviors: {
    inheritence: 'lazySemverist',
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

test('init with options', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init(alternateConfig);
  t.context.data = semveristSuperBase.createOptions('attribute');
  expect(t.context.data).toEqual({
    attributeType: 'attribute',
    inheritence: 'lazySemverist'
  });
});
