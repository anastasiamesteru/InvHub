import React, { useState } from 'react';

const ReportModal = ({ isOpen, onClose }) => {
    const [reportDetails, setReportDetails] = useState({
        title: '',
        startDate: '',
        endDate: '',
        indicators: [], // for checkboxes
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setReportDetails((prevDetails) => {
            const newIndicators = checked
                ? [...prevDetails.indicators, value]
                : prevDetails.indicators.filter((indicator) => indicator !== value);
            return {
                ...prevDetails,
                indicators: newIndicators,
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Report submitted:', reportDetails);
        // Add logic to submit report here
        onClose();
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
                        <label htmlFor="title" className="block text-sm font-small text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={reportDetails.title}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Date Range Section */}
                    <div className="flex flex-col border-b-2 border-gray-400 pt-4 pb-4">
                        <label className="block text-sm font-small text-gray-700 mb-2">Select Invoices</label>
                        <div className="flex justify-between">
                            <div className="w-1/2 pr-2 flex flex-col items-center">
                                <label htmlFor="startDate" className="block text-sm font-small text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={reportDetails.startDate}
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
                                    value={reportDetails.endDate}
                                    onChange={(e) => handleInputChange(e)}
                                    name="endDate"
                                    className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Indicators Section */}
                    <div className="flex flex-col border-b-2 border-gray-400 pt-4 pb-4">
                        <label className="block text-sm font-xs text-gray-700 mb-2">Indicators</label>
                        <div className="flex flex-col gap-2 grid grid-cols-2 gap-4 p-4 ">
                            <div className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    value="noPaidInvoices"
                                    checked={reportDetails.indicators.includes('noPaidInvoices')}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                                />
                                <span>number of paid invoices</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    value="noUnpaidInvoices"
                                    checked={reportDetails.indicators.includes('noUnpaidInvoices')}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                                />
                                <span>number of unpaid invoices</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    value="noOfOverdueInvoices"
                                    checked={reportDetails.indicators.includes('noOfOverdueInvoices')}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                                />
                                <span>number of overdue invoices</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    value="noInvoicesPaidOnTime"
                                    checked={reportDetails.indicators.includes('noInvoicesPaidOnTime')}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                                />
                                <span>number of invoices paid on time</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    value="paymentComplianceRate"
                                    checked={reportDetails.indicators.includes('paymentComplianceRate')}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                                />
                                <span>payment compliance rate</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    value="avgPaymentDelay"
                                    checked={reportDetails.indicators.includes('avgPaymentDelay')}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                                />
                                <span>average payment delay</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    value="outstandingBalance"
                                    checked={reportDetails.indicators.includes('outstandingBalance')}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                                />
                                <span>outstanding balance</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    value="noInvoicesOverdue30Days"
                                    checked={reportDetails.indicators.includes('noInvoicesOverdue30Days')}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                                />
                                <span>number of invoices overdue by 30 days</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    value="noInvoicesOverdue60Days"
                                    checked={reportDetails.indicators.includes('noInvoicesOverdue60Days')}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                                />
                                <span>number of invoices overdue by 60 days</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    value="noInvoicesOverdue90+Days"
                                    checked={reportDetails.indicators.includes('noInvoicesOverdue90+Days')}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                                />
                                <span>number of invoices overdue by 90+ days</span>
                            </div>
                        </div>

                    </div>


                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-700"
                        >
                            Add Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
