const SemveristSuperBase = require('../../../lib/supers/semverist');

test('optionsSemveristObjectDefaults', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('semveristObject');
  expect(t.context.data).toEqual({
    attributeType: 'semveristObject',
    inheritence: null
  });
});

test('optionsSemveristGroupsDefaults', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('group');
  expect(t.context.data).toEqual({
    attributeType: 'group',
    inheritence: 'semverImplied'
  });
});


test('optionsSemveristDefaultDefaults', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('default');
  expect(t.context.data).toEqual({
    attributeType: 'default',
    inheritence: 'semverImplied'
  });
});

test('optionsSemveristAttributeDefaults', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('attribute');
  expect(t.context.data).toEqual({
    attributeType: 'attribute',
    inheritence: 'semverImplied'
  });
});

test('optionsSemveristAttributeInheritenceFalseOverride', () => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('attribute', null);
  expect(t.context.data).toEqual({
    attributeType: 'attribute',
    inheritence: null
  });
});

