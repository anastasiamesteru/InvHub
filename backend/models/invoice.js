const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, 
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true }, 
    issue_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    invoice_lines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvoiceLine', required: true }], 
    total: { type: Number, required: true } 
});

module.exports = mongoose.model('Invoice', invoiceSchema);
