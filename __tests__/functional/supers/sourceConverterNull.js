

const converterFactory = require('../../../lib/converter/converter');
const semveristObject = require('../../__helpers__/semverishObject');
const semverConfig = require('../../__helpers__/noInheritenceConfig.json');
const digestedHelper = require('../../__helpers__/noInheritenceProcessed.json');

test('Processed complete test', () => {
  expect.assertions(1);
  return converterFactory('semverist', 'converter')
    .then((ConverterClass) => {
      const converterClass = new ConverterClass();
      converterClass.init(semveristObject, semverConfig);
      return converterClass.createConverter();
    })
    .then(obj => expect(obj).toEqual(digestedHelper));
});
