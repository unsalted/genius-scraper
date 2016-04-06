import _ from 'lodash';
import async from 'async';

export default function (request, callback) {
  const self = this;
  const client = self.client;

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

  const execute = function (_obj, cb) {
    _getSongs(_obj.id, (error, result) => {
      if (error) {
        return cb(error, null);
      }
      const obj = {
        author: _obj.author,
        id: _obj.id,
        urls: result,
      };
      return cb(null, obj);
    })  
  };
  execute(request, callback);
}
