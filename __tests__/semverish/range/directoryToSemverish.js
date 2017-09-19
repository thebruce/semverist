const converterFactory = require('../../../lib/converter/converter');

test('directoryToSemverishSeparator', async () => {
  t.context.data = await converterFactory('semverist', 'directoryConverter')
  .then(ConverterClass => ConverterClass.getPathSeparatorRegEx('\\'));
  expect(t.context.data).toEqual(/\\/g);
});
