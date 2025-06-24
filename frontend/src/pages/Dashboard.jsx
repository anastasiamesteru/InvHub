import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [items, setItems] = useState([]);
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
    const fetchClients = async () => {
        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/routes/clients/getall', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include Bearer token in the request header
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error("Server error:", errorData);

            console.error("Error fetching clients:", error);
        }
    };

    const fetchVendors = async () => {
        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/routes/vendors/getall', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include Bearer token in the request header
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch vendors');
            const data = await response.json();
            setVendors(data);
        } catch (error) {
            console.error("Error fetching vendors:", error);
        }
    };

    const fetchItems = async () => {
        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/routes/items/getall', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include Bearer token in the request header
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };


    useEffect(() => {
        fetchInvoices();
        fetchClients();
        fetchVendors();
        fetchItems();
    }, []);


    const calculateCounts = () => {
        const clientCounts = { company: 0, individual: 0 };
        const vendorCounts = { company: 0, individual: 0 };
        const itemCounts = { product: 0, service: 0 };

        // Count clients by type
        clients.forEach(client => {
            if (client.type === 'company') {
                clientCounts.company++;
            } else if (client.type === 'individual') {
                clientCounts.individual++;
            }
        });

        // Count vendors by type
        vendors.forEach(vendor => {
            if (vendor.type === 'company') {
                vendorCounts.company++;
            } else if (vendor.type === 'individual') {
                vendorCounts.individual++;
            }
        });

        // Count items by type
        items.forEach(item => {
            if (item.type === 'product') {
                itemCounts.product++;
            } else if (item.type === 'service') {
                itemCounts.service++;
            }
        });

        return { clientCounts, vendorCounts, itemCounts };
    };

    const { clientCounts, vendorCounts, itemCounts } = useMemo(calculateCounts, [clients, vendors, items]);

    const clientData = [
        { name: 'Clients (Company)', value: clientCounts.company },
        { name: 'Clients (Individual)', value: clientCounts.individual },
    ];

    const vendorData = [

        { name: 'Vendors (Company)', value: vendorCounts.company },
        { name: 'Vendors (Individual)', value: vendorCounts.individual },
    ];
    const itemTypeData = [
        { name: 'Products', value: itemCounts.product },
        { name: 'Services', value: itemCounts.service },
    ];


    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    //  const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let totalAmount = 0;
    let outstandingAmount = 0;
    let overdueAmount = 0;
    let pendingAmount = 0;

    invoices.forEach(invoice => {
        const issueDate = new Date(invoice.issue_date);

        if (issueDate.getMonth() !== currentMonth) return;

        const amount = Number(invoice.total || 0);

        if (invoice.timeStatus?.toLowerCase() === "on time") {
            totalAmount += amount;
        }

        if (invoice.timeStatus?.toLowerCase() === "pending") {
            outstandingAmount += amount;
        }

        if (invoice.timeStatus?.toLowerCase() === "overdue") {
            overdueAmount += amount;
        }
    });

    const monthlyData = useMemo(() => {
        const data = {};
        const barChartData = {}; // For Paid/Unpaid invoice counts

        invoices.forEach(inv => {
            const date = new Date(inv.issue_date);
            const month = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

            if (!data[month]) {
                data[month] = {
                    month,
                    onTime: 0,
                    pending: 0,
                    overdue: 0,
                    paidAmount: 0,
                    unpaidAmount: 0,
                };
            }

            if (!barChartData[month]) {
                barChartData[month] = { month, Paid: 0, Unpaid: 0 };
            }

            const amount = Number(inv.total || 0);
            const paymentStatus = inv.paymentStatus?.toLowerCase();
            const timeStatus = inv.timeStatus?.trim().toLowerCase();

            // Count Paid/Unpaid amounts
            if (paymentStatus === "paid") {
                data[month].paidAmount += amount;
                barChartData[month].Paid += 1;
            } else if (paymentStatus === "unpaid") {
                data[month].unpaidAmount += amount;
                barChartData[month].Unpaid += 1;
            }

            // Time-based status totals
            if (timeStatus === "on time") {
                data[month].onTime += amount;
            } else if (timeStatus === "pending") {
                data[month].pending += amount;
            } else if (timeStatus === "overdue") {
                data[month].overdue += amount;
            }
        });

        const lineChartData = Object.values(data)
            .sort((a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`))
            .map(d => ({
                month: d.month,
                onTime: d.onTime,
                pending: d.pending,
                overdue: d.overdue,
                paid: d.paidAmount,
                unpaid: d.unpaidAmount
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
    const COLORS2 = ['#4f46e5', '#c7d2fe'];

    return (
        <div className="p-4 space-y-6 min-h-screen bg-gradient-to-r from-violet-100 via-violet-200 to-violet-300">

            {/* Summary and Graph */}
            <div className="flex flex-col text-center lg:flex-row gap-6">
                {/* Summary Cards */}
                <div className="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md h-20 flex flex-col justify-center">

                        <h3 className="text-indigo-800 text-md font-medium">Total Collected</h3>
                        <p className="text-s font-semibold text-center text-slate-800">${totalAmount.toFixed(2)}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                            <div className="bg-indigo-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" class="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                </svg>
                            </div>
                            <h3 className="text-indigo-800 text-md font-medium">Total Outstanding</h3>
                            <p className="text-s font-semibold text-center text-slate-800">${outstandingAmount.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                            <div className="bg-indigo-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" class="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                                </svg>

                            </div>
                            <h3 className="text-indigo-800 text-md font-medium">Total Overdue</h3>
                            <p className="text-s font-semibold text-center text-slate-800">${overdueAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                        <h3 className="text-indigo-800 text-md font-medium">Total Invoices</h3>
                        <p className="text-s font-semibold text-center text-slate-800">{statusCounts.paid + statusCounts.unpaid}</p>
                    </div>
                </div>

                {/* Line and Pie Charts */}
                <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-2/3">
                    {/* Line Chart */}
                    <div className="p-4 rounded-lg bg-white shadow-lg w-full">
                        <h3 className="text-xl font-medium text-indigo-800">Invoice Performance</h3>
                        <div className="mt-4 h-64 bg-white rounded-md">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={monthlyData.lineChartData}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                                >
                                    <XAxis dataKey="month" tickFormatter={(value) => value.split(' ')[0]} />
                                    <YAxis allowDecimals />

                                    <Legend
                                        iconType="circle"
                                        formatter={(value) => {
                                            const labels = {
                                                onTime: "collected",
                                                pending: "outstanding",
                                                overdue: "overdue",

                                            };
                                            return labels[value] || value;
                                        }}
                                    />

                                    {/* Time status lines */}
                                    <Line
                                        type="monotone"
                                        dataKey="onTime"
                                        stroke="rgba(34, 197, 94, 0.9)" // Green-500
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="pending"
                                        stroke="rgba(234, 179, 8, 0.9)" // Yellow-500
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="overdue"
                                        stroke="rgba(239, 68, 68, 0.9)" // Red-500
                                        strokeWidth={3}
                                        dot={false}
                                    />


                                </LineChart>
                            </ResponsiveContainer>


                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                            <div className="bg-white rounded-lg shadow p-2 flex flex-col justify-center items-center">
                                <div className="bg-indigo-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" class="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                                    </svg>

                                </div>
                                <h3 className="text-xs font-semibold  text-indigo-800 mt-2 text-center">Clients (Company)</h3>
                                <p className="text-center text-lg font-bold text-slate-800">{clientCounts.company}</p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-2 flex flex-col justify-center items-center">
                                <div className="bg-indigo-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                                    <svg className="h-8 w-8 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" class="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c3.86 0 7 2.69 7 6v2H5v-2c0-3.31 3.13-6 7-6zM12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                                    </svg>
                                </div>
                                <h3 className="text-xs font-semibold text-indigo-800 mt-2 text-center">Clients (Individual)</h3>
                                <p className="text-center text-lg font-bold text-slate-800">{clientCounts.individual}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                            <div className="bg-white rounded-lg shadow p-2 flex flex-col justify-center items-center">
                                <div className="bg-indigo-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                                    </svg>

                                </div>
                                <h3 className="text-xs font-semibold text-indigo-800 mt-2 text-center">Vendors (Company)</h3>
                                <p className="text-center text-lg font-bold text-slate-800">{vendorCounts.company}</p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-2 flex flex-col justify-center items-center">
                                <div className="bg-indigo-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                                    <svg className="h-8 w-8 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" class="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c3.86 0 7 2.69 7 6v2H5v-2c0-3.31 3.13-6 7-6zM12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                                    </svg>
                                </div>
                                <h3 className="text-xs font-semibold text-indigo-800 mt-2 text-center">Vendors (Individual)</h3>
                                <p className="text-center text-lg font-bold text-slate-800">{vendorCounts.individual}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white rounded-lg shadow p-2 flex flex-col justify-center items-center">
                                <div className="bg-indigo-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>


                                </div>
                                <h3 className="text-xs font-semibold text-indigo-800 mt-2 text-center">Items (Product)</h3>
                                <p className="text-center text-lg font-bold text-slate-800">{itemCounts.product}</p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-2 flex flex-col justify-center items-center">
                                <div className="bg-indigo-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                    </svg>


                                </div>
                                <h3 className="text-xs font-semibold text-indigo-800 mt-2 text-center">Items (Service)</h3>
                                <p className="text-center text-lg font-bold text-slate-800">{itemCounts.service}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-sm font-semibold text-indigo-800 mb-1 text-center">
                                Client & Vendor Distribution
                            </h3>

                            <div className="mb-4">
                                <ResponsiveContainer width="100%" height={150}>
                                    <PieChart>
                                        <Pie
                                            data={clientData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={60}
                                            dataKey="value"
                                        >
                                            {clientData.map((entry, index) => (
                                                <Cell key={`cell-1-${index}`} fill={COLORS2[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={vendorData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={60}
                                        dataKey="value"
                                    >
                                        {vendorData.map((entry, index) => (
                                            <Cell key={`cell-2-${index}`} fill={COLORS2[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>


                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-sm font-semibold text-indigo-800 mb-10 text-center">Item Type Distribution</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={itemTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                                        {itemTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div >


    );
};

export default Dashboard;