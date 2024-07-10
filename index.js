const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const discogs = require('disconnect').Client;

const PORT = process.env.PORT || 5001

// const records = discogs().setConfig({ outputFormat: 'html' });
// const db = records.user().collection();
// db.getReleases('b1furc4t0r', 0, { page: 0, per_page: 100 }, function (err, data) {
//   console.log(data);
// });

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/music', (req, res) => {
    var col = new discogs().user().collection();
    col.getReleases('b1furc4t0r', 0, { page: 2, per_page: 75 }, function (err, data) { res.send(data.releases[0].basic_information.artists[0]); })
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))