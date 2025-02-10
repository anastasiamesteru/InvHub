const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    client_id: { type: Number, unique: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    type: { type: String, enum: ['company', 'individual'], required: true },
    cif: { type: Number, required: function () { return this.type === 'company'; } },
    cnp: { type: Number, required: function () { return this.type === 'individual'; } },
  });
  
  module.exports = mongoose.model('Client', clientSchema);