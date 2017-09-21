'use strict';

const SemveristSuperBase = require('../../../../lib/supers/semverist');

let tmpMocks = [];
let semveristSuperBase;

describe('Supers options tests.', () => {
  beforeEach(() => {
    semveristSuperBase = new SemveristSuperBase();
    semveristSuperBase.init();
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('optionsSemveristObjectDefaults', () => {
    expect.assertions(1);
    return expect(semveristSuperBase.createOptions('semveristObject'))
    .toEqual({
      attributeType: 'semveristObject',
      inheritence: null
    });
  });

  test('optionsSemveristGroupsDefaults', () => {
    expect.assertions(1);
    return expect(semveristSuperBase.createOptions('group'))
    .toEqual({
      attributeType: 'group',
      inheritence: 'semverImplied'
    });
  });

  test('optionsSemveristDefaultDefaults', () => {
    expect.assertions(1);
    return expect(semveristSuperBase.createOptions('default'))
    .toEqual({
      attributeType: 'default',
      inheritence: 'semverImplied'
    });
  });

  test('optionsSemveristAttributeDefaults', () => {
    expect.assertions(1);
    return expect(semveristSuperBase.createOptions('attribute'))
    .toEqual({
      attributeType: 'attribute',
      inheritence: 'semverImplied'
    });
  });

  test('optionsSemveristAttributeInheritenceFalseOverride', () => {
    expect.assertions(1);
    return expect(semveristSuperBase.createOptions('attribute', null))
    .toEqual({
      attributeType: 'attribute',
      inheritence: null
    });
  });
});
