import request from 'request';
import cheerio from 'cheerio';
import wordcount from 'word-count';

export default function (url, callback) {
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      return callback({ code: response.statusCode, message: `${response.statusCode} ${response.statusMessage}` }, null);
    }

    if (body) {
      const $ = cheerio.load(body);

      let text = $('.lyrics p').text();
      // remove notes
      text = text.replace(/[\[\(\{](.*?)[\]\)\}]/g, '');
      // remove extra whitespace
      text = text.replace(/(\r\n|\r|\n){2,}/g, '$1\n');

      const wordCount = wordcount(text);
      const title = $('.song_header-primary_info h1').text();
      const author = $('.song_header-primary_info-primary_artist').text();
      const album = $('song-primary-album .song_info-info').text();
      const date = $('release-date .song_info-info').text();

      const obj = {
        title: title,
        author: author,
        text: text,
        album: album,
        release_date: date,
        word_count: wordCount,
      };

      return callback(null, obj);
    }
    return callback('no body', null);
  });
}
