'use strict';

const testSuper = require('../../__helpers__/testConverterSuper');
const path = require('path');
const semverishValueMixin = require('../../../lib/mixins/semverist/semverishValue');
const semveristObjectMixin = require('../../../lib/mixins/semverist/directoryToSemverishObject');
const semveristElementMixin = require('../../../lib/mixins/semverist/semverishElement');

describe('Test super calls.', () => {
  const MyTestClass = class extends semveristObjectMixin(
    semverishValueMixin(
      semveristElementMixin(testSuper)
    )
  ) {

  };

  let tmpMocks = [];
  let semveristSuperTest;

  beforeEach(() => {
    semveristSuperTest = new MyTestClass();
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('semverishValueSuperCall', () => {
    semveristSuperTest.setSemverish(2);
    return expect(semveristSuperTest.semverish).toEqual(5);
  });

  test('semveristElementSuperCall', () => {
    semveristSuperTest.setSemveristElement('element');
    return expect(semveristSuperTest.semveristElement).toEqual(6);
  });

  test('semveristDirectorySuperCall', () => {
    semveristSuperTest.init({callPath: path.join(__dirname, '../../../')});
    semveristSuperTest.setSemverishObject(path.join(
      '__tests__/__helpers__/semverishObject'));
    return expect(semveristSuperTest.semverishObject).toEqual(7);
  });
});
