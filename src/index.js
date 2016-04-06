/**
 * @param {String} 'GENIUS_ACCESS_TOKEN'
 * @return {Type}
 **/
import nodeGenius from 'node-genius';
import scrape from './scrape';
import get from './get';

module.exports = function(key, blacklist) {
  const client = new nodeGenius(key);
  return {
    blacklist: blacklist,
    client: client,
    scrape: scrape,
    get: get,
  };
}
