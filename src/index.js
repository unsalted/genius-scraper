/**
 * @param {String} 'GENIUS_ACCESS_TOKEN'
 * @return {Type}
 */
const nodeGenius = import from 'node-genius'

export default function (key) {
  const client = new nodeGenius(key);
  return {
    client: client,
    pull: pull,
  }
}
