import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, 
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true }, 
    issue_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    invoice_lines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvoiceLine', required: true }], 
    total: { type: Number, required: true } 
});


export default mongoose.model('Invoice', invoiceSchema);  // ES module export
