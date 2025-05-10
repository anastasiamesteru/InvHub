import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportModal = ({ isOpen, onClose, fetchReports }) => {
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);

    const [reportData, setReportData] = useState({
        title: '',
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
                percentPercent: 0,
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
                checkedpercentPercent: false,
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
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/routes/invoices/getall', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch invoices');
            const data = await response.json();
            setInvoices(data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
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

        let numberOfOnTimeInvoices = 0;
        let numberOfOverdueInvoices = 0;
        let percentOverdue = 0;
        let percentOnTime = 0;
        
        if (selectedCheckboxes.paymentStatus && selectedCheckboxes.overdueAnalysis.checkednumberOfOnTimeInvoices) {
            // Count invoices with timeStatus as 'On Time'
            numberOfOnTimeInvoices = invoicesInRange.filter(invoice => invoice.timeStatus === 'On Time').length;
        }
        
        if (selectedCheckboxes.paymentStatus && selectedCheckboxes.overdueAnalysis.checkednumberOfOverdueInvoices) {
            // Count invoices with timeStatus as 'Overdue'
            numberOfOverdueInvoices = invoicesInRange.filter(invoice => invoice.timeStatus === 'Overdue').length;
        }
        
        if (selectedCheckboxes.paymentStatus && selectedCheckboxes.overdueAnalysis.checkedpercentOnTime) {
            // Calculate percentage of on-time invoices
            const onTimeCount = invoicesInRange.filter(invoice => invoice.timeStatus === 'On Time').length;
            percentOnTime = totalInvoices > 0 ? (onTimeCount / totalInvoices) * 100 : 0;
        }
        
        if (selectedCheckboxes.paymentStatus && selectedCheckboxes.overdueAnalysis.checkedPercentOverdue) {
            // Calculate percentage of overdue invoices
            const overdueCount = invoicesInRange.filter(invoice => invoice.timeStatus === 'Overdue').length;
            percentOverdue = totalInvoices > 0 ? (overdueCount / totalInvoices) * 100 : 0;
        }
        
        // Updating the indicators
        updatedIndicators.overdueAnalysis = {
            numberOfOnTimeInvoices,
            numberOfOverdueInvoices,
            percentOverdue,
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

        // Update indicators for Invoice Patterns
        updatedIndicators.invoicePatterns = {
            averageDaysToPayment: Math.round(averageDaysToPayment),
            medianDaysToPayment,
            modeOfPaymentDelays,
        };

        // Invoice Entities Indicators
        let numberOfIndividualClients = 0;
        let numberOfCompanyClients = 0;
        let numberOfIndividualVendors = 0;
        let numberOfCompanyVendors = 0;
        let numberOfProducts = 0;
        let numberOfServices = 0;
        let percentIndividualClients = 0;
        let percentCompanyClients = 0;
        let percentIndividualVendors = 0;
        let percentCompanyVendors = 0;
        let percentProducts = 0;
        let percentPercent = 0;

        // Count the entities
        if (selectedCheckboxes.invoiceEntities?.checkednumberOfIndividualClients) {
            numberOfIndividualClients = invoicesInRange.filter(invoice => invoice.clientType === 'Individual').length;
        }

        if (selectedCheckboxes.invoiceEntities?.checkednumberOfCompanyClients) {
            numberOfCompanyClients = invoicesInRange.filter(invoice => invoice.clientType === 'Company').length;
        }

        if (selectedCheckboxes.invoiceEntities?.checkednumberOfIndividualVendors) {
            numberOfIndividualVendors = invoicesInRange.filter(invoice => invoice.vendorType === 'Individual').length;
        }

        if (selectedCheckboxes.invoiceEntities?.checkednumberOfCompanyVendors) {
            numberOfCompanyVendors = invoicesInRange.filter(invoice => invoice.vendorType === 'Company').length;
        }

        if (selectedCheckboxes.invoiceEntities?.checkednumberOfProducts) {
            numberOfProducts = invoicesInRange.filter(invoice => invoice.items.type === 'Product').length;
        }

        if (selectedCheckboxes.invoiceEntities?.checkednumberOfServices) {
            numberOfServices = invoicesInRange.filter(invoice => invoice.items.type === 'Service').length;
        }

        // Calculate percentages
        percentIndividualClients = totalInvoices > 0 ? (numberOfIndividualClients / totalInvoices) * 100 : 0;
        percentCompanyClients = totalInvoices > 0 ? (numberOfCompanyClients / totalInvoices) * 100 : 0;
        percentIndividualVendors = totalInvoices > 0 ? (numberOfIndividualVendors / totalInvoices) * 100 : 0;
        percentCompanyVendors = totalInvoices > 0 ? (numberOfCompanyVendors / totalInvoices) * 100 : 0;
        percentProducts = totalInvoices > 0 ? (numberOfProducts / totalInvoices) * 100 : 0;
        percentPercent = totalInvoices > 0 ? (numberOfServices / totalInvoices) * 100 : 0;

        updatedIndicators.invoiceEntities = {
            numberOfIndividualClients,
            numberOfCompanyClients,
            numberOfIndividualVendors,
            numberOfCompanyVendors,
            numberOfProducts,
            numberOfServices,
            percentIndividualClients,
            percentCompanyClients,
            percentIndividualVendors,
            percentCompanyVendors,
            percentProducts,
            percentPercent,
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

        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        if (!token) {
            console.error("No token found");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/routes/reports/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Add the Authorization header with the token
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
                                name="checkedpercentPercent"
                                checked={reportData.selectedCheckboxes.invoiceEntities.checkedpercentPercent}
                                onChange={(e) => handleCheckboxChange(e, 'invoiceEntities', 'checkedpercentPercent')}
                                className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                            />
                            <span>Percent Total</span>
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
