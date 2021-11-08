var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Extreme Precipitation Finder' });
});

router.get('/datareport', function (req, res) {
  getMoreData().then(function(data){
    res.render('datareport', { data } );
  }).catch(function(filteredData){
    res.send(filteredData);
  })
});

router.get('/list', function (req, res) {
  getMoreData().then(function(data){
    res.render('list', { data } );
  }).catch(function(filteredData){
    res.send(filteredData);
  })
});

router.get('/extremeprecip', function (req, res) {
  getMoreData().then(function(data){
    res.send(data);
  }).catch(function(filteredData){
    res.send(filteredData);
  })
});

module.exports = router;

const path = './.data/secure-connect-database_name.zip';
const { Client } = require('cassandra-driver');
const client = new Client({
cloud: { secureConnectBundle: path },
credentials: { username: process.env.ASTRAUSERNAME, password: process.env.ASTRAPASSWORD}
});

async function getMoreData(){
  const result = await client.execute('SELECT date, latitude, longitude, CAST("precipitation.amount" AS int) AS Precip FROM betterbotz."Belton20" WHERE "precipitation.amount" > 100 ALLOW FILTERING');
  return result.rows;
}
