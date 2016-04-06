import _ from 'lodash';
import async from 'async';

export default function (auth, callback) {
  const self = this;
  const client = self.client;

  const _parseAuthorId = function (author, o) {
    const obj = JSON.parse(o);
    function findAuthor(hit) {
      return hit.result.primary_artist.name.toLowerCase() === author.toLowerCase();
    }
    const f = obj.response.hits.find(findAuthor);
    if(!f){
      return false;
    }
    return {
      id: f.result.primary_artist.id,
      author: f.result.primary_artist.name,
    };
  };

  const _getID = function (author, cb) {
    if (author) {
      client.search(author, (error, searchResults) => {
        if (error) { return cb(error, null); }
        const id = _parseAuthorId(author, searchResults);
        if (!id) {
          return cb(`Could not find author: ${author}`, null);
        }
        return cb(null, id);
      });
    }
  };

  const blacklistCheck = function (i, bl) {
    const item = i.toLowerCase();
    const check = bl.some((t) => item.indexOf(t) > -1);
    return check;
  };

  const _getSongs = function (id, cb) {
    const arr = [];
    const per = 50;
    let songs = ['0'];
    let count = 0;

    async.whilst(
      () => {return songs.length > 0;},
      (result) => {
        count++;
        console.log(`Loaded ${auth} songs: ${arr.length * per}`);
        client.getArtistSongs(id, { page: count, per_page: per }, (error, response) => {
          if (error) { return cb(error, null); }
          const obj = JSON.parse(response);
          songs = obj.response.songs;
          if (songs.length !== 0) {
            // check is primary artist
            const artistFiltered = songs.filter((s) => s.primary_artist.id === id);
            // filter out duplicates and irrelevant songs using blacklist
            const titleFiltered = artistFiltered.filter((s) => !blacklistCheck(s.title, self.blacklist));
            const mapped = titleFiltered.map((s) => s.url);
            arr.push(mapped);
          }
          return result(error, songs, count);
        });
      },
      (error) => {
        const flattened = _.flatten(arr);
        if (error) { return cb(error, flattened); }
        return cb(null, flattened);
      }
    );
  };

  const execute = function (author, cb) {
    let gID = 0;
    let gAuth = author;
    async.waterfall([
      async.apply(_getID, author),
      (o, c) => { gID = o.id; gAuth = o.author; c(null, o.id); },
      _getSongs,
    ], (error, result) => {
      if (error) {
        return cb(error, null);
      }
      const obj = {
        author: gAuth,
        id: gID,
        urls: result,
      };
      return cb(null, obj);
    });
  };
  execute(auth, callback);
}
