import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
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

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const currentYear = now.getFullYear();

    let totalAmount = 0;
    let outstandingAmount = 0;
    let overdueAmount = 0;
    let pendingAmount = 0;

    invoices.forEach(invoice => {
        const issueDate = new Date(invoice.issue_date);
        if (issueDate.getFullYear() !== currentYear) return;

        const amount = Number(invoice.total || 0);
        totalAmount += amount;

        if (invoice.paymentStatus?.toLowerCase() === "unpaid") {
            const dueDate = new Date(invoice.due_date);
            if (dueDate >= now) {
                outstandingAmount += amount;
            } else {
                overdueAmount += amount;
            }
        }

        if (invoice.timeStatus?.toLowerCase() === "pending") {
            pendingAmount += amount;
        }
    });

    const monthlyData = useMemo(() => {
        const data = {};
        const barChartData = {};  // New object to store Paid/Unpaid counts for each month

        invoices.forEach(inv => {
            const date = new Date(inv.issue_date);
            const month = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

            if (!data[month]) {
                data[month] = { month, totalAmount: 0, outstandingAmount: 0, overdueAmount: 0, onTime: 0, overdue: 0, pending: 0 };
            }

            if (!barChartData[month]) {
                barChartData[month] = { month, Paid: 0, Unpaid: 0 }; // Initialize Paid/Unpaid count for each month
            }

            const amount = Number(inv.total || 0);
            data[month].totalAmount += amount;

            const paymentStatus = inv.paymentStatus?.toLowerCase();
            if (paymentStatus === "unpaid") {
                const dueDate = new Date(inv.due_date);
                if (dueDate >= now) {
                    data[month].outstandingAmount += amount;
                } else {
                    data[month].overdueAmount += amount;
                }
                barChartData[month].Unpaid += 1;


            }
            else {
                barChartData[month].Paid += 1;

            }

            const timeStatus = inv.timeStatus?.trim().toLowerCase();
            if (timeStatus === "on time") data[month].onTime += 1;
            if (timeStatus === "overdue") data[month].overdue += 1;
        });

        const lineChartData = Object.values(data)
            .sort((a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`))
            .map(d => ({
                month: d.month,
                outstandingAmount: d.outstandingAmount,
                overdueAmount: d.overdueAmount,
                totalAmount: d.totalAmount
            }));

        const pieChartData = [
            { name: 'Paid', value: statusCounts.paid },
            { name: 'Unpaid', value: statusCounts.unpaid }
        ];

        return { lineChartData, pieChartData, barChartData };
    }, [invoices, statusCounts]);

    useEffect(() => {
        const processInvoices = () => {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            let onTime = 0, overdue = 0, paid = 0, unpaid = 0, pending = 0;

            invoices.forEach(invoice => {
                const issueDate = new Date(invoice.issue_date);
                const isCurrentMonth = issueDate.getMonth() === currentMonth && issueDate.getFullYear() === currentYear;

                if (isCurrentMonth) {
                    const timeStatus = invoice.timeStatus?.trim().toLowerCase();
                    const paymentStatus = invoice.paymentStatus?.trim().toLowerCase();

                    if (timeStatus === "on time") onTime++;
                    if (timeStatus === "overdue") overdue++;
                    if (timeStatus === "pending") pending++;

                    if (paymentStatus === "paid") paid++;
                    if (paymentStatus === "unpaid") unpaid++;
                }
            });

            setStatusCounts({ onTime, overdue, paid, unpaid, pending });
        };

        if (invoices.length > 0) {
            processInvoices();
        }
    }, [invoices]);

    const COLORS = ['#eab308', '#9333ea']; // Dark Slate + Soft Stone

    return (
        <div className="p-6 space-y-10 min-h-screen bg-gradient-to-r from-violet-50 via-violet-100 to-violet-200">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-2xl font-semibold text-gray-800">Welcome back!</h1>
                    <p className="text-gray-600 mt-2">
                        Here's a quick overview of your invoice performance this month.
                    </p>
                </div>
            </div>

            {/* Summary and Graph */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Summary Cards */}
                <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-1/3 space-y-6">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md h-28 flex flex-col justify-center">
                        <h3 className="text-indigo-800 text-lg font-semibold">Total Collected</h3>
                        <p className="text-xl font-semibold text-center text-slate-800">${totalAmount.toFixed(2)}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                            <h3 className="text-indigo-800 text-sm font-medium">Total Outstanding</h3>
                            <p className="text-xl font-semibold text-center text-slate-800">${outstandingAmount.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                            <h3 className="text-indigo-800 text-sm font-medium">Total Overdue</h3>
                            <p className="text-xl font-semibold text-center text-slate-800">${overdueAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                        <h3 className="text-indigo-800 text-sm font-medium">Total Invoices</h3>
                        <p className="text-xl font-semibold text-center text-slate-800">{statusCounts.paid + statusCounts.unpaid}</p>
                    </div>
                </div>

                {/* Line and Pie Charts */}
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Line Chart */}
                    <div className="p-6 rounded-lg w-full lg:w-1/2">
                        <h3 className="text-xl font-semibold text-gray-800">Invoice Performance</h3>
                        <div className="mt-4 h-80">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyData.lineChartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                                    <XAxis dataKey="month" tickFormatter={(value) => value.split(' ')[0]} />
                                    <YAxis allowDecimals={true} />
                                    <Line type="monotone" dataKey="outstandingAmount" stroke="#e11d48" strokeWidth={3} />
                                    <Line type="monotone" dataKey="overdueAmount" stroke="#10b981" strokeWidth={3} />
                                    <Line type="monotone" dataKey="totalAmount" stroke="#f59e0b" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="w-full lg:w-1/2">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={monthlyData.pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, value, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }   
                                >
                                    {monthlyData.pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                </div>

            </div>
        </div>

    );
};

export default Dashboard;
