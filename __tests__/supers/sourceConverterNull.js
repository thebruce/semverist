const converterFactory = require('../../lib/converter/converter');
const semveristObject = require('../helpers/semverishObject');
const semverConfig = require('../helpers/noInheritenceConfig.json');
const digestedHelper = require('../helpers/noInheritenceProcessed.json');

test('Processed complete test', async () => {
  t.context.data = await converterFactory('semverist', 'converter')
  .then((ConverterClass) => {
    const converterClass = new ConverterClass();
    converterClass.init(semveristObject, semverConfig);
    return converterClass.createConverter();
  });

  expect(t.context.data).toEqual(digestedHelper);
});
