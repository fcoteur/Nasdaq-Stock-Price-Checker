/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var express   = require('express');
var router    = express.Router();
var ip        = require('ip');

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
  let myIp= ip.address();
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
  if (!Array.isArray(stock)) {
    Stock.findOne({name: stock},(err, data) => {
        if (!data) {
          stock = new Stock ({name: stock});
          stock.price = price;
          if (req.query.like == 'true') {
            stock.likes = 1;
            stock.ips = myIp;
          };
          stock.save((err,stock) => {console.log('New stock saved');})
          res.send(stock);
        } else {
          console.log(data.ips.indexOf(myIp) );
          if ((req.query.like == 'true') && (data.ips.indexOf(myIp) == -1)) {
            data.likes += 1;
            data.ips.push(myIp);
          };
          data.price += 10;
          data.save((err, stock) => {
            if (err) return console.log(err);
            console.log('stock updated');
          })
          res.send(data);
        }
      })
    }
  
  if ((Array.isArray(stock)) && (stock.length == 2)) {
  //  console.log('ok!');
    let output =[];
    let likes1;
    Stock.findOne({name: stock[0]},(err, data1) => {
      console.log(data1);
      output.push({
        stock: data1.stock,
        price: data1.price,
        rel_likes: 0
      });
      likes1 = data1.likes;
      Stock.findOne({name: stock[1]},(err, data2) => {
        console.log(data2);
        output.push({
          stock: data2.stock,
          price: data2.price,
          rel_likes: data2.likes - likes1
        });
        output[0].rel_likes -=  output[1].rel_likes;
      });
    });
    req.send(output);
  }
  
});

module.exports = router;
