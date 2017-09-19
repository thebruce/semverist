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

test('semverishValueSuperCall', () => {
  const semveristSuperTest = new MyTestClass();
  semveristSuperTest.setSemverish(2);
  t.context.data = semveristSuperTest.semverish;
  expect(t.context.data).toEqual(5);
});

test('semveristElementSuperCall', () => {
  const semveristSuperTest = new MyTestClass();
  semveristSuperTest.setSemveristElement('element');
  t.context.data = semveristSuperTest.semveristElement;
  expect(t.context.data).toEqual(6);
});

test('semveristDirectorySuperCall', () => {
  const semveristSuperTest = new MyTestClass();
  semveristSuperTest.init();
  semveristSuperTest.setSemverishObject(path.join(
    __dirname,
    '../../',
    'test/helpers/semverishObject'));
  t.context.data = semveristSuperTest.semverishObject;
  expect(t.context.data).toEqual(7);
});
