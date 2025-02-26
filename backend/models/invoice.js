import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, 
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true }, 
    issue_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    invoice_lines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvoiceLine', required: true }], 
    total: { type: Number, required: true } 
});

invoiceSchema.pre('save', async function(next) {
    if (this.invoice_lines && this.invoice_lines.length > 0) {
        try {
            const invoiceLines = await mongoose.model('InvoiceLine').find({
                '_id': { $in: this.invoice_lines }
            });

            this.total = invoiceLines.reduce((sum, line) => sum + line.total_price, 0);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        this.total = 0;
        next();
    }
});

export default mongoose.model('Invoice', invoiceSchema);  // ES module export
