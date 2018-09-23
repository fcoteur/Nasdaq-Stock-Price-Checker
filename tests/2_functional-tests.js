/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      let likes;
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData', 'contains stockData');
          assert.isObject(res.body.stockData, 'contains an object');
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData', 'contains stockData');
          assert.isObject(res.body.stockData, 'contains an object');
          assert.isTrue(res.body.stockData.likes > 0,'likes are registered' );
          likes= res.body.stockData.likes; // keep data for next test
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData', 'contains stockData');
          assert.isObject(res.body.stockData, 'contains an object');
          assert.isTrue(res.body.stockData.likes > 0,'likes are registered' );
          assert.strictEqual(res.body.stockData.likes, likes,'likes are registered' );
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog', 'poop']})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData', 'contains stockData');
          assert.isArray(res.body.stockData, 'contains an Array');
          assert.strictEqual(res.body.stockData[0].rel_likes,-res.body.stockData[1].rel_likes,'likes are oposite' );
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog', 'poop'], like: true})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData', 'contains stockData');
          assert.isArray(res.body.stockData, 'contains an Array');
          assert.strictEqual(res.body.stockData[0].rel_likes,-res.body.stockData[1].rel_likes,'likes are oposite' );
          done();
        });
      });
      
    });

});
