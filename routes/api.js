/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var express = require('express');
var router = express.Router();

var request = require('request');

var mongoose = require('mongoose');
var mongoDB = process.env.MONGO_DB;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Index page (static HTML)
router.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

router.get('/api/stock-prices',(req, res) => {
  let stock = req.query.stock;
  let like, price;
  
  if (req.query.like) {like=1} else {like=-1}
  price = 123.2;
  /*
  request.get(
    ' https://finance.google.com/finance/info?q=NASDAQ%3a'+stock, 
    function (error, response, body) {
      console.log('error:', error); 
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body); 
      price = body;
    }
  */

  let stockData = {
    "stockData":{
      "stock":stock,
      "price":price,
      "likes":like
    }
  }
  res.send(stockData);
  

});

module.exports = router;