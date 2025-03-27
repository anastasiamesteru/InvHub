import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

import { assets } from '../assets/assets';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);
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



    const invoiceAmounts = invoices.map(invoice => invoice.amount);
    const invoiceMonths = invoices.map(invoice => new Date(invoice.issueDate).toLocaleString('default', { month: 'short' }));
    const itemCategories = items.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
    }, {});


    const getTopProductsOrServices = (invoices) => {
        const itemCount = {};

        invoices.forEach(invoice => {
            invoice.items.forEach(item => {
                const itemName = item.itemName; // Accessing itemName from items array
                if (itemName) {
                    if (itemCount[itemName]) {
                        itemCount[itemName]++;
                    } else {
                        itemCount[itemName] = 1;
                    }
                }
            });
        });

        const sortedItems = Object.entries(itemCount).sort((a, b) => b[1] - a[1]);
        return sortedItems.slice(0, 3); 
    };
    const topItems = getTopProductsOrServices(invoices);

    const getInvoiceStatusCount = (invoices) => {
        const currentMonth = new Date().getMonth(); 
        let onTime = 0;
        let overdue = 0;

        invoices.forEach(invoice => {
            const invoiceDate = new Date(invoice.issueDate); 
            const invoiceMonth = invoiceDate.getMonth(); 

            console.log("Checking invoice:", invoice); 

            if (invoiceMonth === currentMonth) { 
                const status = calculateInvoiceStatus(invoice.issueDate, invoice.dueDate);
                console.log("Status of invoice:", status); 

                if (status === 'On Time') {
                    onTime++;
                } else if (status === 'Overdue') {
                    overdue++;
                }
            }
        });

        console.log("On Time invoices:", onTime); 
        console.log("Overdue invoices:", overdue); 

        return { onTime, overdue };
    };





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
        labels: Object.keys(itemCategories), // Assuming itemCategories has the categories you're showing
        datasets: [{
            label: 'Item Categories',
            data: Object.values(itemCategories), // Assuming itemCategories holds the values
            backgroundColor: [
                'rgb(139, 92, 246)',    // Purple (Tailwind's bg-purple-500)
                'rgb(255, 159, 28)'     // Orange (Tailwind's bg-orange-400)
            ],
            borderColor: [
                'rgb(139, 92, 246)',  // Purple border
                'rgb(255, 159, 28)'    // Orange border
            ],
        }]
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hide the legend
            },
            tooltip: {
                enabled: true, // Tooltips enabled for interaction
            },
        },
        // Disable the axes (they won't be visible for doughnut charts anyway, but adding for certainty)
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    };


    const lineOptions = {
        responsive: true,
        plugins: {
            // Legend Configuration
            legend: {
                display: false,  // Set to 'false' if you don't want to show the legend
                labels: {
                    font: {
                        family: 'Poppins', // Font family
                        size: 14,          // Font size for legend
                    },
                },
            },
            tooltip: {
                titleFont: {
                    family: 'Poppins', // Tooltip title font
                    size: 16,          // Font size for tooltip title
                },
                bodyFont: {
                    family: 'Poppins', // Tooltip body font
                    size: 12,          // Font size for tooltip body
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        family: 'Poppins', // Font family for x-axis ticks
                        size: 12,          // Font size for x-axis ticks
                    },
                },
            },
            y: {
                ticks: {
                    font: {
                        family: 'Poppins', // Font family for y-axis ticks
                        size: 12,          // Font size for y-axis ticks
                    },
                },
            },
        },
    };

    return (
        <div className="p-6">
            <div className="flex flex-wrap gap-6 items-center mb-6">
                <div className="w-96 h-96 p-4 bg-white rounded-lg">
                    <img className="shadow-md rounded-lg w-full h-full object-cover" src={assets.dashboardPhoto} alt="dashboardPhoto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">

                    <div className="bg-yellow-400 p-4 rounded-lg shadow-md text-center h-32 flex flex-col justify-center">
                        <h3 className="text-gray-800 text-2xl font-bold">Total Invoices This Month</h3>
                        <p className="text-2xl text-yellow-800 font-bold">{getTotalInvoicesThisMonth(invoices)} invoices</p>

                    </div>

                    <div className="bg-blue-400 p-4 rounded-lg shadow-md text-center h-32 flex flex-col justify-center">
                        <h3 className="text-gray-800 text-2xl font-bold">Top Products/Services</h3>
                        <p className="text-xl text-blue-800 font-bold">
                            {topItems.length > 0 ? `${topItems[0][0]}` : 'No data available'}
                        </p>
                    </div>

                    <div className="bg-green-500 p-4 rounded-lg shadow-md text-center h-32 flex flex-col justify-center">
                        <h3 className="text-gray-800 text-2xl font-bold">On-Time Invoices</h3>
                        <p className="text-2xl font-bold text-green-800">{getInvoiceStatusCount(invoices).onTime} invoices</p>

                    </div>

                    <div className="bg-rose-500 p-4 rounded-lg shadow-md text-center h-32 flex flex-col justify-center">
                        <h3 className="text-gray-800 text-2xl font-bold">Overdue Invoices</h3>
                        <p className="text-2xl font-bold text-rose-800">{getInvoiceStatusCount(invoices).overdue} invoices</p>
                    </div>
                </div>
            </div>




            <div className="flex flex-wrap justify-around gap-6">
            <div className="flex flex-wrap justify-around gap-6">
    <div className="w-64 h-64 p-4 bg-zinc-100 shadow-md rounded-lg flex flex-col items-center justify-center overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-4">Item Categories</h3>
        <div className="flex justify-center items-center w-full h-full">
            <Doughnut
                data={doughnutData}
                options={doughnutOptions}
                width={250}   // Set the width to 150px
                height={250}  // Set the height to 150px
            />
        </div>
    </div>
</div>





                <div className="w-full sm:w-96 h-64 p-4 bg-zinc-100 shadow-md rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700">Invoice Amounts Over Time</h3>
                    <Line data={lineData} options={lineOptions} />
                </div>

                <div className="w-full sm:w-96 h-64 p-4 bg-zinc-100 shadow-md rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700">Invoices by Month</h3>
                    <Bar data={barData} options={lineOptions} />
                </div>


            </div>
        </div>

    );
};

export default Dashboard;
