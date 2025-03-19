import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientAddress: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientType: { type: String, enum: ['company', 'individual'], required: true }, 
    clientCifcnp: { type: String, required: true }, 

    vendorName: { type: String, required: true },
    vendorAddress: { type: String, required: true },
    vendorEmail: { type: String, required: true },
    vendorType: { type: String, enum: ['company', 'individual'], required: true },
    vendorCifcnp: { type: String, required: true }, 

    issue_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    invoice_lines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvoiceLine', required: true }], 
    total: { type: Number, required: true } 
});

export default mongoose.model('Invoice', invoiceSchema);
