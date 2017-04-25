import test from 'ava';

const converterFactory = require('../../lib/converter/converter');
const semveristObject = require('../helpers/semverishObject');
const semverConfig = require('../helpers/lazySemveristConfig');
const digestedHelper = require('../helpers/lazyConverterProcessed.json');

test('initWithOptions', async (t) => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass.getSemverishObject();
  });
  t.deepEqual(
    Object.keys(t.context.data['1']['0']['0']),
    ['violin'],
    'Violin was expected at this semverish location.'
  );
});

test('setGetSemverRealizations', async (t) => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    converterClass.setSemverRealizations(['1.0.0']);
    return converterClass.getSemverRealizations();
  });
  t.deepEqual(
    t.context.data,
    ['1.0.0'],
    'Semver realizations should be an array with the set value 1.0.0'
  );
});

test('semveristAssemble', async (t) => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass.createConverter();
  });
  t.deepEqual(
    t.context.data.semverRealizations,
    [
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
    ],
    'The semverish object should have all declared and implicit semver values as realizations.'
  );
});

test('testSemveristAssembleForViolin', async (t) => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass.semveristAssemble('root');
  });
  t.deepEqual(
    Object.keys(t.context.data.attribute.violin).sort(),
    [
      '1',
      '1.0',
      '1.0.0',
      '1.0.1',
      '1.0.2',
      '2'
    ],
    'Violin converter class should include all semverish occurences of the attribute.'
  );
});

test('converterRangeTests', async (t) => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass.createConverter();
  });

  t.deepEqual(
    t.context.data,
    digestedHelper,
    'The converter objects winds group should be keyed by its valid ranges.'
  );
});
