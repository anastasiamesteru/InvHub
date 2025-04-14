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
                numberOfPaidInvoices: false,
                numberOfUnpaidInvoices: false,
                numberOfPendingInvoices: false,
                paymentComplianceRate: false,
            },
            overdueAnalysis: {
                numberOfInvoicesPaidOnTime: false,
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


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportData((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const computeAndUpdateIndicators = (reportData, invoices = []) => {
        if (!Array.isArray(invoices) || !reportData?.indicators) return reportData;

        const { startDate, endDate, indicators } = reportData;
        const start = new Date(startDate);
        const end = new Date(endDate);

        const filtered = invoices.filter(inv => {
            const issue = new Date(inv.issue_date);
            return issue >= start && issue <= end;
        });

        let resultIndicators = {
            paymentStatus: {},
            overdueAnalysis: {},
            financials: {}
        };

        if (indicators.paymentStatus) {
            let paid = 0, unpaid = 0, pending = 0, onTime = 0;

            filtered.forEach(inv => {
                const status = inv.paymentStatus?.trim().toLowerCase();
                const paymentDate = new Date(inv.paymentDate);
                const dueDate = new Date(inv.dueDate);

                if (status === "paid") {
                    paid += 1;
                    if (paymentDate <= dueDate) onTime += 1;
                } else if (status === "unpaid") {
                    unpaid += 1;
                } else if (status === "pending") {
                    pending += 1;
                }
            });

            if (indicators.paymentStatus.numberOfPaidInvoices) resultIndicators.paymentStatus.numberOfPaidInvoices = paid;
            if (indicators.paymentStatus.numberOfUnpaidInvoices) resultIndicators.paymentStatus.numberOfUnpaidInvoices = unpaid;
            if (indicators.paymentStatus.numberOfPendingInvoices) resultIndicators.paymentStatus.numberOfPendingInvoices = pending;
            if (indicators.paymentStatus.paymentComplianceRate)
                resultIndicators.paymentStatus.paymentComplianceRate = paid > 0 ? (onTime / paid) * 100 : 0;
        }

        if (indicators.overdueAnalysis) {
            let paidOnTime = 0, overdue = 0, over30 = 0, over60 = 0, over90 = 0;

            filtered.forEach(inv => {
                const status = inv.paymentStatus?.trim().toLowerCase();
                const paymentDate = new Date(inv.paymentDate);
                const dueDate = new Date(inv.dueDate);
                const daysLate = (paymentDate - dueDate) / (1000 * 60 * 60 * 24);

                if (status === "paid" && paymentDate <= dueDate) {
                    paidOnTime += 1;
                }

                if (status === "unpaid" && paymentDate > dueDate) {
                    overdue += 1;
                    if (daysLate > 30 && daysLate <= 60) over30 += 1;
                    else if (daysLate > 60 && daysLate <= 90) over60 += 1;
                    else if (daysLate > 90) over90 += 1;
                }
            });

            if (indicators.overdueAnalysis.numberOfInvoicesPaidOnTime)
                resultIndicators.overdueAnalysis.numberOfInvoicesPaidOnTime = paidOnTime;
            if (indicators.overdueAnalysis.numberOfOverdueInvoices)
                resultIndicators.overdueAnalysis.numberOfOverdueInvoices = overdue;
            if (indicators.overdueAnalysis.numberOfInvoicesOverdue30Days)
                resultIndicators.overdueAnalysis.numberOfInvoicesOverdue30Days = over30;
            if (indicators.overdueAnalysis.numberOfInvoicesOverdue60Days)
                resultIndicators.overdueAnalysis.numberOfInvoicesOverdue60Days = over60;
            if (indicators.overdueAnalysis.numberOfInvoicesOverdue90PlusDays)
                resultIndicators.overdueAnalysis.numberOfInvoicesOverdue90PlusDays = over90;
        }

        if (indicators.financials?.outstandingBalance) {
            const totalOutstanding = filtered.reduce((sum, inv) => sum + (inv.outstandingAmount || 0), 0);
            resultIndicators.financials.outstandingBalance = totalOutstanding;
        }

        return {
            ...reportData,
            indicators: {
                ...reportData.indicators,
                paymentStatus: {
                    ...reportData.indicators.paymentStatus,
                    ...resultIndicators.paymentStatus
                },
                overdueAnalysis: {
                    ...reportData.indicators.overdueAnalysis,
                    ...resultIndicators.overdueAnalysis
                },
                financials: {
                    ...reportData.indicators.financials,
                    ...resultIndicators.financials
                }
            }
        };

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
                    numberOfPendingInvoices: reportData.indicators.paymentStatus.numberOfPendingInvoices,
                    paymentComplianceRate: reportData.indicators.paymentStatus.paymentComplianceRate,
                },
                overdueAnalysis: {
                    numberOfInvoicesPaidOnTime: reportData.indicators.overdueAnalysis.numberOfInvoicesPaidOnTime,
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
                    <div className="flex flex-col gap-2">
    <span className="font-semibold text-gray-800">Payment Status</span>

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
        <span>Number of invoices paid on time</span>
    </div>

    <div className="flex items-center space-x-1">
        <input
            type="checkbox"
            checked={reportData.indicators.paymentStatus?.paymentComplianceRate || false}
            onChange={(e) =>
                setReportData(prev => ({
                    ...prev,
                    indicators: {
                        ...prev.indicators,
                        paymentStatus: {
                            ...prev.indicators.paymentStatus,
                            paymentComplianceRate: e.target.checked
                        }
                    }
                }))
            }
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
</div>

{/* Financials Group */}
<div className="flex flex-col gap-2">
    <span className="font-semibold text-gray-800">Financials</span>

    <div className="flex items-center space-x-1">
        <input
            type="checkbox"
            checked={reportData.indicators.financials?.outstandingBalance || false}
            onChange={(e) =>
                setReportData(prev => ({
                    ...prev,
                    indicators: {
                        ...prev.indicators,
                        financials: {
                            ...prev.indicators.financials,
                            outstandingBalance: e.target.checked
                        }
                    }
                }))
            }
            className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
        />
        <span>Outstanding balance</span>
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
