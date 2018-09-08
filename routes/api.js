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

var Stock = require('../models/stock');


//Index page (static HTML)
router.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

router.get('/api/stock-prices',(req, res) => {
  let stock = req.query.stock;
  let price = 123.20;
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

  Stock.findOne({name: stock},(err, data) => {
      if (data.length == 0) {
        stock = new Stock ({name: stock, price: price, like: 1});
        stock.save((err,stock) => {console.log(stock);})
      } else {
        if (req.query.like) {data.like+=1};
        data.price = price;
        data.save((stock)=>{console.log('saved!')})
      }
    })

});

module.exports = router;