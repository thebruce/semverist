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
      inheritence: true,
      lazySemverist: false,
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
      inheritence: true,
      lazySemverist: false,
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
      inheritence: true,
      lazySemverist: false,
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
      inheritence: true,
      lazySemverist: true,
    }
    );
});

test('optionsSemveristAttributeInheritenceFalseOverride', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('attribute', false);
  t.deepEqual(
    t.context.data,
    {
      attributeType: 'attribute',
      inheritence: false,
      lazySemverist: true,
    }
    );
});

test('optionsSemveristAttributeLazySemveristFalseOverride', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('attribute', undefined, false);
  t.deepEqual(
    t.context.data,
    {
      attributeType: 'attribute',
      inheritence: true,
      lazySemverist: false,
    }
    );
});

test('optionsSemveristAttributeBothFalseOverride', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.init();
  t.context.data = semveristSuperBase.createOptions('attribute', false, false);
  t.deepEqual(
    t.context.data,
    {
      attributeType: 'attribute',
      inheritence: false,
      lazySemverist: false,
    }
    );
});
