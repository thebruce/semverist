'use strict';

const SemveristSuperBase = require('../../../../lib/supers/semverist');

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
  expect.assertions(1);
  semveristSuperBase.init(alternateConfig);
  expect(semveristSuperBase.createOptions('attribute'))
    .toEqual({
      attributeType: 'attribute',
      inheritence: 'lazySemverist'
    });
});
