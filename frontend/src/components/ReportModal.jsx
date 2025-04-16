import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportModal = ({ isOpen, onClose, fetchReports }) => {
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);

    const [reportData, setReportData] = useState({
        title: '',
        startDate: '',
        endDate: '',
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
                checkednumberOfInvoicesOverdue30Days: false,
                checkednumberOfInvoicesOverdue60Days: false,
                checkednumberOfInvoicesOverdue90PlusDays: false,
                checkedpercentOverdue: false,
                checkedpercentOverdue30: false,
                checkedpercentOverdue60: false,
                checkedpercentOverdue90Plus: false,
                checkedpercentOnTime: false,
            },
            invoicePatterns: {
                checkedaverageDaysToPayment: false,
                checkedmedianDaysToPayment: false,
                checkedmodeOfPaymentDelays: false,
            },
        },
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
                numberOfInvoicesOverdue30Days: 0,
                numberOfInvoicesOverdue60Days: 0,
                numberOfInvoicesOverdue90PlusDays: 0,
                percentOverdue: 0,
                percentOverdue30: 0,
                percentOverdue60: 0,
                percentOverdue90Plus: 0,
                percentOnTime: 0,
            },
            invoicePatterns: {
                averageDaysToPayment: 0,
                medianDaysToPayment: 0,
                modeOfPaymentDelays: 0,
            },
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportData((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const fetchInvoices = async () => {
        try {
            const response = await fetch('http://localhost:4000/routes/invoices/getall');
            if (!response.ok) throw new Error('Failed to fetch invoices');
            const data = await response.json();
            setInvoices(data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const computeAndUpdateIndicators = (reportData) => {
        const { startDate, endDate, selectedCheckboxes } = reportData;

        // Filter invoices based on the date range
        const invoicesInRange = invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.issue_date);
            return invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate);
        });

        const totalInvoices = invoicesInRange.length;
        const updatedIndicators = {};

        // Payment Status Indicators
        let numberOfPaidInvoices = 0;
        let numberOfUnpaidInvoices = 0;
        let percentPaid = 0;
        let percentUnpaid = 0;
        let x = 0;

        if (selectedCheckboxes.paymentStatus && selectedCheckboxes.paymentStatus.checkednumberOfPaidInvoices) {
            numberOfPaidInvoices = invoicesInRange.filter(invoice => invoice.paymentStatus === 'Paid').length;
        }

        if (selectedCheckboxes.paymentStatus && selectedCheckboxes.paymentStatus.checkednumberOfUnpaidInvoices) {
            numberOfUnpaidInvoices = invoicesInRange.filter(invoice => invoice.paymentStatus !== 'Paid').length;
        }

        if (selectedCheckboxes.paymentStatus && selectedCheckboxes.paymentStatus.checkedpercentPaid) {
            x = invoicesInRange.filter(invoice => invoice.paymentStatus === 'Paid').length;
            percentPaid = totalInvoices > 0 ? (x / totalInvoices) * 100 : 0;
        }

        if (selectedCheckboxes.paymentStatus && selectedCheckboxes.paymentStatus.checkedpercentUnpaid) {
            x = invoicesInRange.filter(invoice => invoice.paymentStatus === 'Unpaid').length;

            percentUnpaid = totalInvoices > 0 ? (x / totalInvoices) * 100 : 0;
        }

        updatedIndicators.paymentStatus = {
            numberOfPaidInvoices,
            numberOfUnpaidInvoices,
            percentPaid,
            percentUnpaid,
        };
        // Overdue Analysis Indicators
        let numberOfOnTimeInvoices = 0;
        let numberOfOverdueInvoices = 0;
        let numberOfInvoicesOverdue30Days = 0;
        let numberOfInvoicesOverdue60Days = 0;
        let numberOfInvoicesOverdue90PlusDays = 0;
        let percentOverdue = 0;
        let percentOverdue30 = 0;
        let percentOverdue60 = 0;
        let percentOverdue90Plus = 0;
        let percentOnTime = 0;
        
        const today = new Date();
        const unpaidInvoices = invoicesInRange.filter(invoice => invoice.paymentStatus === 'Unpaid');
        
        // numberOfOverdueInvoices
        if (selectedCheckboxes.overdueAnalysis?.checkednumberOfOverdueInvoices) {
            numberOfOverdueInvoices = unpaidInvoices.filter(invoice =>
                invoice.due_date && new Date(invoice.due_date) < today
            ).length;
        }
        
        // numberOfInvoicesOverdue30Days
        if (selectedCheckboxes.overdueAnalysis?.checkednumberOfInvoicesOverdue30Days) {
            numberOfInvoicesOverdue30Days = unpaidInvoices.filter(invoice => {
                if (!invoice.due_date) return false;
                const overdueDays = (today - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24);
                return overdueDays > 30 && overdueDays <= 60;
            }).length;
        }
        
        // numberOfInvoicesOverdue60Days
        if (selectedCheckboxes.overdueAnalysis?.checkednumberOfInvoicesOverdue60Days) {
            numberOfInvoicesOverdue60Days = unpaidInvoices.filter(invoice => {
                if (!invoice.due_date) return false;
                const overdueDays = (today - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24);
                return overdueDays > 60 && overdueDays <= 90;
            }).length;
        }
        
        // numberOfInvoicesOverdue90PlusDays
        if (selectedCheckboxes.overdueAnalysis?.checkednumberOfInvoicesOverdue90PlusDays) {
            numberOfInvoicesOverdue90PlusDays = unpaidInvoices.filter(invoice => {
                if (!invoice.due_date) return false;
                const overdueDays = (today - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24);
                return overdueDays > 90;
            }).length;
        }
        
        // percentOverdue
        if (selectedCheckboxes.overdueAnalysis?.checkedpercentOverdue) {
            const overdueCount = unpaidInvoices.filter(invoice =>
                invoice.due_date && new Date(invoice.due_date) < today
            ).length;
            percentOverdue = totalInvoices > 0 ? (overdueCount / totalInvoices) * 100 : 0;
        }
        
        // percentOverdue30
        if (selectedCheckboxes.overdueAnalysis?.checkedpercentOverdue30) {
            const count = unpaidInvoices.filter(invoice => {
                if (!invoice.due_date) return false;
                const overdueDays = (today - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24);
                return overdueDays > 30 && overdueDays <= 60;
            }).length;
            percentOverdue30 = totalInvoices > 0 ? (count / totalInvoices) * 100 : 0;
        }
        
        // percentOverdue60
        if (selectedCheckboxes.overdueAnalysis?.checkedpercentOverdue60) {
            const count = unpaidInvoices.filter(invoice => {
                if (!invoice.due_date) return false;
                const overdueDays = (today - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24);
                return overdueDays > 60 && overdueDays <= 90;
            }).length;
            percentOverdue60 = totalInvoices > 0 ? (count / totalInvoices) * 100 : 0;
        }
        
        // percentOverdue90Plus
        if (selectedCheckboxes.overdueAnalysis?.checkedpercentOverdue90Plus) {
            const count = unpaidInvoices.filter(invoice => {
                if (!invoice.due_date) return false;
                const overdueDays = (today - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24);
                return overdueDays > 90;
            }).length;
            percentOverdue90Plus = totalInvoices > 0 ? (count / totalInvoices) * 100 : 0;
        }
        
        // numberOfOnTimeInvoices
        if (selectedCheckboxes.overdueAnalysis?.checkednumberOfOnTimeInvoices) {
            numberOfOnTimeInvoices = invoicesInRange.filter(invoice =>
                invoice.paymentDate && invoice.due_date &&
                new Date(invoice.paymentDate) <= new Date(invoice.due_date)
            ).length;
        }
        
        // percentOnTime
        if (selectedCheckboxes.overdueAnalysis?.checkedpercentOnTime) {
            const onTimeCount = invoicesInRange.filter(invoice =>
                invoice.paymentDate && invoice.due_date &&
                new Date(invoice.paymentDate) <= new Date(invoice.due_date)
            ).length;
            percentOnTime = totalInvoices > 0 ? (onTimeCount / totalInvoices) * 100 : 0;
        }
        
        // Update the indicators
        updatedIndicators.overdueAnalysis = {
            numberOfOnTimeInvoices,
            numberOfOverdueInvoices,
            numberOfInvoicesOverdue30Days,
            numberOfInvoicesOverdue60Days,
            numberOfInvoicesOverdue90PlusDays,
            percentOverdue,
            percentOverdue30,
            percentOverdue60,
            percentOverdue90Plus,
            percentOnTime,
        };
        

        // Invoice Patterns Indicators
        let averageDaysToPayment = 0;
        let medianDaysToPayment = 0;
        let modeOfPaymentDelays = 0;

        if (selectedCheckboxes.invoicePatterns.checkedaverageDaysToPayment) {
            const paidInvoices = invoicesInRange.filter(invoice =>
                invoice.paymentStatus === 'Paid' && invoice.paymentDate && invoice.issue_date
            );
        
            const paymentDelays = paidInvoices.map(invoice => {
                const delay = (new Date(invoice.paymentDate) - new Date(invoice.issue_date)) / (1000 * 60 * 60 * 24);
                return Math.round(delay);
            });
        
            averageDaysToPayment = paymentDelays.length > 0
                ? paymentDelays.reduce((sum, val) => sum + val, 0) / paymentDelays.length
                : 0;
        }
        
        if (selectedCheckboxes.invoicePatterns.checkedmedianDaysToPayment) {
            const paidInvoices = invoicesInRange.filter(invoice =>
                invoice.paymentStatus === 'Paid' && invoice.paymentDate && invoice.issue_date
            );
        
            const paymentDelays = paidInvoices.map(invoice => {
                const delay = (new Date(invoice.paymentDate) - new Date(invoice.issue_date)) / (1000 * 60 * 60 * 24);
                return Math.round(delay);
            });
        
            function calculateMedian(arr) {
                if (arr.length === 0) return 0;
                const sorted = [...arr].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                return sorted.length % 2 === 0
                    ? (sorted[mid - 1] + sorted[mid]) / 2
                    : sorted[mid];
            }
        
            medianDaysToPayment = calculateMedian(paymentDelays);
        }
        
        if (selectedCheckboxes.invoicePatterns.checkedmodeOfPaymentDelays) {
            const paidInvoices = invoicesInRange.filter(invoice =>
                invoice.paymentStatus === 'Paid' && invoice.paymentDate && invoice.issue_date
            );
        
            const paymentDelays = paidInvoices.map(invoice => {
                const delay = (new Date(invoice.paymentDate) - new Date(invoice.issue_date)) / (1000 * 60 * 60 * 24);
                return Math.round(delay);
            });

            function calculateMode(arr) {
                if (arr.length === 0) return 0;
                const freqMap = {};
                arr.forEach(val => freqMap[val] = (freqMap[val] || 0) + 1);
                let mode = arr[0], maxCount = 0;
                for (const val in freqMap) {
                    if (freqMap[val] > maxCount) {
                        mode = val;
                        maxCount = freqMap[val];
                    }
                }
                return parseInt(mode);
            }
        
            modeOfPaymentDelays = calculateMode(paymentDelays);
        }
        
        // Update indicators
        updatedIndicators.invoicePatterns = {
            averageDaysToPayment: Math.round(averageDaysToPayment),
            medianDaysToPayment,
            modeOfPaymentDelays,
        };


        return {
            ...reportData,
            indicators: updatedIndicators,
        };
    };

    const handleCheckboxChange = (event, category, indicator) => {
        const { name, checked } = event.target;

        setReportData((prevData) => ({
            ...prevData,
            selectedCheckboxes: {
                ...prevData.selectedCheckboxes,
                [category]: {
                    ...prevData.selectedCheckboxes[category],
                    [name]: checked,
                },
            },
        }));
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

        const updatedReportData = computeAndUpdateIndicators(reportData);

        const payload = {
            reportNumber: updatedReportData.reportNumber,
            title: updatedReportData.title,
            startDate: updatedReportData.startDate,
            endDate: updatedReportData.endDate,
            indicators: updatedReportData.indicators,
            selectedCheckboxes: updatedReportData.selectedCheckboxes
        };

        try {
            const response = await axios.post('http://localhost:4000/routes/reports/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Report response:', response);
            await fetchReports();
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
                            placeholder="Enter report title"
                            required
                            className="p-2 border border-gray-300 rounded"
                        />
                    </div>

                    {/* Date range */}
                    <div className="flex space-x-4 pt-4 pb-4">
                        <div className="flex flex-col flex-1">
                            <label htmlFor="startDate" className="font-semibold text-gray-800 mb-2">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={reportData.startDate}
                                onChange={handleInputChange}
                                required
                                className="p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label htmlFor="endDate" className="font-semibold text-gray-800 mb-2">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={reportData.endDate}
                                onChange={handleInputChange}
                                required
                                className="p-2 border border-gray-300 rounded"
                            />
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
                                name="checkednumberOfInvoicesOverdue30Days"
                                checked={reportData.selectedCheckboxes.overdueAnalysis.checkednumberOfInvoicesOverdue30Days}
                                onChange={(e) => handleCheckboxChange(e, 'overdueAnalysis', 'checkednumberOfInvoicesOverdue30Days')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices overdue by 30 days</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfInvoicesOverdue60Days"
                                checked={reportData.selectedCheckboxes.overdueAnalysis.checkednumberOfInvoicesOverdue60Days}
                                onChange={(e) => handleCheckboxChange(e, 'overdueAnalysis', 'checkednumberOfInvoicesOverdue60Days')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices overdue by 60 days</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkednumberOfInvoicesOverdue90PlusDays"
                                checked={reportData.selectedCheckboxes.overdueAnalysis.checkednumberOfInvoicesOverdue90PlusDays}
                                onChange={(e) => handleCheckboxChange(e, 'overdueAnalysis', 'checkednumberOfInvoicesOverdue90PlusDays')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices overdue by 90+ days</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentOverdue"
                                checked={reportData.selectedCheckboxes.overdueAnalysis.checkedpercentOverdue}
                                onChange={(e) => handleCheckboxChange(e, 'overdueAnalysis', 'checkedpercentOverdue')}

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

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentOverdue30"
                                checked={reportData.selectedCheckboxes.overdueAnalysis.checkedpercentOverdue30}
                                onChange={(e) => handleCheckboxChange(e, 'overdueAnalysis', 'checkedpercentOverdue30')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent overdue by 30 days</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentOverdue60"
                                checked={reportData.selectedCheckboxes.overdueAnalysis.checkedpercentOverdue60}
                                onChange={(e) => handleCheckboxChange(e, 'overdueAnalysis', 'checkedpercentOverdue60')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent overdue by 60 days</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                name="checkedpercentOverdue90Plus"
                                checked={reportData.selectedCheckboxes.overdueAnalysis.checkedpercentOverdue90Plus}
                                onChange={(e) => handleCheckboxChange(e, 'overdueAnalysis', 'checkedpercentOverdue90Plus')}

                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent overdue by 90+ days</span>
                        </div>
                    </div>

                    <span className="font-semibold text-gray-800 text-center p-4 block">Invoice Trends</span>

                    {/* Overdue Analysis Group */}

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


                    {/* Submit button */}
                    <div className="flex justify-center mt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 px-4 py-2 font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400"
                        >
                            {loading ? 'Generating...' : 'Create Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
