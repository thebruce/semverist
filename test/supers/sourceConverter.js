import test from 'ava';

const converterFactory = require('../../lib/converter/converter');
const semveristObject = require('../helpers/semverishObject');
const semverConfig = require('../helpers/semverImpliedConfig');

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
    'Semverish get should return from semverish set.'
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
    'Semverish get should return from semverish set.'
  );
});

test('addSemverRealizations', async (t) => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    converterClass.setSemverRealizations(['1.0.0']);
    converterClass.addSemverRealizations('1.1.0');
    converterClass.addSemverRealizations('1.2.0');
    return converterClass.getSemverRealizations();
  });
  t.deepEqual(
    t.context.data,
    [
      '1.0.0',
      '1.1.0',
      '1.2.0'
    ],
    'Semverish get should return from semverish set.'
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
    'Semverish get should return from semverish set.'
  );
});

test('semveristAssemble2', async (t) => {
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
    'Semverish get should return from semverish set.'
  );
});

test('semveristAssemble3', async (t) => {
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
    'Semverish get should return from semverish set.'
  );
});

test('semveristAssemble4', async (t) => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass.createConverter();
  });

  t.deepEqual(
    Object.keys(t.context.data.group.winds),
    [
      '>=1.0.0 <2.0.0',
      '>=2.0.0-alpha.1 <2.0.0',
      '>=2.0.0 <3.0.0'
    ],
    'Semverish get should return from semverish set.'
  );
});
