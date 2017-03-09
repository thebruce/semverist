import test from 'ava';

const SemveristSuperBase = require('../../../lib/supers/semveristSuperBase');

test('optionsSemveristObjectDefaults', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('semveristObject');
  t.deepEqual(
    t.context.data,
    {
      attributeType: 'semveristObject',
      inheritence: null
    }
    );
});

test('optionsSemveristGroupsDefaults', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('group');
  t.deepEqual(
    t.context.data,
    {
      attributeType: 'group',
      inheritence: 'semverImplied'
    }
  );
});


test('optionsSemveristDefaultDefaults', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('default');
  t.deepEqual(
    t.context.data,
    {
      attributeType: 'default',
      inheritence: 'semverImplied'
    }
    );
});

test('optionsSemveristAttributeDefaults', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('attribute');
  t.deepEqual(
    t.context.data,
    {
      attributeType: 'attribute',
      inheritence: 'semverImplied'
    }
    );
});

test('optionsSemveristAttributeInheritenceFalseOverride', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('attribute', null);
  t.deepEqual(
    t.context.data,
    {
      attributeType: 'attribute',
      inheritence: null
    }
    );
});
