const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
// const discogs = require('disconnect').Client;
const fs = require('fs');
// const col = new discogs().user().collection();
const axios = require('axios');

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const musicData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const links = JSON.parse(fs.readFileSync('url.json', 'utf8'));

const PORT = process.env.PORT || 5001

function showTimes() {
  const times = process.env.TIMES || 5
  let result = ''
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result
}

// let list = [];

// let i = 0;
// musicData.releases.forEach(data => {
//   setTimeout(() => {
//     axios.get(data.basic_information.resource_url).then(response => {
//       list.push(response.data.uri);
//     }).catch(error => {
//       console.log(error);
//     })
//   }, 2000 * i++)
// })

// for (entry in list) {
//   console.log(entry);
// }

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// (async () => {
//   for (let index = 403; index < musicData.releases.length; ++index) {
//     // Wait to do this one until a delay after the last one
//     if (index > 0) {
//       await delay(5000); // 5000 for five seconds
//     }
//       // Do this one
//       /*self.*/axios.get(musicData.releases[index].basic_information.resource_url).then(response => {
//       //list.push(response.data.uri);
//       fs.readFile('url.json', function (err, data) {
//         let json = JSON.parse(data)
//         json.push(response.data.uri)
//         fs.writeFileSync("url.json", JSON.stringify(json))
//       })
//     })
//   }
// })();



express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/music', { releases: musicData.releases, links: links }))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null };
      res.render('pages/db', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  // .get('/music', (req, res) => {
  //   col.getReleases('b1furc4t0r', 0, { page: 0, per_page: 1000 }, function (err, data) {
  //     res.render('pages/music', { data })
  //     // console.log(data.releases[0]);
  //   })
  // })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))