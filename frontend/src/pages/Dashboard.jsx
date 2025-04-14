import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import {
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar
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
        const itemTypeCounts = { product: 0, service: 0 };

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
        <div className="p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div className="flex flex-wrap gap-6 items-center mb-6">
                <div className="w-96 h-96 p-4 bg-white rounded-lg">
                    <img className="shadow-md rounded-lg w-full h-full object-cover" src={assets.dashboardPhoto} alt="dashboardPhoto" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                    <div className="bg-orange-500 p-3 rounded-lg shadow-md text-center h-24 flex flex-col justify-center">
                        <h3 className="text-white text-xl font-bold">Total Invoices</h3>
                        <p className="text-xl text-white font-bold">{statusCounts.paid + statusCounts.overdue + statusCounts.unpaid} invoices</p>
                    </div>

                    <div className="bg-violet-500 p-3 rounded-lg shadow-md text-center h-24 flex flex-col justify-center">
                        <h3 className="text-white text-xl font-bold">On-Time Invoices</h3>
                        <p className="text-xl font-bold text-white">{statusCounts.onTime} invoices</p>
                    </div>

                    <div className="bg-blue-500 p-3 rounded-lg shadow-md text-center h-24 flex flex-col justify-center">
                        <h3 className="text-white text-xl font-bold">Overdue Invoices</h3>
                        <p className="text-xl font-bold text-white">{statusCounts.overdue} invoices</p>
                    </div>

                    <div className="bg-green-600 p-3 rounded-lg shadow-md text-center h-24 flex flex-col justify-center">
                        <h3 className="text-white text-xl font-bold">Paid Invoices</h3>
                        <p className="text-xl text-white font-bold">{statusCounts.paid} invoices</p>
                    </div>

                    <div className="bg-rose-500 p-3 rounded-lg shadow-md text-center h-24 flex flex-col justify-center">
                        <h3 className="text-white text-xl font-bold">Unpaid Invoices</h3>
                        <p className="text-xl text-white font-bold">{statusCounts.unpaid} invoices</p>
                    </div>

                    <div className="bg-yellow-500 p-3 rounded-lg shadow-md text-center h-24 flex flex-col justify-center">
                        <h3 className="text-white text-xl font-bold">Pending Invoices</h3>
                        <p className="text-xl text-white font-bold">{statusCounts.pending} invoices</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* PieChart: Paid vs Unpaid Invoices for the current month */}
                <div className="w-full h-72 p-4 bg-zinc-100 shadow-md rounded-lg flex flex-col items-center justify-center overflow-hidden">
                    <h3 className="text-lg font-semibold text-gray-700 mt-4">Paid vs Unpaid Invoices for Current Month</h3>
                    <PieChart width={270} height={270}> {/* Adjusted width to 100% */}
                        <Pie
                            dataKey="value"
                            data={monthlyData.pieData}
                            cx="50%"
                            cy="50%"
                         
                        >
                            <Cell fill="#16a34a" />
                            <Cell fill="#f43f5e" />
                        </Pie>
                        <Tooltip />
                    </PieChart>

                </div>

                {/* LineChart: On-Time, Overdue, Pending Invoices for the current month */}
                <div className="w-full h-72 p-4 bg-zinc-100 shadow-md rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700">Invoice Status Over Time (Current Month)</h3>
                    <LineChart width={600} height={220} data={monthlyData.lineChartData}> {/* Increased size */}
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="onTime" stroke="#22c55e" />
                        <Line type="monotone" dataKey="overdue" stroke="#e11d48" />
                        <Line type="monotone" dataKey="pending" stroke="#f59e0b" />
                    </LineChart>
                </div>

                {/* BarChart: Monthly Invoices & Amount for the whole year */}
                <div className="w-full h-72 p-4 bg-zinc-100 shadow-md rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700">Monthly Invoices & Total Amount</h3>
                    <BarChart width={400} height={250} data={monthlyData.barChartData}> {/* Increased size */}
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#34d399" />
                        <Bar dataKey="totalAmount" fill="#facc15" />
                    </BarChart>
                </div>
            </div>

        </div>
    );


};

export default Dashboard;
