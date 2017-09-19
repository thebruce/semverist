const converterFactory = require('../../lib/converter/converter');
const semverConfig = require('../helpers/semverImpliedConfig');
const path = require('path');
const digestedHelper = require('../helpers/semverImpliedProcessed.json');

test('initWithOptions', async () => {
  t.context.data = await converterFactory('semverist', 'directoryConverter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(path.join(
      __dirname,
      '../../',
      'test/helpers/semverishObject'),
    semverConfig);
    return converterClass.getSemverishObject();
  });
  expect(Object.keys(t.context.data['1']['0']['0'])).toEqual(['violin']);
});

test('setGetSemverRealizations', async () => {
  t.context.data = await converterFactory('semverist', 'directoryConverter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(path.join(
      __dirname,
      '../../',
      'test/helpers/semverishObject'),
    semverConfig);
    converterClass.setSemverRealizations(['1.0.0']);
    return converterClass.getSemverRealizations();
  });
  expect(t.context.data).toEqual(['1.0.0']);
});

test('addSemverRealizations', async () => {
  t.context.data = await converterFactory('semverist', 'directoryConverter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(path.join(
      __dirname,
      '../../',
      'test/helpers/semverishObject'),
    semverConfig);
    converterClass.setSemverRealizations(['1.0.0']);
    converterClass.addSemverRealizations('1.1.0');
    converterClass.addSemverRealizations('1.2.0');
    return converterClass.getSemverRealizations();
  });
  expect(t.context.data).toEqual([
    '1.0.0',
    '1.1.0',
    '1.2.0'
  ]);
});

test('semveristAssemble', async () => {
  t.context.data = await converterFactory('semverist', 'directoryConverter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(path.join(
      __dirname,
      '../../',
      'test/helpers/semverishObject'),
    semverConfig);
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
  t.context.data = await converterFactory('semverist', 'directoryConverter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(path.join(
      __dirname,
      '../../',
      'test/helpers/semverishObject'),
    semverConfig);
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
  t.context.data = await converterFactory('semverist', 'directoryConverter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(path.join(
      __dirname,
      '../../',
      'test/helpers/semverishObject'),
    semverConfig);
    return converterClass.createConverter();
  });

  expect(Object.keys(t.context.data.group.winds)).toEqual([
    '>=1.0.0 <2.0.0',
    '>=2.0.0-alpha.1 <2.0.0-beta.0',
    '>=2.0.0 <3.0.0'
  ]);
});

test('Processed complete test', async () => {
  t.context.data = await converterFactory('semverist', 'directoryConverter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(path.join(
      __dirname,
      '../../',
      'test/helpers/semverishObject'),
    semverConfig);
    return converterClass.createConverter();
  });

  expect(t.context.data).toEqual(digestedHelper);
});

test('getTraceIndex', async () => {
  t.context.data = await converterFactory('semverist', 'directoryConverter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(path.join(
      __dirname,
      '../../',
      'test/helpers/semverishObject'),
    semverConfig);
    return ConverterClass.getTraceIndex(1);
  });

  expect(t.context.data).toEqual(0);
});
