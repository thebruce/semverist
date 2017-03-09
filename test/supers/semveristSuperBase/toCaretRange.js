import test from 'ava';

const SemverishSuper = require('../../../lib/supers/semverishSuper');

test('toCaretRange', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.toCaretRange('0.1.0');
  t.deepEqual(
    t.context.data,
    '>=0.1.0 <0.2.0'
    );
});
