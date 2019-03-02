const converterFactory = require('../../../lib/converter/converter');
const semveristObject = require('../../__helpers__/semverishObject');
const semverConfig = require('../../__helpers__/lazySemveristConfig');
const digestedHelper = require('../../__helpers__/lazyConverterProcessed.json');

let converterEx;
let tmpMocks = [];

beforeEach(() => {
  converterEx = converterFactory('semverist', 'converter').then(
    ConverterClass => new ConverterClass()
  );
  tmpMocks.forEach(mock => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Source Converter Super Lazy semver test', () => {
  test('initWithOptions', () => {
    expect.assertions(1);
    return converterEx
      .then(converterClass => {
        converterClass.init(semveristObject, semverConfig);
        return converterClass.getSemverishObject();
      })
      .then(conv => Object.keys(conv['1']['0']['0']))
      .then(obj => expect(obj).toEqual(['violin']));
  });

  test('setGetSemverRealizations', () => {
    expect.assertions(1);
    return converterEx
      .then(converterClass => {
        converterClass.init(semveristObject, semverConfig);
        converterClass.setSemverRealizations(['1.0.0']);
        return converterClass.getSemverRealizations();
      })
      .then(obj => expect(obj).toEqual(['1.0.0']));
  });

  test('semveristAssemble', () => {
    expect.assertions(1);
    return converterEx
      .then(converterClass => {
        converterClass.init(semveristObject, semverConfig);
        return converterClass.createConverter();
      })
      .then(conv => conv.semverRealizations)
      .then(obj =>
        expect(obj).toEqual([
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
        ])
      );
  });

  test('testSemveristAssembleForViolin', () => {
    expect.assertions(1);
    return converterEx
      .then(converterClass => {
        converterClass.init(semveristObject, semverConfig);
        return converterClass.semveristAssemble('root');
      })
      .then(conv => Object.keys(conv.attribute.violin).sort())
      .then(obj =>
        expect(obj).toEqual(['1', '1.0', '1.0.0', '1.0.1', '1.0.2', '2'])
      );
  });

  test('converterRangeTests', () => {
    expect.assertions(1);
    return converterEx
      .then(converterClass => {
        converterClass.init(semveristObject, semverConfig);
        return converterClass.createConverter();
      })
      .then(obj => expect(obj).toEqual(digestedHelper));
  });
});
