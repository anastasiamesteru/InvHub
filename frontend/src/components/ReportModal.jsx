import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportModal = ({ isOpen, onClose, fetchReports }) => {
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);

    const [reportData, setReportData] = useState({
        reportNumber: '',
        title: '',
        startDate: '',
        endDate: '',
        indicators: {
            paymentStatus: {
                numberOfPaidInvoices: 0,
                numberOfUnpaidInvoices: 0,
                numberOfPendingInvoices: 0,
                paymentComplianceRate: 0,
                percentPaid: 0,
                percentUnpaid: 0,
                percentPending: 0,
            },
            overdueAnalysis: {
                numberOfInvoicesPaidOnTime: 0,
                numberOfOverdueInvoices: 0,
                numberOfInvoicesOverdue30Days: 0,
                numberOfInvoicesOverdue60Days: 0,
                numberOfInvoicesOverdue90PlusDays: 0,
                percentOnTime: 0,
                percentOverdue: 0,
                percentOverdue30: 0,
                percentOverdue60: 0,
                percentOverdue90Plus: 0,
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
        const { startDate, endDate } = reportData;
    
        // Filter invoices within the given date range
        const invoicesInRange = invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.issue_date);
            return invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate);
        });
    
        const totalInvoices = invoicesInRange.length;
    
        // Payment Status Indicators
        if (reportData.indicators.paymentStatus?.numberOfPaidInvoices) {
            const numberOfPaidInvoices = invoicesInRange.filter(invoice => invoice.paymentStatus === 'Paid').length;
            reportData.indicators.paymentStatus.numberOfPaidInvoices = numberOfPaidInvoices;
        }
    
        if (reportData.indicators.paymentStatus?.numberOfUnpaidInvoices) {
            const numberOfUnpaidInvoices = invoicesInRange.filter(invoice => invoice.paymentStatus === 'Unpaid').length;
            reportData.indicators.paymentStatus.numberOfUnpaidInvoices = numberOfUnpaidInvoices;
        }
    
        if (reportData.indicators.paymentStatus?.numberOfPendingInvoices) {
            const numberOfPendingInvoices = invoicesInRange.filter(invoice => invoice.timeStatus === 'Pending').length;
            reportData.indicators.paymentStatus.numberOfPendingInvoices = numberOfPendingInvoices;
        }
    
        if (reportData.indicators.paymentStatus?.percentPaid) {
            const numberOfPaidInvoices = invoicesInRange.filter(invoice => invoice.paymentStatus === 'Paid').length;
            const percentPaid = totalInvoices > 0 ? (numberOfPaidInvoices / totalInvoices) * 100 : 0;
            reportData.indicators.paymentStatus.percentPaid = percentPaid;
        }
    
        if (reportData.indicators.paymentStatus?.percentUnpaid) {
            const numberOfUnpaidInvoices = invoicesInRange.filter(invoice => invoice.paymentStatus === 'Unpaid').length;
            const percentUnpaid = totalInvoices > 0 ? (numberOfUnpaidInvoices / totalInvoices) * 100 : 0;
            reportData.indicators.paymentStatus.percentUnpaid = percentUnpaid;
        }
    
        if (reportData.indicators.paymentStatus?.percentPending) {
            const numberOfPendingInvoices = invoicesInRange.filter(invoice => invoice.timeStatus === 'Pending').length;
            const percentPending = totalInvoices > 0 ? (numberOfPendingInvoices / totalInvoices) * 100 : 0;
            reportData.indicators.paymentStatus.percentPending = percentPending;
        }
    
        // Overdue Analysis
        if (reportData.indicators.overdueAnalysis) {
            const overdueInvoices = invoicesInRange.filter(invoice => invoice.paymentStatus === 'Unpaid');
    
            const numberOfOverdueInvoices = overdueInvoices.filter(invoice =>
                new Date(invoice.paymentDate) > new Date(invoice.due_date)
            ).length;
    
            const overdue30to60Days = overdueInvoices.filter(invoice => {
                const overdueDays = (new Date(invoice.paymentDate) - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24);
                return overdueDays > 30 && overdueDays <= 60;
            }).length;
    
            const overdue60to90Days = overdueInvoices.filter(invoice => {
                const overdueDays = (new Date(invoice.paymentDate) - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24);
                return overdueDays > 60 && overdueDays <= 90;
            }).length;
    
            const overdue90PlusDays = overdueInvoices.filter(invoice => {
                const overdueDays = (new Date(invoice.paymentDate) - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24);
                return overdueDays > 90;
            }).length;
    
            const percentOverdue = totalInvoices > 0 ? (numberOfOverdueInvoices / totalInvoices) * 100 : 0;
            const percentOverdue30 = totalInvoices > 0 ? (overdue30to60Days / totalInvoices) * 100 : 0;
            const percentOverdue60 = totalInvoices > 0 ? (overdue60to90Days / totalInvoices) * 100 : 0;
            const percentOverdue90Plus = totalInvoices > 0 ? (overdue90PlusDays / totalInvoices) * 100 : 0;
    
            reportData.indicators.overdueAnalysis.numberOfOverdueInvoices = numberOfOverdueInvoices;
            reportData.indicators.overdueAnalysis.numberOfInvoicesOverdue30Days = overdue30to60Days;
            reportData.indicators.overdueAnalysis.numberOfInvoicesOverdue60Days = overdue60to90Days;
            reportData.indicators.overdueAnalysis.numberOfInvoicesOverdue90PlusDays = overdue90PlusDays;
            reportData.indicators.overdueAnalysis.percentOverdue = percentOverdue;
            reportData.indicators.overdueAnalysis.percentOverdue30 = percentOverdue30;
            reportData.indicators.overdueAnalysis.percentOverdue60 = percentOverdue60;
            reportData.indicators.overdueAnalysis.percentOverdue90Plus = percentOverdue90Plus;
        }
    
        // Invoice Patterns
        if (reportData.indicators.invoicePatterns) {
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
    
            const average = paymentDelays.length > 0
                ? paymentDelays.reduce((sum, val) => sum + val, 0) / paymentDelays.length
                : 0;
    
            reportData.indicators.invoicePatterns.averageDaysToPayment = Math.round(average);
            reportData.indicators.invoicePatterns.medianDaysToPayment = calculateMedian(paymentDelays);
            reportData.indicators.invoicePatterns.modeOfPaymentDelays = calculateMode(paymentDelays);
        }
    
        return reportData;
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

        const updatedReportData = computeAndUpdateIndicators(reportData);


        const payload = {
            reportNumber: updatedReportData.reportNumber,
            title: updatedReportData.title,
            startDate: updatedReportData.startDate,
            endDate: updatedReportData.endDate,
            indicators: {
                paymentStatus: {
                    numberOfPaidInvoices: updatedReportData.indicators.paymentStatus.numberOfPaidInvoices,
                    numberOfUnpaidInvoices: updatedReportData.indicators.paymentStatus.numberOfUnpaidInvoices,
                    numberOfPendingInvoices: updatedReportData.indicators.paymentStatus.numberOfPendingInvoices,
                    percentPaid: updatedReportData.indicators.paymentStatus.percentPaid,
                    percentUnpaid: updatedReportData.indicators.paymentStatus.percentUnpaid,
                    percentPending: updatedReportData.indicators.paymentStatus.percentPending,


                },
                overdueAnalysis: {
                    numberOfInvoicesPaidOnTime: updatedReportData.indicators.overdueAnalysis.numberOfInvoicesPaidOnTime,
                    numberOfOverdueInvoices: updatedReportData.indicators.overdueAnalysis.numberOfOverdueInvoices,
                    numberOfInvoicesOverdue30Days: updatedReportData.indicators.overdueAnalysis.numberOfInvoicesOverdue30Days,
                    numberOfInvoicesOverdue60Days: updatedReportData.indicators.overdueAnalysis.numberOfInvoicesOverdue60Days,
                    numberOfInvoicesOverdue90PlusDays: updatedReportData.indicators.overdueAnalysis.numberOfInvoicesOverdue90PlusDays,
                    percentOverdue: updatedReportData.indicators.overdueAnalysis.percentOverdue,
                    percentOverdue30: updatedReportData.indicators.overdueAnalysis.percentOverdue30,
                    percentOverdue60: updatedReportData.indicators.overdueAnalysis.percentOverdue60,
                    percentOverdue90Plus: updatedReportData.indicators.overdueAnalysis.percentOverdue90Plus,

                },
                invoicePatterns: {
                    averageDaysToPayment: updatedReportData.indicators.invoicePatterns.averageDaysToPayment,
                    medianDaysToPayment: updatedReportData.indicators.invoicePatterns.medianDaysToPayment,
                    modeOfPaymentDelays: updatedReportData.indicators.invoicePatterns.modeOfPaymentDelays,

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
                    <span className="font-semibold text-gray-800 text-center p-4 block">Payment Status</span>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.paymentStatus?.numberOfPaidInvoices || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            paymentStatus: {
                                                ...prev.indicators.paymentStatus,
                                                numberOfPaidInvoices: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of paid invoices</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.paymentStatus?.numberOfUnpaidInvoices || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            paymentStatus: {
                                                ...prev.indicators.paymentStatus,
                                                numberOfUnpaidInvoices: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of unpaid invoices</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.paymentStatus?.numberOfPendingInvoices || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            paymentStatus: {
                                                ...prev.indicators.paymentStatus,
                                                numberOfPendingInvoices: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of pending invoices</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.paymentStatus?.percentPaid || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            paymentStatus: {
                                                ...prev.indicators.paymentStatus,
                                                percentPaid: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percentage paid</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.paymentStatus?.percentUnpaid || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            paymentStatus: {
                                                ...prev.indicators.paymentStatus,
                                                percentUnpaid: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percentage unpaid</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.paymentStatus?.percentPending || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            paymentStatus: {
                                                ...prev.indicators.paymentStatus,
                                                percentPending: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percentage pending</span>
                        </div>
                    </div>


                    <span className="font-semibold text-gray-800 text-center p-4 block">Overdue Analysis</span>

                    {/* Overdue Analysis Group */}
                    <div className="grid grid-cols-2 gap-4">

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.overdueAnalysis?.numberOfInvoicesPaidOnTime || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            overdueAnalysis: {
                                                ...prev.indicators.overdueAnalysis,
                                                numberOfInvoicesPaidOnTime: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices paid on time</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.overdueAnalysis?.numberOfOverdueInvoices || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            overdueAnalysis: {
                                                ...prev.indicators.overdueAnalysis,
                                                numberOfOverdueInvoices: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of overdue invoices</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.overdueAnalysis?.numberOfInvoicesOverdue30Days || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            overdueAnalysis: {
                                                ...prev.indicators.overdueAnalysis,
                                                numberOfInvoicesOverdue30Days: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices overdue by 30 days</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.overdueAnalysis?.numberOfInvoicesOverdue60Days || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            overdueAnalysis: {
                                                ...prev.indicators.overdueAnalysis,
                                                numberOfInvoicesOverdue60Days: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices overdue by 60 days</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.overdueAnalysis?.numberOfInvoicesOverdue90PlusDays || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            overdueAnalysis: {
                                                ...prev.indicators.overdueAnalysis,
                                                numberOfInvoicesOverdue90PlusDays: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Number of invoices overdue by 90+ days</span>
                        </div>


                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.overdueAnalysis?.percentOverdue30 || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            overdueAnalysis: {
                                                ...prev.indicators.overdueAnalysis,
                                                percentOverdue30: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent overdue by 30 days</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.overdueAnalysis?.percentOverdue60 || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            overdueAnalysis: {
                                                ...prev.indicators.overdueAnalysis,
                                                percentOverdue60: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent overdue by 60 days</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.overdueAnalysis?.percentOverdue90Plus || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            overdueAnalysis: {
                                                ...prev.indicators.overdueAnalysis,
                                                percentOverdue90Plus: e.target.checked
                                            }
                                        }
                                    }))
                                }
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
                                checked={reportData.indicators.invoicePatterns?.averageDaysToPayment || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            invoicePatterns: {
                                                ...prev.indicators.invoicePatterns,
                                                averageDaysToPayment: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Average days to payment</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.invoicePatterns?.medianDaysToPayment || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            invoicePatterns: {
                                                ...prev.indicators.invoicePatterns,
                                                medianDaysToPayment: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Median days to payment</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={reportData.indicators.invoicePatterns?.modeOfPaymentDelays || false}
                                onChange={(e) =>
                                    setReportData(prev => ({
                                        ...prev,
                                        indicators: {
                                            ...prev.indicators,
                                            invoicePatterns: {
                                                ...prev.indicators.invoicePatterns,
                                                modeOfPaymentDelays: e.target.checked
                                            }
                                        }
                                    }))
                                }
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Mode of days payment delays</span>
                        </div>
                    </div>

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
};

export default ReportModal;
