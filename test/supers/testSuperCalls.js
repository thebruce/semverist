import test from 'ava';

const testSuper = require('../helpers/testConverterSuper');
const path = require('path');
const semverishValueMixin = require('../../lib/plugins/semverist/semverishValue');
const semveristObjectMixin = require('../../lib/plugins/semverist/directoryToSemverishObject');
const semveristElementMixin = require('../../lib/plugins/semverist/semverishElement');

const MyTestClass = class extends semveristObjectMixin(
  semverishValueMixin(
    semveristElementMixin(testSuper)
  )
) {};

test('semverishValueSuperCall', (t) => {
  const semveristSuperTest = new MyTestClass();
  semveristSuperTest.setSemverish(2);
  t.context.data = semveristSuperTest.semverish;
  t.deepEqual(
    t.context.data,
    5,
    'Setting the preReleasePattern to a value should result in that value.'
  );
});

test('semveristElementSuperCall', (t) => {
  const semveristSuperTest = new MyTestClass();
  semveristSuperTest.setSemveristElement('element');
  t.context.data = semveristSuperTest.semveristElement;
  t.deepEqual(
    t.context.data,
    6,
    'Setting the preReleasePattern to a value should result in that value.'
  );
});

test('semveristDirectorySuperCall', (t) => {
  const semveristSuperTest = new MyTestClass();
  semveristSuperTest.init();
  semveristSuperTest.setSemverishObject(path.join(
    __dirname,
    '../../',
    'test/helpers/semverishObject'));
  t.context.data = semveristSuperTest.semverishObject;
  t.deepEqual(
    t.context.data,
    7,
    'The converter objects winds group should be keyed by its valid ranges.'
  );
});
