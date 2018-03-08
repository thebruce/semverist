

const converterFactory = require('../../../lib/converter/converter');
const semverConfig = require('../../__helpers__/semverImpliedConfig');
const digestedHelper = require('../../__helpers__/semverImpliedProcessed.json');
const path = require('path');

let converterClass;
let tmpMocks = [];

describe('Directory converter', () => {
  beforeEach(() => {
    converterClass = converterFactory('semverist', 'directoryConverter')
      .then((ConverterClass) => {
        const converterClassa = new ConverterClass();
        semverConfig.callPath = path.join(__dirname, './../../..');
        converterClassa.init(
          '__tests__/__helpers__/semverishObject',
          semverConfig);
        return converterClassa;
      });
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('initWithOptions', () => {
    expect.assertions(1);
    return converterClass.then(conv => conv.getSemverishObject())
      .then(semv => expect(Object.keys(semv['1']['0']['0'])).toEqual(['violin']));
  });

  test('setGetSemverRealizations', () => {
    expect.assertions(1);
    return converterClass.then((conv) => {
      conv.setSemverRealizations(['1.0.0']);
      return conv.getSemverRealizations();
    })
      .then(obj => expect(obj)
        .toEqual(['1.0.0']));
  });

  test('addSemverRealizations', () => {
    expect.assertions(1);
    return converterClass.then((conv) => {
      conv.setSemverRealizations(['1.0.0']);
      conv.addSemverRealizations('1.1.0');
      conv.addSemverRealizations('1.2.0');
      return conv.getSemverRealizations();
    })
      .then(obj => expect(obj).toEqual([
        '1.0.0',
        '1.1.0',
        '1.2.0',
      ]));
  });

  test('semveristAssemble', () => {
    expect.assertions(1);
    return converterClass
      .then(conv => conv.createConverter())
      .then(c => c.semverRealizations)
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
    return converterClass
      .then(conv => conv.semveristAssemble('root'))
      .then(semv => Object.keys(semv.attribute.violin).sort())
      .then(obj => expect(obj).toEqual([
        '1',
        '1.0',
        '1.0.0',
        '1.0.1',
        '1.0.2',
        '2',
      ]));
  });

  test('converterRangeTests', () => {
    expect.assertions(1);
    return converterClass.then(conv => conv.createConverter())
      .then(semv => Object.keys(semv.group.winds))
      .then(obj => expect(obj).toEqual([
        '>=1.0.0 <2.0.0',
        '>=2.0.0-alpha.1 <2.0.0-beta.0',
        '>=2.0.0 <3.0.0',
      ]));
  });

  test('Processed complete test', () => {
    expect.assertions(1);
    return converterClass
      .then(conv => conv.createConverter())
      .then(obj => expect(obj).toEqual(digestedHelper));
  });
});
