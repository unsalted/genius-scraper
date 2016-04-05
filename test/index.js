import test from 'tape'
import geniusScraper from '../src'

test('geniusScraper', (t) => {
  t.plan(1);
  t.equal(geniusScraper(), geniusScraper(), 'init');
})
