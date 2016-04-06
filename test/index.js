import test from 'tape';
import geniusScraper from '../src';
import env from '../config/env';
import blacklist from '../config/blacklist';


const key = process.env.GENIUS_ACCESS_TOKEN;

const url = 'http://genius.com/Sia-chandelier-lyrics';
const badLink = 'http://genius.com/sdlfkjsdf';
const easyAuthor = 'Sia';
const hardAuthor = 'Frank Sinatra';
const easyAuthorID = 16775;
const hardAuthorID = 'Frank Sinatra';

const sia = {
  title: 'Chandelier',
  author: 'Sia',
  text: '\n\nParty girls don\'t get hurt\nCan’t feel anything, when will I learn\nI push it down, push it down\nI\'m the one "for a good time call"\nPhone’s blowin\' up, ringin\' my doorbell\nI feel the love, feel the love\n\n1 2 3, 1 2 3, drink\n1 2 3, 1 2 3, drink\n1 2 3, 1 2 3, drink\nThrow \'em back till I lose count\n\nI\'m gonna swing from the chandelier\nFrom the chandelier\nI\'m gonna live like tomorrow doesn\'t exist\nLike it doesn\'t exist\nI\'m gonna fly like a bird through the night\nFeel my tears as they dry, I -\nI\'m gonna swing from the chandelier\nFrom the chandelier\n\nBut I\'m holding on for dear life\nWon\'t look down, won\'t open my eyes\nKeep my glass full until morning light\nCause I\'m just holding on for tonight\nHelp me, I\'m holding on for dear life\nWon\'t look down, won\'t open my eyes\nKeep my glass full until morning light\nCause I\'m just holding on for tonight\nOn for tonight\n\nSun is up, I\'m a mess\nGotta get out now, gotta run from this\nHere comes the shame, here comes the shame\n\n1 2 3, 1 2 3, drink\n1 2 3, 1 2 3, drink\n1 2 3, 1 2 3, drink\nThrow \'em back till I lose count\n\nI\'m gonna swing from the chandelier\nFrom the chandelier\nI\'m gonna live like tomorrow doesn\'t exist\nLike it doesn\'t exist\nI\'m gonna fly like a bird through the night\nFeel my tears as they dry, I -\nI\'m gonna swing from the chandelier\nFrom the chandelier\n\nBut I\'m holding on for dear life\nWon\'t look down, won\'t open my eyes\nKeep my glass full until morning light\nCause I\'m just holding on for tonight\nHelp me, I\'m holding on for dear life\nWon\'t look down, won\'t open my eyes\nKeep my glass full until morning light\nCause I\'m just holding on for tonight\nOn for tonight\n\nOn for tonight\nCause I\'m just holding on for tonight\nOh, I\'m just holding on for tonight\nOn for tonight, on for tonight\nCause I\'m just holding on for tonight\nCause I\'m just holding on for tonight\nOh, I\'m just holding on for tonight\nOn for tonight, on for tonight',
  album: '1000 Forms of Fear',
  release_date: 'March 17, 2014',
  word_count: 416,
  source_id: easyAuthorID,
  source_url: url,
};

test('geniusScraper', (t) => {
  const GS = geniusScraper(key, blacklist);
  t.plan(7);
  GS.scrape({ url: url, id: easyAuthorID, author: easyAuthor }, (error, response) => {
    t.deepEqual(response, sia, `${url} returns match for Chandelier`);
    t.equal(null, error, `${url} returns null for errors`);
  });
  GS.scrape({ url: badLink, id: easyAuthorID, author: easyAuthor }, (error) => {
    t.deepEqual({ code: 404, message: '404 Not Found' }, error, `${badLink} returns 404 error`);
  });
  GS.get(easyAuthor, (error, response) => {
    const qt = response.urls.some((s) => s === 'http://genius.com/Sia-chandelier-lyrics');
    t.equal(true, qt, 'Found songs by Sia');
    t.equal(16775, response.id, 'Sia id match');
  });
  GS.get(hardAuthor, (error, response) => {
    const qt = response.urls.some((s) => s === 'http://genius.com/Frank-sinatra-always-lyrics');
    t.equal(true, qt, 'Found songs by Frank Sinatra');
  });
  GS.getByID({ id: easyAuthorID, author: easyAuthor }, (error, response) => {
    const qt = response.urls.some((s) => s === 'http://genius.com/Sia-chandelier-lyrics');
    t.equal(true, qt, 'Found songs by ID for Sia');
  });
});
