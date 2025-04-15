import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import {
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const [statusCounts, setStatusCounts] = useState({
        onTime: 0,
        overdue: 0,
        paid: 0,
        unpaid: 0,
        pending: 0
    });

    // Fetch invoices from the API
    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://localhost:4000/routes/invoices/getall');
            setInvoices(response.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Data processing for charts
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyData = useMemo(() => {
        const data = {};
        // Initialize the status tracking for line chart
        const statusOverTime = {
            onTime: [],
            overdue: [],
            pending: []
        };

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        invoices.forEach(inv => {
            const date = new Date(inv.issue_date);
            const month = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

            if (!data[month]) {
                data[month] = { month, totalAmount: 0, count: 0, onTime: 0, overdue: 0, pending: 0 };
            }

            data[month].totalAmount += Number(inv.total_amount || 0);
            data[month].count += 1;

            // Update status counts for line chart
            if (inv.timeStatus?.trim().toLowerCase() === "on time") data[month].onTime += 1;
            if (inv.timeStatus?.trim().toLowerCase() === "overdue") data[month].overdue += 1;
            if (inv.timeStatus?.trim().toLowerCase() === "pending") data[month].pending += 1;

            if (inv.items && Array.isArray(inv.items)) {
                inv.items.forEach(item => {
                    const type = item.type?.toLowerCase();
                    if (type === 'product') itemTypeCounts.product += 1;
                    else if (type === 'service') itemTypeCounts.service += 1;
                });
            }
        });

        // Format line chart data for status counts
        const lineChartData = Object.values(data).sort((a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`)).map(monthData => ({
            month: monthData.month,
            onTime: monthData.onTime,
            overdue: monthData.overdue,
            pending: monthData.pending
        }));

        // Pie chart data for Paid vs Unpaid
        const pieData = [
            { name: 'Paid', value: statusCounts.paid },
            { name: 'Unpaid', value: statusCounts.unpaid }
        ];

        // Get bar chart data for the entire year
        const barChartData = Object.values(data)
            .filter((d) => {
                const monthDate = new Date(d.month);
                return monthDate.getFullYear() === currentYear;
            })
            .sort((a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`));

        return {
            lineChartData,
            barChartData,
            pieData
        };
    }, [invoices, statusCounts]);

    useEffect(() => {
        const processInvoices = () => {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            let onTime = 0;
            let overdue = 0;
            let paid = 0;
            let unpaid = 0;
            let pending = 0;

            invoices.forEach((invoice) => {
                const invoiceDate = new Date(invoice.issue_date);

                const isCurrentMonth = invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear;

                if (isCurrentMonth) {
                    if (invoice.timeStatus?.trim().toLowerCase() === "pending") pending += 1;
                    if (invoice.timeStatus?.trim().toLowerCase() === "on time") onTime += 1;
                    if (invoice.timeStatus?.trim().toLowerCase() === "overdue") overdue += 1;

                    if (invoice.paymentStatus?.trim().toLowerCase() === "paid") paid += 1;
                    if (invoice.paymentStatus?.trim().toLowerCase() === "unpaid") unpaid += 1;
                }
            });

            // Update status counts
            setStatusCounts({ onTime, overdue, paid, unpaid, pending });
        };

        if (invoices.length > 0) {
            processInvoices();
        }
    }, [invoices]);

    return (
        <div className="p-6 space-y-10 min-h-screen bg-violet-50">
            {/* Header Section with Photo */}
            <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-2xl font-semibold text-gray-800">Welcome back!</h1>
                    <p className="text-gray-600 mt-2">
                        Here's a quick overview of your invoice performance this month.
                    </p>
                </div>
            </div>
    
            {/* Main Content Section */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Summary Cards on the Left */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col gap-6">
                        {/* Yellow Card on Top */}
                        <div className="bg-yellow-500 p-4 rounded-lg shadow-md text-center h-28 flex flex-col justify-center">
                            <h3 className="text-white text-base font-semibold">Total Collected</h3>
                            <p className="text-2xl font-bold text-white">
                                {statusCounts.paid + statusCounts.unpaid}
                            </p>
                        </div>
    
                        {/* Other Cards Below */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                            <div className="bg-violet-500 p-2 rounded-lg shadow-md text-center h-28 flex flex-col justify-center">
                                <h3 className="text-white text-base font-semibold">Total Outstanding</h3>
                                <p className="text-2xl font-bold text-white">{statusCounts.onTime}</p>
                            </div>
    
                            <div className="bg-green-600 p-2 rounded-lg shadow-md text-center h-28 flex flex-col justify-center">
                                <h3 className="text-white text-base font-semibold">Total Overdue</h3>
                                <p className="text-2xl font-bold text-white">{statusCounts.paid}</p>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Graph on the Right */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* Your Graph Component or Placeholder */}
                    <h3 className="text-xl font-semibold text-gray-800">Invoice Performance Graph</h3>
                    <div className="mt-4">
                        {/* Add your graph here, e.g., Chart.js, Plotly, or any custom graph component */}
                        <div className="h-64 bg-gray-200">Graph goes here</div>
                    </div>
                </div>
            </div>
    
            {/* Flashcards Section */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Flashcard 1 */}
                <div className="bg-teal-500 p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-white text-lg font-semibold">Flashcard 1</h3>
                    <p className="text-white mt-2">Some content for flashcard 1.</p>
                </div>
    
                {/* Flashcard 2 */}
                <div className="bg-indigo-600 p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-white text-lg font-semibold">Flashcard 2</h3>
                    <p className="text-white mt-2">Some content for flashcard 2.</p>
                </div>
    
                {/* Flashcard 3 */}
                <div className="bg-yellow-600 p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-white text-lg font-semibold">Flashcard 3</h3>
                    <p className="text-white mt-2">Some content for flashcard 3.</p>
                </div>
    
                {/* Flashcard 4 */}
                <div className="bg-orange-500 p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-white text-lg font-semibold">Flashcard 4</h3>
                    <p className="text-white mt-2">Some content for flashcard 4.</p>
                </div>
    
                {/* Flashcard 5 */}
                <div className="bg-pink-600 p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-white text-lg font-semibold">Flashcard 5</h3>
                    <p className="text-white mt-2">Some content for flashcard 5.</p>
                </div>
    
                {/* Flashcard 6 */}
                <div className="bg-purple-500 p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-white text-lg font-semibold">Flashcard 6</h3>
                    <p className="text-white mt-2">Some content for flashcard 6.</p>
                </div>
            </div>
        </div>
    );
    


};

export default Dashboard;
