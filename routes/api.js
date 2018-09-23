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

function getStockPrice(stock) {
  return Math.round(Math.random()*10000)/100 // random value as google financial services are not available
};

router.get('/api/stock-prices',(req, res) => {
  
  let stock = req.query.stock;
  let myIp= ip.address();
  
  if (!Array.isArray(stock)) {
    Stock.findOne({name: stock},(err, data) => {
        if (!data) { 
          // stock not found in database
          stock = new Stock ({name: stock});
          stock.price = getStockPrice(stock);
          if (req.query.like == 'true') {
            stock.likes = 1;
            stock.ips = myIp;
          };
          stock.save((err,stock) => {
            if (err) return console.log(err);
            //console.log('New stock saved');
          })
          res.send({
            stockData: {
              "stock": stock.name,
              "price": stock.price,
              "likes": stock.likes              
            }
          });
        } else {
          // stock is already present in the database
          //console.log(data.ips.indexOf(myIp) );
          if ((req.query.like == 'true') && (data.ips.indexOf(myIp) == -1)) {
            data.likes += 1;
            data.ips.push(myIp);
          };
          data.price += getStockPrice(stock); // placeholder as google financial services are not available
          data.save((err, stock) => {
            if (err) return console.log(err);
            //console.log('stock updated');
          })
          res.send({
            stockData: {
              "stock": data.name,
              "price": data.price,
              "likes": data.likes              
            }
          });
        }
      })
    }
  
  if ((Array.isArray(stock)) && (stock.length == 2)) {    
    let output = {};
    let likes1;
    
    Stock.findOne({name: stock[0]},(err, data1) => {
      //console.log(data1);
      output.stockData = [{
        stock: data1.name,
        price: data1.price,
        rel_likes: 0
      }];
      
      likes1 = data1.likes;
      
      Stock.findOne({name: stock[1]},(err, data2) => {
        //console.log(data2);
        output.stockData.push({
          stock: data2.name,
          price: data2.price,
          rel_likes: data2.likes - likes1
        });
        output.stockData[0].rel_likes -=  output.stockData[1].rel_likes;
        res.send(output);
      });      
    });
    
  
  }
  
});

module.exports = router;
