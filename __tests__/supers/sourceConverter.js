'use strict';

const converterFactory = require('../../lib/converter/converter');
const semveristObject = require('../helpers/semverishObject');
const semverConfig = require('../helpers/semverImpliedConfig');
const digestedHelper = require('../helpers/semverImpliedProcessed.json');

let tmpMocks = [];
let converterEx;

beforeEach(() => {
  converterEx = converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass;
  });
  tmpMocks.forEach(mock => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Source Converter Super test', () => {
  test('initWithOptions', () => {
    expect(converterEx
      .then(converterClass => converterClass.getSemverishObject())
      .then(obj => Object.keys(obj['1']['0']['0'])))
      .resolves.toEqual(['violin']);
  });

  test('setGetSemverRealizations', () => {
    expect(converterEx
      .then((converterClass) => {
        converterClass.setSemverRealizations(['1.0.0']);
        return converterClass.getSemverRealizations();
      })
      .then(obj => obj))
      .resolves.toEqual(['1.0.0']);
  });

  test('addSemverRealizations', () => {
    expect(converterEx
      .then((converterClass) => {
        converterClass.setSemverRealizations(['1.0.0']);
        converterClass.addSemverRealizations('1.1.0');
        converterClass.addSemverRealizations('1.2.0');
        return converterClass.getSemverRealizations();
      })
      .then(obj => obj))
      .resolves.toEqual([
        '1.0.0',
        '1.1.0',
        '1.2.0'
      ]);
  });

  test('semveristAssemble', () => {
    expect(converterEx
      .then(converterClass => converterClass.createConverter())
      .then(obj => obj.semverRealizations))
    .resolves.toEqual([
      '1.0.0',
      '1.0.1',
      '1.0.2',
      '1.1.0',
      '1.1.1',
      '1.2.0',
      '1.3.0',
      '2.0.0-alpha.0',
      '2.0.0-alpha.1',
      '2.0.0-beta.0',
      '2.0.0',
      '2.0.1',
    ]);
  });

  test('testSemveristAssembleForViolin', () => {
    expect(converterEx
      .then(converterClass => converterClass.semveristAssemble('root'))
      .then(obj => Object.keys(obj.attribute.violin).sort()))
    .resolves.toEqual([
      '1',
      '1.0',
      '1.0.0',
      '1.0.1',
      '1.0.2',
      '2'
    ]);
  });

  test('coverterRangeTests', () => {
    expect(converterEx
      .then(converterClass => converterClass.createConverter())
      .then(obj => Object.keys(obj.attribute.violin)))
    .resolves.toEqual([
      '>=1.1.0 <2.0.0',
      '>=1.0.3 <1.1.0',
      '1.0.0',
      '1.0.1',
      '1.0.2',
      '>=2.0.0 <3.0.0'
    ]);
  });

  test('converterClassNoPlugins', () => {
    expect(converterFactory('semverist')
    .then((ConverterClass) => {
      const converterClass = new ConverterClass();
      converterClass.init(semveristObject, semverConfig);
      return converterClass.sortRangeArray;
    }))
    .resolves.toBeUndefined();
  });

  test('converterRangeAttributeTests', () => {
    expect(converterFactory('semverist', 'converter')
      .then((ConverterClass) => {
        const converterClass = new ConverterClass();
        converterClass.init(semveristObject);
        return converterClass.createConverter();
      })
      .then(obj => Object.keys(obj.attribute.violin)))
    .resolves.toEqual([
      '>=1.1.0 <2.0.0',
      '>=1.0.3 <1.1.0',
      '1.0.0',
      '1.0.1',
      '1.0.2',
      '>=2.0.0 <3.0.0'
    ]);
  });

  test('addBadSemverRealizations', () => {
    expect(converterFactory('semverist', 'converter')
      .then((ConverterClass) => {
        const converterClass = new ConverterClass();
        converterClass.init(semveristObject);
        converterClass.addSemverRealizations('notAGoodSemverish');
      })
      .catch(
        e => expect(e.message).toEqual('Semver realizations must be valid semver, notAGoodSemverish is not a valid semver.')
      ));
  });

  test('Add a non existant semverist element', () => {
    expect(converterEx
      .then((converterClass) => {
        converterClass.addConverterSemveristElement('aNewElement', 'mucky', '>1.1.0 <2.0.0', 'flappy');
        return converterClass.converter;
      })
      .then(obj => Object.keys(obj).sort()))
    .resolves.toEqual([
      'aNewElement',
      'attribute',
      'default',
      'group',
      'semverRealizations'
    ]);
  });

  test('Add a non existant semverist class item', () => {
    expect(converterEx
      .then((converterClass) => {
        converterClass.addSemveristClassItem('aNewElement', 'newNew', '1.1.0', 'semverish', {});
        return converterClass.getSemveristClasses();
      })
      .then(obj => Object.keys(obj).sort()))
    .resolves.toEqual([
      'aNewElement',
      'attribute',
      'default',
      'group'
    ]);
  });

  test('Processed complete test', () => {
    expect(converterEx
      .then(converterClass => converterClass.createConverter())
      .then(obj => obj))
      .resolves.toEqual(digestedHelper);
  });
});
