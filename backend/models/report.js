import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reportNumber: { type: String, required: true },
    
    title: { type: String, required: true }, 
    startDate: { type: Date, required: true },
    endDate: {  type: Date,  required: true}, 
    indicators: {
        paymentStatus: {
            numberOfPaidInvoices: { type: Boolean, default: false }, 
            numberOfUnpaidInvoices: { type: Boolean, default: false },
            numberOfInvoicesPaidOnTime: { type: Boolean, default: false },
            paymentComplianceRate: { type: Boolean, default: false },
        },
        overdueAnalysis: {
            numberOfOverdueInvoices: { type: Boolean, default: false },
            numberOfInvoicesOverdue30Days: { type: Boolean, default: false },
            numberOfInvoicesOverdue60Days: { type: Boolean, default: false },
            numberOfInvoicesOverdue90PlusDays: { type: Boolean, default: false },
        },
        financials: {
            outstandingBalance: { type: Boolean, default: false }, 
        },
    },
});

export default mongoose.model('Report', reportSchema);
