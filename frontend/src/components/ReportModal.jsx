import React, { useState, useEffect } from 'react';

const ReportModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);

    const [reportData, setReportData] = useState({
        reportNumber: '',
        title: '',
        startDate: '',
        endDate: '',
        indicators: {
            paymentStatus: {
                numberOfPaidInvoices: false,
                numberOfUnpaidInvoices: false,
                numberOfInvoicesPaidOnTime: false,
                paymentComplianceRate: false,
            },
            overdueAnalysis: {
                numberOfOverdueInvoices: false,
                numberOfInvoicesOverdue30Days: false,
                numberOfInvoicesOverdue60Days: false,
                numberOfInvoicesOverdue90PlusDays: false,
            },
            financials: {
                outstandingBalance: false,
            },
        },
    });
   
    const computeAndUpdateIndicators = (reportData) => {
        const { startDate, endDate } = reportData;  // Get the start and end dates from reportData
        const filteredInvoices = invoices.filter(invoice => {
            const issueDate = new Date(invoice.issueDate);
            return issueDate >= new Date(startDate) && issueDate <= new Date(endDate);
        });

        // Update payment status metrics
        if (reportData.indicators.paymentStatus) {
            const numberOfPaidInvoices = filteredInvoices.filter(invoice => invoice.status === 'Paid').length;
            const numberOfInvoicesPaidOnTime = filteredInvoices.filter(invoice => invoice.status === 'Paid' && new Date(invoice.paymentDate) <= new Date(invoice.dueDate)).length;
    
            // Set computed values
            reportData.indicators.paymentStatus.numberOfPaidInvoices = numberOfPaidInvoices;
            reportData.indicators.paymentStatus.numberOfInvoicesPaidOnTime = numberOfInvoicesPaidOnTime;
            reportData.indicators.paymentStatus.paymentComplianceRate = (numberOfInvoicesPaidOnTime / numberOfPaidInvoices) * 100;
        }

        // Update overdue analysis metrics
        if (reportData.indicators.overdueAnalysis) {
            const numberOfOverdueInvoices = filteredInvoices.filter(invoice => new Date(invoice.dueDate) < new Date(invoice.paymentDate) && invoice.status === 'Unpaid').length;
            const numberOfInvoicesOverdue30Days = filteredInvoices.filter(invoice => {
                const overdueDays = (new Date(invoice.paymentDate) - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24);
                return overdueDays > 30 && overdueDays <= 60 && invoice.status === 'Unpaid';
            }).length;
            const numberOfInvoicesOverdue60Days = filteredInvoices.filter(invoice => {
                const overdueDays = (new Date(invoice.paymentDate) - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24);
                return overdueDays > 60 && overdueDays <= 90 && invoice.status === 'Unpaid';
            }).length;
            const numberOfInvoicesOverdue90PlusDays = filteredInvoices.filter(invoice => {
                const overdueDays = (new Date(invoice.paymentDate) - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24);
                return overdueDays > 90 && invoice.status === 'Unpaid';
            }).length;
    
            // Set computed values
            reportData.indicators.overdueAnalysis.numberOfOverdueInvoices = numberOfOverdueInvoices;
            reportData.indicators.overdueAnalysis.numberOfInvoicesOverdue30Days = numberOfInvoicesOverdue30Days;
            reportData.indicators.overdueAnalysis.numberOfInvoicesOverdue60Days = numberOfInvoicesOverdue60Days;
            reportData.indicators.overdueAnalysis.numberOfInvoicesOverdue90PlusDays = numberOfInvoicesOverdue90PlusDays;
    
            // Additional percentages (if needed)
            reportData.indicators.overdueAnalysis.overduePercentage = (numberOfOverdueInvoices / filteredInvoices.length) * 100;
            reportData.indicators.overdueAnalysis.overdue30DaysPercentage = (numberOfInvoicesOverdue30Days / numberOfOverdueInvoices) * 100;
            reportData.indicators.overdueAnalysis.overdue60DaysPercentage = (numberOfInvoicesOverdue60Days / numberOfOverdueInvoices) * 100;
            reportData.indicators.overdueAnalysis.overdue90PlusDaysPercentage = (numberOfInvoicesOverdue90PlusDays / numberOfOverdueInvoices) * 100;
        }

        // Update financials metrics
        if (reportData.indicators.financials && filteredInvoices.length > 0) {
            const outstandingBalance = filteredInvoices.reduce((total, invoice) => total + invoice.outstandingAmount, 0);
            reportData.indicators.financials.outstandingBalance = outstandingBalance;
        }

        // Return the updated reportData with computed metrics
        return reportData;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportData((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        const [category, indicator] = value.split('.');

        setReportData((prevState) => {
            const updatedIndicators = { ...prevState.indicators };

            // Add or remove indicator based on checkbox state
            if (checked) {
                if (!updatedIndicators[category]) {
                    updatedIndicators[category] = {};
                }
                updatedIndicators[category][indicator] = true;
            } else {
                if (updatedIndicators[category]) {
                    delete updatedIndicators[category][indicator];
                }
            }

            // Now compute and update indicators with computed metrics
            const updatedReportData = {
                ...prevState,
                indicators: updatedIndicators,
            };

            // Compute and update the indicators with the computed metrics
            return computeAndUpdateIndicators(updatedReportData);
        });
    };

    useEffect(() => {
        if (isOpen) {
            // Generate report number
            const generatedReportNumber = `REP-${Math.floor(Math.random() * 9000) + 1000}`;
            setReportData(prev => ({
                ...prev,
                reportNumber: generatedReportNumber,
            }));
        }
    }, [isOpen]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        const payload = {
            reportNumber: reportData.reportNumber,
            title: reportData.title,
            startDate: reportData.startDate,
            endDate: reportData.endDate,
            indicators: {
                paymentStatus: {
                    numberOfPaidInvoices: reportData.indicators.paymentStatus.numberOfPaidInvoices,
                    numberOfUnpaidInvoices: reportData.indicators.paymentStatus.numberOfUnpaidInvoices,
                    numberOfInvoicesPaidOnTime: reportData.indicators.paymentStatus.numberOfInvoicesPaidOnTime,
                    paymentComplianceRate: reportData.indicators.paymentStatus.paymentComplianceRate,
                },
                overdueAnalysis: {
                    numberOfOverdueInvoices: reportData.indicators.overdueAnalysis.numberOfOverdueInvoices,
                    numberOfInvoicesOverdue30Days: reportData.indicators.overdueAnalysis.numberOfInvoicesOverdue30Days,
                    numberOfInvoicesOverdue60Days: reportData.indicators.overdueAnalysis.numberOfInvoicesOverdue60Days,
                    numberOfInvoicesOverdue90PlusDays: reportData.indicators.overdueAnalysis.numberOfInvoicesOverdue90PlusDays,
                },
                financials: {
                    outstandingBalance: reportData.indicators.financials.outstandingBalance,
                },
            },
            invoices,  // Include invoices here
        };

        try {
            const response = await axios.post('http://localhost:4000/routes/reports/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Report response:', response);
            await fetchReports();  // Fetch the reports again after submission

            onClose();
        } catch (error) {
            console.error('Error posting report data:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                alert(`Error: ${error.response?.data?.message || error.message}`);
            } else {
                alert(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Create Report</h3>
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
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Date Range Section */}
                    <div className="flex flex-col border-b-2 border-gray-400 pt-4 pb-4">
                        <label className="block font-semibold text-lg text-gray-800 mb-2">Select Invoices</label>
                        <div className="flex justify-between">
                            <div className="w-1/2 pr-2 flex flex-col items-center">
                                <label htmlFor="startDate" className="block text-sm font-small text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={reportData.startDate}
                                    onChange={(e) => handleInputChange(e)}
                                    name="startDate"
                                    className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div className="w-1/2 pl-2 flex flex-col items-center">
                                <label htmlFor="endDate" className="block text-sm font-small text-gray-700 mb-2">
                                    End Date
                                </label>
                                <input
                                    id="endDate"
                                    type="date"
                                    value={reportData.endDate}
                                    onChange={(e) => handleInputChange(e)}
                                    name="endDate"
                                    className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Status Group */}
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold text-gray-800">Payment Status</span>
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                value="paymentStatus.numberOfPaidInvoices" // Use the category and indicator format
                                checked={reportData.indicators.paymentStatus?.numberOfPaidInvoices || false} // Check if it's true in the nested object
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of paid invoices</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                value="paymentStatus.numberOfUnpaidInvoices"
                                checked={reportData.indicators.paymentStatus?.numberOfUnpaidInvoices || false}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of unpaid invoices</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                value="paymentStatus.numberOfInvoicesPaidOnTime"
                                checked={reportData.indicators.paymentStatus?.numberOfInvoicesPaidOnTime || false}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices paid on time</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                value="paymentStatus.paymentComplianceRate"
                                checked={reportData.indicators.paymentStatus?.paymentComplianceRate || false}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Payment compliance rate</span>
                        </div>
                    </div>

                    {/* Overdue Analysis Group */}
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold text-gray-800">Overdue Analysis</span>
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                value="overdueAnalysis.numberOfOverdueInvoices"
                                checked={reportData.indicators.overdueAnalysis?.numberOfOverdueInvoices || false}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of overdue invoices</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                value="overdueAnalysis.numberOfInvoicesOverdue30Days"
                                checked={reportData.indicators.overdueAnalysis?.numberOfInvoicesOverdue30Days || false}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices overdue by 30 days</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                value="overdueAnalysis.numberOfInvoicesOverdue60Days"
                                checked={reportData.indicators.overdueAnalysis?.numberOfInvoicesOverdue60Days || false}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices overdue by 60 days</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                value="overdueAnalysis.numberOfInvoicesOverdue90PlusDays"
                                checked={reportData.indicators.overdueAnalysis?.numberOfInvoicesOverdue90PlusDays || false}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices overdue by 90+ days</span>
                        </div>
                    </div>

                    {/* Financials Group */}
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold text-gray-800">Financials</span>
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                value="financials.outstandingBalance"
                                checked={reportData.indicators.financials?.outstandingBalance || false}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Outstanding balance</span>
                        </div>
                    </div>



                    <div className="flex justify-center mt-2">
                        <button type="submit" disabled={loading} className="mt-4 px-4 py-2 font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400">
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
