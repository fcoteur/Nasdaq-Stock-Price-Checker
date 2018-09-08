var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StockSchema = new Schema(
  {
    name: {type: String, required: true},
    price: {type: Number},
    udpate: {type: Date, default: Date.now}
  }
);

module.exports = mongoose.model('Stock', StockSchema);