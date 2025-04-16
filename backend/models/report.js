import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reportNumber: String,
    title: String,
    startDate: Date,
    endDate: Date,
    indicators: {
        paymentStatus: {
            numberOfPaidInvoices: { type: Number },
            numberOfUnpaidInvoices: { type: Number },
            percentPaid: { type: Number },
            percentUnpaid: { type: Number },
        },
        overdueAnalysis: {
            numberOfOnTimeInvoices: { type: Number },
            numberOfOverdueInvoices: { type: Number },
            numberOfInvoicesOverdue30Days: { type: Number },
            numberOfInvoicesOverdue60Days: { type: Number },
            numberOfInvoicesOverdue90PlusDays: { type: Number },
            percentOverdue: { type: Number },
            percentOverdue30: { type: Number },
            percentOverdue60: { type: Number },
            percentOverdue90Plus: { type: Number },
            percentOnTime: { type: Number },
        },
        invoicePatterns: {
            averageDaysToPayment: { type: Number },
            medianDaysToPayment: { type: Number },
            modeOfPaymentDelays: { type: Number },
        },
    },
    selectedCheckboxes: {
        paymentStatus: {
            checkednumberOfPaidInvoices: { type: Boolean },
            checkednumberOfUnpaidInvoices: { type: Boolean },
            checkedpercentPaid: { type: Boolean },
            checkedpercentUnpaid: { type: Boolean },
        },
        overdueAnalysis: {
            checkednumberOfOnTimeInvoices: { type: Boolean },
            checkednumberOfOverdueInvoices: { type: Boolean },
            checkednumberOfInvoicesOverdue30Days: { type: Boolean },
            checkednumberOfInvoicesOverdue60Days: { type: Boolean },
            checkednumberOfInvoicesOverdue90PlusDays: { type: Boolean },
            checkedpercentOverdue30: { type: Boolean },
            checkedpercentOverdue90: { type: Boolean },
            checkedpercentOverdue90Plus: { type: Boolean },
            checkedpercentOnTime: { type: Boolean },
        },
        invoicePatterns: {
            checkedaverageDaysToPayment: { type: Boolean },
            checkedmedianDaysToPayment: { type: Boolean },
            checkedmodeOfPaymentDelays: { type: Boolean },
        },
    },
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
