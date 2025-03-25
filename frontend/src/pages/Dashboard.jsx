import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const Dashboard = () => {
    const [clients, setClients] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [items, setItems] = useState([]);
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        fetchClients();
        fetchVendors();
        fetchItems();
        fetchInvoices();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch('http://localhost:4000/routes/clients/getall');
            if (!response.ok) throw new Error('Failed to fetch clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };

    const fetchVendors = async () => {
        try {
            const response = await fetch('http://localhost:4000/routes/vendors/getall');
            if (!response.ok) throw new Error('Failed to fetch vendors');
            const data = await response.json();
            setVendors(data);
        } catch (error) {
            console.error("Error fetching vendors:", error);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:4000/routes/items/getall');
            if (!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const fetchInvoices = async () => {
        try {
            const response = await fetch('http://localhost:4000/routes/invoices/getall');
            if (!response.ok) throw new Error('Failed to fetch invoices');
            const data = await response.json();
            setInvoices(data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    function getTotalInvoicesThisMonth(invoices) {
        const currentDate = new Date();

        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const invoicesThisMonth = invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.issueDate);
            return invoiceDate.getFullYear() === currentYear && invoiceDate.getMonth() === currentMonth;
        });

        return invoicesThisMonth.length;
    }

    function getInvoiceGrowth(invoices) {
        const currentDate = new Date();

        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const invoicesThisMonth = invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.issueDate);
            return invoiceDate.getFullYear() === currentYear && invoiceDate.getMonth() === currentMonth;
        });

        const invoicesLastMonth = invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.issueDate);
            return invoiceDate.getFullYear() === previousYear && invoiceDate.getMonth() === previousMonth;
        });

        if (invoicesLastMonth.length === 0) return 100;

        const growth = ((invoicesThisMonth.length - invoicesLastMonth.length) / invoicesLastMonth.length) * 100;

        return growth.toFixed(2);
    }



    const invoiceAmounts = invoices.map(invoice => invoice.amount);
    const invoiceMonths = invoices.map(invoice => new Date(invoice.issueDate).toLocaleString('default', { month: 'short' }));
    const itemCategories = items.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
    }, {});

    // Chart Data
    const lineData = {
        labels: invoiceMonths,
        datasets: [
            {
                label: 'Invoice Amounts Over Time',
                data: invoiceAmounts,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }
        ]
    };

    const barData = {
        labels: invoiceMonths,
        datasets: [
            {
                label: 'Invoices by Month',
                data: invoiceAmounts,
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                borderColor: 'rgba(53, 162, 235, 1)',
                borderWidth: 1,
            }
        ]
    };

    const doughnutData = {
        labels: Object.keys(itemCategories),
        datasets: [
            {
                label: 'Item Categories',
                data: Object.values(itemCategories),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            }
        ]
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Poppins', // Set Poppins font for the legend
                        size: 14,          // Font size for legend labels
                    },
                },
            },
            tooltip: {
                titleFont: {
                    family: 'Poppins', // Set Poppins font for tooltip title
                    size: 16,          // Font size for tooltip title
                },
                bodyFont: {
                    family: 'Poppins', // Set Poppins font for tooltip body
                    size: 12,          // Font size for tooltip body
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        family: 'Poppins', // Set Poppins font for x-axis ticks
                        size: 12,          // Font size for x-axis ticks
                    },
                },
            },
            y: {
                ticks: {
                    font: {
                        family: 'Poppins', // Set Poppins font for y-axis ticks
                        size: 12,          // Font size for y-axis ticks
                    },
                },
            },
        },
    };

    return (
        <div className="p-6">
            <div className="flex flex-wrap gap-6 items-center mb-6">
                <div className="w-80 h-80 p-4 bg-white shadow-md rounded-lg">
                    <img src="https://via.placeholder.com/150" alt="Dashboard Image" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                    <div className="bg-white border-l-4 border-yellow-500 p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-yellow-500 text-lg font-bold">Total Invoices This Month</h3>
                        <p className="text-2xl text-gray-700 font-bold">{getTotalInvoicesThisMonth(invoices)}</p>
                        <p className={`text-md ${getInvoiceGrowth(invoices) >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {getInvoiceGrowth(invoices) >= 0 ? `▲ ${getInvoiceGrowth(invoices)}%` : `▼ ${Math.abs(getInvoiceGrowth(invoices))}%`}
                        </p>
                    </div>

                   
                   <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-600 text-lg"></h3>
                        <p className="text-2xl font-bold text-gray-900"></p>
                        <p className="text-sm text-green-500"></p>
                    </div>

                     <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-600 text-lg"></h3>
                        <p className="text-2xl font-bold text-gray-900"></p>
                        <p className="text-sm text-green-500"></p>
                    </div>

                     <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-600 text-lg"></h3>
                        <p className="text-2xl font-bold text-gray-900"></p>
                        <p className="text-sm text-green-500"></p>
                    </div>
                </div>


            </div>

            <div className="flex flex-wrap justify-around gap-6">
                <div className="w-full sm:w-80 h-64 p-4 bg-white shadow-md rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700">Invoice Amounts Over Time</h3>
                    <Line data={lineData} options={lineOptions} />
                </div>

                <div className="w-full sm:w-80 h-64 p-4 bg-white shadow-md rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700">Invoices by Month</h3>
                    <Bar data={barData} options={lineOptions} />
                </div>

                <div className="w-full sm:w-80 h-64 p-4 bg-white shadow-md rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700">Item Categories</h3>
                    <Doughnut data={doughnutData} options={lineOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
