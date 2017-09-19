const converterFactory = require('../../lib/converter/converter');
const semveristObject = require('../helpers/semverishObject');
const semverConfig = require('../helpers/lazySemveristConfig');
const digestedHelper = require('../helpers/lazyConverterProcessed.json');

test('initWithOptions', async () => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass.getSemverishObject();
  });
  expect(Object.keys(t.context.data['1']['0']['0'])).toEqual(['violin']);
});

test('setGetSemverRealizations', async () => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    converterClass.setSemverRealizations(['1.0.0']);
    return converterClass.getSemverRealizations();
  });
  expect(t.context.data).toEqual(['1.0.0']);
});

test('semveristAssemble', async () => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass.createConverter();
  });
  expect(t.context.data.semverRealizations).toEqual([
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

test('testSemveristAssembleForViolin', async () => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass.semveristAssemble('root');
  });
  expect(Object.keys(t.context.data.attribute.violin).sort()).toEqual([
    '1',
    '1.0',
    '1.0.0',
    '1.0.1',
    '1.0.2',
    '2'
  ]);
});

test('converterRangeTests', async () => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass.createConverter();
  });

  expect(t.context.data).toEqual(digestedHelper);
});
