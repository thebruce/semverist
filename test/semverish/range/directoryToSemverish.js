import test from 'ava';

const converterFactory = require('../../../lib/converter/converter');

test('directoryToSemverishSeparator', async (t) => {
  t.context.data = await converterFactory('semverist', 'directoryConverter')
  .then(ConverterClass => ConverterClass.getPathSeparatorRegEx('\\'));
  t.deepEqual(
    t.context.data,
    /\\/g,
    'Returns regex for windows path separators'
  );
});
