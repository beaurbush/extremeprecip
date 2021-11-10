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

router.get('/rawdata', function (req, res) {
  getAllData().then(function(data){
    res.send(data);
  }).catch(function(filteredData){
    res.send(filteredData);
  })
});

router.get('/insertdata', function (req, res) {
  InsertData().then(function(data){
    res.render('insertdata', { data } );
  }).catch(function(filteredData){
    res.send(filteredData);
  })
});

router.get('/dataremoved', function (req, res) {
  RemoveData().then(function(data){
    res.render('dataremoved', { data } );
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

async function getAllData(){
  const result = await client.execute('SELECT date, latitude, longitude, "precipitation.amount" FROM betterbotz."Belton20" LIMIT 1 ALLOW FILTERING');
  return result.rows;
}

async function InsertData(){
  const result = await client.execute('INSERT INTO betterbotz."Belton20" (date, latitude, longitude, "precipitation.amount") VALUES ($$2021-11-09$$, 30, -97.5, 125) IF NOT EXISTS');
  return result.rows;
}

async function RemoveData(){
  const result = await client.execute('DELETE FROM betterbotz."Belton20" WHERE date=$$2021-11-09$$ IF EXISTS');
  return result.rows;
}
