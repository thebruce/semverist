import test from 'ava';

const converterFactory = require('../../lib/converter/converter');
const semveristObject = require('../helpers/semverishObject');
const semverConfig = require('../helpers/noInheritenceConfig.json');
const digestedHelper = require('../helpers/noInheritenceProcessed.json');

test('Processed complete test', async (t) => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass.createConverter();
  });

  t.deepEqual(
    t.context.data,
    digestedHelper,
    'The converter object should be a complete match to the processed converter example..'
  );
});
