const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    id: { type: String, unique: true }, // Add custom ID
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    type: { type: String, enum: ['company', 'individual'], required: true },
    cif: { type: String, required: function () { return this.type === 'company'; } },
    cnp: { type: String, required: function () { return this.type === 'individual'; } },
  });
  
  module.exports = mongoose.model('Client', clientSchema);