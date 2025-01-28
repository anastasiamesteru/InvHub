const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    id: { type: String, unique: true }, 
    name: { type: String, required: true },
    description: { type: String,},
    price: { type: Number, min:0, required:true },
    type: {
      type: String,
      enum: ['product', 'service'], 
      required: true,
    },
    um: {
      type: String,
      enum: ['kg', 'pcs', 'liters', 'hour', 'day', 'service'], 
      default: 'pcs',
    },
  });
  
  module.exports = mongoose.model('Item', itemSchema);