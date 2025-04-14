import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reportNumber: { type: String, required: true },

    title: { type: String, required: true }, 
    startDate: { type: Date, required: true },
    endDate: {  type: Date,  required: true}, 
    indicators: {
        paymentStatus: {
            numberOfPaidInvoices: { type: Number }, 
            numberOfUnpaidInvoices: { type: Number },
            numberOfPendingInvoices:{ type: Number },
            paymentComplianceRate: { type: Number },
        },
        overdueAnalysis: {
            numberOfInvoicesPaidOnTime: { type: Number },
            numberOfOverdueInvoices: { type: Number },
            numberOfInvoicesOverdue30Days: { type: Number },
            numberOfInvoicesOverdue60Days: { type: Number },
            numberOfInvoicesOverdue90PlusDays: { type: Number },
        },
        financials: {
            outstandingBalance: { type: Number }, 
        },
    },
});

export default mongoose.model('Report', reportSchema);
