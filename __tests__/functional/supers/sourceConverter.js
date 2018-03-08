

const converterFactory = require('../../../lib/converter/converter');
const semveristObject = require('../../__helpers__/semverishObject');
const semverConfig = require('../../__helpers__/semverImpliedConfig');
const digestedHelper = require('../../__helpers__/semverImpliedProcessed.json');

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
    expect.assertions(1);
    return converterEx
      .then(converterClass => converterClass.getSemverishObject())
      .then(obj => Object.keys(obj['1']['0']['0']))
      .then(obj => expect(obj).toEqual(['violin']));
  });

  test('setGetSemverRealizations', () => {
    expect.assertions(1);
    return converterEx
      .then((converterClass) => {
        converterClass.setSemverRealizations(['1.0.0']);
        return converterClass.getSemverRealizations();
      })
      .then(obj => expect(obj).toEqual(['1.0.0']));
  });

  test('addSemverRealizations', () => {
    expect.assertions(1);
    return converterEx
      .then((converterClass) => {
        converterClass.setSemverRealizations(['1.0.0']);
        converterClass.addSemverRealizations('1.1.0');
        converterClass.addSemverRealizations('1.2.0');
        return converterClass.getSemverRealizations();
      })
      .then(obj => expect(obj).toEqual([
        '1.0.0',
        '1.1.0',
        '1.2.0',
      ]));
  });

  test('semveristAssemble', () => {
    expect.assertions(1);
    return converterEx
      .then(converterClass => converterClass.createConverter())
      .then(obj => obj.semverRealizations)
      .then(obj => expect(obj).toEqual([
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
      ]));
  });

  test('testSemveristAssembleForViolin', () => {
    expect.assertions(1);
    return converterEx
      .then(converterClass => converterClass.semveristAssemble('root'))
      .then(obj => Object.keys(obj.attribute.violin).sort())
      .then(obj => expect(obj).toEqual([
        '1',
        '1.0',
        '1.0.0',
        '1.0.1',
        '1.0.2',
        '2',
      ]));
  });

  test('coverterRangeTests', () => {
    expect.assertions(1);
    return converterEx
      .then(converterClass => converterClass.createConverter())
      .then(obj => Object.keys(obj.attribute.violin))
      .then(obj => expect(obj).toEqual([
        '>=1.1.0 <2.0.0',
        '>=1.0.3 <1.1.0',
        '1.0.0',
        '1.0.1',
        '1.0.2',
        '>=2.0.0 <3.0.0',
      ]));
  });

  test('converterClassNoPlugins', () => {
    expect.assertions(1);
    return converterFactory('semverist')
      .then((ConverterClass) => {
        const converterClass = new ConverterClass();
        converterClass.init(semveristObject, semverConfig);
        return converterClass.sortRangeArray;
      })
      .then(obj => expect(obj).toBeUndefined());
  });

  test('converterRangeAttributeTests', () => {
    expect.assertions(1);
    return converterFactory('semverist', 'converter')
      .then((ConverterClass) => {
        const converterClass = new ConverterClass();
        converterClass.init(semveristObject);
        return converterClass.createConverter();
      })
      .then(obj => Object.keys(obj.attribute.violin))
      .then(obj => expect(obj).toEqual([
        '>=1.1.0 <2.0.0',
        '>=1.0.3 <1.1.0',
        '1.0.0',
        '1.0.1',
        '1.0.2',
        '>=2.0.0 <3.0.0',
      ]));
  });

  test('addBadSemverRealizations', () => converterFactory('semverist', 'converter')
    .then((ConverterClass) => {
      const converterClass = new ConverterClass();
      converterClass.init(semveristObject);
      converterClass.addSemverRealizations('notAGoodSemverish');
    })
    .catch(
      e => expect(e.message).toEqual('Semver realizations must be valid semver, notAGoodSemverish is not a valid semver.')
    ));

  test('Add a non existant semverist element', () => {
    expect.assertions(1);
    return converterEx
      .then((converterClass) => {
        converterClass.addConverterSemveristElement('aNewElement', 'mucky', '>1.1.0 <2.0.0', 'flappy');
        return converterClass.converter;
      })
      .then(obj => Object.keys(obj).sort())
      .then(obj => expect(obj).toEqual([
        'aNewElement',
        'attribute',
        'default',
        'group',
        'semverRealizations',
      ]));
  });

  test('Add a non existant semverist class item', () => {
    expect.assertions(1);
    return converterEx
      .then((converterClass) => {
        converterClass.addSemveristClassItem('aNewElement', 'newNew', '1.1.0', 'semverish', {});
        return converterClass.getSemveristClasses();
      })
      .then(obj => Object.keys(obj).sort())
      .then(obj => expect(obj).toEqual([
        'aNewElement',
        'attribute',
        'default',
        'group',
      ]));
  });

  test('Processed complete test', () => {
    expect.assertions(1);
    return converterEx
      .then(converterClass => converterClass.createConverter())
      .then(obj => expect(obj).toEqual(digestedHelper));
  });
});
