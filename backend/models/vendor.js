const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
   vendor_id: { type: Number, unique: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    type: { type: String, enum: ['company', 'individual'], required: true },
    cif: { type: String, required: function () { return this.type === 'company'; } },
    cnp: { type: String, required: function () { return this.type === 'individual'; } },
  });
  
  module.exports = mongoose.model('Vendor', vendorSchema);