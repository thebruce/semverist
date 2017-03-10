import test from 'ava';

const SourceConverter = require('../../lib/supers/converterSuper');

// test.todo('constructor');

// test.todo('assembleViaTraversal');

// test.todo('populateConverter');

test('setConverterAttribute', (t) => {
  const sourceConverter = new SourceConverter();
  sourceConverter.attribute = {test: 'value'};
  sourceConverter.addConverterAttribute('default', '4.1.0', '4.1.0.default');
  t.context.data = sourceConverter.getConverterAttribute('default', '4.1.0');
  t.deepEqual(t.context.data, ['4.1.0.default']);
});

// test.todo('pushConverterAttributeValue');

// test.todo('identifySourceAttributeType');

// test.todo('assembleConverterComposition');

test('setConverter', (t) => {
  const sourceConverter = new SourceConverter();
  sourceConverter.setConverter('test');
  t.context.data = sourceConverter.getConverter();
  t.deepEqual(t.context.data, 'test');
});
