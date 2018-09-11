var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StockSchema = new Schema(
  {
    name: {type: String, required: true},
    price: {type: Number},
    likes: {type: Number, default: 0},
    udpate: {type: Date, default: Date.now},
    ips: [{type: String, default: []}]
  }
);

module.exports = mongoose.model('Stock', StockSchema);