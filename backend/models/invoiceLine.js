const mongoose = require('mongoose');

const invoiceLineSchema = new mongoose.Schema({
    line_id: { type: Number, unique: true }, 
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, 
    item_name: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, 
    item_price: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, 
    item_um: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, 

});

module.exports = mongoose.model('InvoiceLine', invoiceLineSchema);
