
import { useState, useEffect } from "react";
import { ReportModalValidation } from "../utils/ReportModalValidation";

const EditReportModal = ({ show, onClose, reportId, onUpdate }) => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [reportData, setReportData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        indicators: {
            paymentStatus: {
                numberOfPaidInvoices: 0,
                numberOfUnpaidInvoices: 0,
                percentPaid: 0,
                percentUnpaid: 0,
            },
            overdueAnalysis: {
                numberOfOnTimeInvoices: 0,
                numberOfOverdueInvoices: 0,
                percentOverdue: 0,
                percentOnTime: 0,
            },
            invoicePatterns: {
                averageDaysToPayment: 0,
                medianDaysToPayment: 0,
                modeOfPaymentDelays: 0,
            },
            invoiceEntities: {
                numberOfIndividualClients: 0,
                numberOfCompanyClients: 0,
                numberOfIndividualVendors: 0,
                numberOfCompanyVendors: 0,
                numberOfProducts: 0,
                numberOfServices: 0,
                percentIndividualClients: 0,
                percentCompanyClients: 0,
                percentIndividualVendors: 0,
                percentCompanyVendors: 0,
                percentProducts: 0,
                percentServices: 0,
            },
        },
        selectedCheckboxes: {
            paymentStatus: {
                checkednumberOfPaidInvoices: false,
                checkednumberOfUnpaidInvoices: false,
                checkedpercentPaid: false,
                checkedpercentUnpaid: false,
            },
            overdueAnalysis: {
                checkednumberOfOnTimeInvoices: false,
                checkednumberOfOverdueInvoices: false,
                checkedPercentOverdue: false,
                checkedpercentOnTime: false,
            },
            invoicePatterns: {
                checkedaverageDaysToPayment: false,
                checkedmedianDaysToPayment: false,
                checkedmodeOfPaymentDelays: false,
            },
            invoiceEntities: {
                checkednumberOfIndividualClients: false,
                checkednumberOfCompanyClients: false,
                checkednumberOfIndividualVendors: false,
                checkednumberOfCompanyVendors: false,
                checkednumberOfProducts: false,
                checkednumberOfServices: false,
                checkedpercentIndividualClients: false,
                checkedpercentCompanyClients: false,
                checkedpercentIndividualVendors: false,
                checkedpercentCompanyVendors: false,
                checkedpercentProducts: false,
                checkedpercentServices: false,
            },
        },
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportData((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };
// Suppose you have your full invoice/payment data stored separately, e.g., in reportData.allInvoices

const handleCheckboxChange = (event, category, indicator) => {
  const { name, checked } = event.target;

  setReportData((prevData) => {
    // Update checkbox state
    const updatedCheckboxes = {
      ...prevData.selectedCheckboxes,
      [category]: {
        ...prevData.selectedCheckboxes[category],
        [name]: checked,
      },
    };

    // Apply filters based on dates and checkboxes
    const filteredInvoices = prevData.allInvoices.filter(inv => {
      // Example: filter by date range
      const startDate = new Date(prevData.startDate);
      const endDate = new Date(prevData.endDate);
      const invDate = new Date(inv.date);

      // Only include invoices within the selected date range
      return invDate >= startDate && invDate <= endDate;
    });

    // Now recalc indicators from filteredInvoices
    const updatedIndicators = calculateIndicators(filteredInvoices, updatedCheckboxes);

    return {
      ...prevData,
      selectedCheckboxes: updatedCheckboxes,
      indicators: updatedIndicators,
    };
  });
};


    useEffect(() => {
        if (reportId && show) {
            const fetchReportData = async () => {
                const token = localStorage.getItem('authToken');
                if (!token) return console.error("No token found");

                try {
                    const response = await fetch(`http://localhost:4000/routes/reports/${reportId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) throw new Error('Failed to fetch report data');
                    const data = await response.json();
                    setReportData(data);
                } catch (error) {
                    console.error("Error fetching report:", error);
                    setError(error.message);
                }
            };

            fetchReportData();
        }
    }, [reportId, show]);

    const handleSave = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) return alert("No token found.");

        setLoading(true);

        const validationErrors = ReportModalValidation(reportData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/routes/reports/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData),
            });

            if (!response.ok) {

                throw new Error(`Failed to update report: ${response.statusText}`);
            }
            const updatedReport = await response.json();
            onUpdate(updatedReport);
            onClose();

        } catch (error) {

            console.error("Error saving report data:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Update report</h3>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Title input */}
                    <div className="flex flex-col border-b-2 border-gray-400 pt-4 pb-4">
                        <label htmlFor="title" className="block font-semibold text-lg text-gray-800 mb-2">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={reportData.title}
                            onChange={handleInputChange}
                            placeholder="Enter report title"
                            className="p-2 border border-gray-300 rounded"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs text-center mt-2">{errors.title}</p>
                        )}
                    </div>

                    {/* Date range */}
                    <div className="flex space-x-4 pt-4 pb-2">
                        <div className="flex flex-col flex-1">
                            <label htmlFor="startDate" className="font-semibold text-gray-800 mb-2">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={reportData.startDate ? reportData.startDate.split('T')[0] : ''}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                            />
                            {errors.startDate && (
                                <p className="text-red-500 text-xs text-center mt-2">{errors.startDate}</p>
                            )}
                        </div>
                        <div className="flex flex-col flex-1">
                            <label htmlFor="endDate" className="font-semibold text-gray-800 mb-2">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={reportData.endDate ? reportData.endDate.split('T')[0] : ''}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                            />
                            {errors.endDate && (
                                <p className="text-red-500 text-xs text-center mt-2">{errors.endDate}</p>
                            )}
                        </div>

                    </div>
                    {errors.date_order && (
                        <p className="text-red-500 text-xs text-center mt-2">{errors.date_order}</p>
                    )}
                    <div className="flex flex-col border-b-2 border-gray-400 pt-4 pb-4">
                        <div className="flex flex-col flex-1">
                            <label htmlFor="description" className="font-semibold text-gray-800 mb-2">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={reportData.description}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs text-center mt-2">{errors.description}</p>
                            )}
                        </div>

                    </div>
                    <span className="font-semibold text-gray-800 text-center p-4 block">Payment Status</span>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfPaidInvoices"
                                checked={reportData.selectedCheckboxes.paymentStatus.checkednumberOfPaidInvoices}
                                onChange={(e) => handleCheckboxChange(e, 'paymentStatus', 'checkednumberOfPaidInvoices')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of paid invoices</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfUnpaidInvoices"
                                checked={reportData.selectedCheckboxes.paymentStatus.checkednumberOfUnpaidInvoices}
                                onChange={(e) => handleCheckboxChange(e, 'paymentStatus', 'checkednumberOfUnpaidInvoices')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of unpaid invoices</span>
                        </div>


                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentPaid"
                                checked={reportData.selectedCheckboxes.paymentStatus.checkedpercentPaid}
                                onChange={(e) => handleCheckboxChange(e, 'paymentStatus', 'checkedpercentPaid')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percentage paid</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentUnpaid"
                                checked={reportData.selectedCheckboxes.paymentStatus.checkedpercentUnpaid}
                                onChange={(e) => handleCheckboxChange(e, 'paymentStatus', 'checkedpercentUnpaid')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percentage unpaid</span>
                        </div>

                    </div>


                    <span className="font-semibold text-gray-800 text-center p-4 block">Overdue Analysis</span>

                    {/* Overdue Analysis Group */}
                    <div className="grid grid-cols-2 gap-4">

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfOnTimeInvoices"
                                checked={reportData.selectedCheckboxes.overdueAnalysis.checkednumberOfOnTimeInvoices}
                                onChange={(e) => handleCheckboxChange(e, 'overdueAnalysis', 'checkednumberOfOnTimeInvoices')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices paid on time</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfOverdueInvoices"
                                checked={reportData.selectedCheckboxes.overdueAnalysis.checkednumberOfOverdueInvoices}
                                onChange={(e) => handleCheckboxChange(e, 'overdueAnalysis', 'checkednumberOfOverdueInvoices')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of overdue invoices</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedPercentOverdue"
                                checked={reportData.selectedCheckboxes.overdueAnalysis.checkedPercentOverdue}
                                onChange={(e) => handleCheckboxChange(e, 'overdueAnalysis', 'checkedPercentOverdue')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent overdue</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentOnTime"
                                checked={reportData.selectedCheckboxes.overdueAnalysis.checkedpercentOnTime}
                                onChange={(e) => handleCheckboxChange(e, 'overdueAnalysis', 'checkedpercentOnTime')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent on time</span>
                        </div>
                    </div>


                    <span className="font-semibold text-gray-800 text-center p-4 block">Invoice Entities</span>

                    {/* Invoice Entities Group */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfIndividualClients"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkednumberOfIndividualClients}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkednumberOfIndividualClients')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of Individual Clients</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfCompanyClients"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkednumberOfCompanyClients}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkednumberOfCompanyClients')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of Company Clients</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfIndividualVendors"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkednumberOfIndividualVendors}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkednumberOfIndividualVendors')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of Individual Vendors</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfCompanyVendors"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkednumberOfCompanyVendors}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkednumberOfCompanyVendors')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of Company Vendors</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfProducts"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkednumberOfProducts}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkednumberOfProducts')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of Products</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfServices"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkednumberOfServices}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkednumberOfServices')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of Services</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentIndividualClients"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkedpercentIndividualClients}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkedpercentIndividualClients')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent of Individual Clients</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentCompanyClients"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkedpercentCompanyClients}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkedpercentCompanyClients')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent of Company Clients</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentIndividualVendors"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkedpercentIndividualVendors}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkedpercentIndividualVendors')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent of Individual Vendors</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentCompanyVendors"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkedpercentCompanyVendors}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkedpercentCompanyVendors')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent of Company Vendors</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentProducts"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkedpercentProducts}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkedpercentProducts')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent of Products</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentServices"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkedpercentServices}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkedpercentServices')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent of Services</span>
                        </div>

                    </div>

                    <span className="font-semibold text-gray-800 text-center p-4 block">Invoice Trends</span>


                    {/* invoicePatterns Group */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedaverageDaysToPayment"
                                checked={reportData.selectedCheckboxes.invoicePatterns.checkedaverageDaysToPayment}
                                onChange={(e) => handleCheckboxChange(e, 'invoicePatterns', 'checkedaverageDaysToPayment')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Average days to payment</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedmedianDaysToPayment"
                                checked={reportData.selectedCheckboxes.invoicePatterns.checkedmedianDaysToPayment}
                                onChange={(e) => handleCheckboxChange(e, 'invoicePatterns', 'checkedmedianDaysToPayment')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Median days to payment</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedmodeOfPaymentDelays"
                                checked={reportData.selectedCheckboxes.invoicePatterns.checkedmodeOfPaymentDelays}
                                onChange={(e) => handleCheckboxChange(e, 'invoicePatterns', 'checkedmodeOfPaymentDelays')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Mode of days payment delays</span>
                        </div>
                    </div>
                    {errors.selectedCheckboxes && (
                        <p className="text-red-500 text-xs text-center mt-2">{errors.selectedCheckboxes}</p>
                    )}

                    {/* Submit button */}
                    <div className="flex justify-center mt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 px-4 py-2 font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400"
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditReportModal;