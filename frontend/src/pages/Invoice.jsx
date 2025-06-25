import React, { useState, useEffect } from 'react';
import InvoiceModal from '../components/InvoiceModal';
import axios from 'axios';
import InvoicePDF from '../components/InvoicePDF';
import { PDFViewer } from "@react-pdf/renderer";
import EditInvoiceModal from '../components/EditInvoiceModal';
import DeleteInvoiceModal from '../components/DeleteInvoiceModal';

const Invoice = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);

    const handleDeleteSuccess = (id) => {
        setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice._id !== id));
    };

    const deleteInvoice = async (id) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            await axios.delete(`http://localhost:4000/routes/invoices/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,

                },
            });

            // Refresh the invoice list after deleting
            setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice._id !== id));
            fetchInvoices();
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };


    const openModal = () => { setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); };

    // Sorting state
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const filteredInvoices = () => {
        const query = searchQuery?.toLowerCase() || '';
        let data = invoices ?? []; // Ensure data is correctly initialized

        // Apply filtering
        data = data.filter(invoice =>
            Object.values(invoice).some(value =>
                value?.toString().toLowerCase().includes(query)
            )
        );

        // Apply sorting if necessary
        if (sortColumn) {
            data.sort((a, b) => {
                let valueA = a[sortColumn] ?? '';
                let valueB = b[sortColumn] ?? '';

                if (typeof valueA === 'string') valueA = valueA.toLowerCase();
                if (typeof valueB === 'string') valueB = valueB.toLowerCase();

                if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    };


    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    // Pagination Logic

    const [currentPage, setCurrentPage] = useState(1);
    const invoicesPerPage = 8;

    // Calculate the index range for the current page
    const indexOfLastInvoice = currentPage * invoicesPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;

    // Get the invoices to display for the current page
    const currentInvoices = filteredInvoices().slice(indexOfFirstInvoice, indexOfLastInvoice);

    // Calculate total number of pages
    const totalPages = Math.ceil(filteredInvoices().length / invoicesPerPage);

    // Function to calculate penalty for overdue invoices
    const calculatePenalty = (paymentDate, dueDate, total) => {
        const overdueDays = Math.floor((paymentDate - dueDate) / (1000 * 60 * 60 * 24));
        const penaltyRate = 0.01; // 1% penalty rate per day
        return Math.max(0, total * penaltyRate * overdueDays); // Ensure no negative penalty
    };

    // Function to update the payment status
    const updatePaymentStatus = async (invoiceId, paymentStatus, paymentDate, timeStatus, total) => {
        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            // Sending the updated data to the backend
            const response = await axios.patch(`http://localhost:4000/routes/invoices/${invoiceId}`, {
                paymentStatus,
                paymentDate,
                timeStatus,
                total: total
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Include the token
                    'Content-Type': 'application/json'   // Specify content type
                }
            });

            console.log("Payment status updated successfully:", response.data);

            // Fetch invoices after the update
            fetchInvoices();
        } catch (error) {
            console.error('Error updating payment status:', error.response ? error.response.data : error.message);
        }
    };


    const handlePaymentStatusChange = async (invoiceId, isChecked, invoice) => {
        const paymentStatus = isChecked ? 'Paid' : 'Unpaid';
        const currentDate = new Date();
        const dueDate = new Date(invoice.due_date);

        currentDate.setHours(0, 0, 0, 0); // Set to midnight for date comparison
        dueDate.setHours(0, 0, 0, 0); // Set to midnight for date comparison

        let paymentDate = null;
        if (isChecked) {
            // Only update payment date if it hasn't already been marked as 'Paid' today
            if (!invoice.payment_date || invoice.payment_date !== currentDate.toISOString().split('T')[0]) {
                paymentDate = currentDate.toISOString().split('T')[0]; // Set today's date as payment date
            } else {
                paymentDate = invoice.payment_date; // Keep the same payment date if already 'Paid' today
            }
        }

        let timeStatus = 'Pending';
        let penalty = 0;
        const baseTotal = parseFloat(invoice.total); // Ensure numeric
        //    console.log('invoice.total type:', typeof invoice.total, 'value:', invoice.total);

        if (paymentStatus === 'Paid') {
            const paymentDateObject = new Date(paymentDate);

            if (paymentDateObject <= dueDate) {
                timeStatus = 'On Time';
            } else {
                timeStatus = 'Overdue';

                // Only calculate penalty if it wasn't already set
                if (!invoice.payment_date || !invoice.penalty || invoice.penalty === 0) {
                    const daysOverdue = Math.floor((paymentDateObject - dueDate) / (1000 * 60 * 60 * 24));
                    if (daysOverdue > 0) {
                        penalty = calculatePenalty(paymentDateObject, dueDate, baseTotal);
                    }
                } else {
                    penalty = invoice.penalty; // reuse existing penalty
                }
            }
        }

        const total = parseFloat((baseTotal + penalty).toFixed(2));
        //  console.log('New Total:', total);

        // Update payment status, with paymentDate set if marked as "Paid"
        await updatePaymentStatus(invoiceId, paymentStatus, paymentDate, timeStatus, total);
    };


    const handleViewPDF = (invoice) => {
        setSelectedInvoice(invoice);
    };

    const formatDate = (date) => {
        if (!date) return 'Invalid Date';
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return 'Invalid Date';

        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year = parsedDate.getFullYear();

        return `${day}/${month}/${year}`;
    };



    // Clients
    const [isEditInvoiceModalOpen, setIsEditInvoiceModalOpen] = useState(false);
    const [invoiceToEdit, setInvoiceToEdit] = useState(null);

    const openEditInvoiceModal = (invoiceId) => {
        setInvoiceToEdit(invoiceId);
        setIsEditInvoiceModalOpen(true);
    };

    const handleInvoiceUpdate = (updatedInvoice) => {
        setInvoices(prevInvoices =>
            prevInvoices.map(invoice =>
                invoice._id === updatedInvoice._id ? updatedInvoice : invoice
            )
        );
    };

    function generateRandomIban() {
    const country = 'RO';
    const checkDigits = Math.floor(10 + Math.random() * 89); // 2 random digits

    const bankCodes = [
        'INGB', // ING Bank
        'BTRL', // Banca Transilvania
        'BRDE', // BRD
        'RNCB', // BCR
        'CECE', // CEC Bank
        'BACX', // UniCredit Bank
        'OTPV', // OTP Bank
        'PIRB', // First Bank
        'EXIM', // EximBank
        'CARP', // Carpatica
        'LIBR', // Libra Internet Bank
        'BLOM', // Blom Bank
        'BREL', // Intesa Sanpaolo
        'CRDZ', // Credit Europe Bank
        'MIRO', // Mirabank
        'LRLR', // Idea Bank (former RIB)
        'BCRL'  // Romanian Commercial Bank (alternative)
    ];

    const bankCode = bankCodes[Math.floor(Math.random() * bankCodes.length)];
    const accountNumber = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');

    return `${country}${checkDigits}${bankCode}${accountNumber}`;
}

    
    function generateRandomPaypalLink(invoiceId) {
        const randomToken = Math.random().toString(36).substring(2, 15);
        return `https://www.paypal.com/invoice/p#${invoiceId}-${randomToken}`;
    }


    const handleSendInvoiceEmail = async (invoice) => {
        const subject = encodeURIComponent(`Details regarding invoice #${invoice.invoiceNumber}`);
        const itemsList = invoice.items
            ? invoice.items
                .map(
                    item =>
                        `→ ${item.itemName || 'Unnamed Item'} (${item.quantity || 1} ${item.um || ''})`
                )
                .join('\n')
            : 'Details not available';

        const iban = generateRandomIban();
        const accountHolder = invoice.vendorName ;
        const paypalLink = generateRandomPaypalLink(invoice._id);

        const body = encodeURIComponent(
            `Dear Sir or Madam,

I hope this message finds you well.

This is a friendly reminder regarding invoice #${invoice.invoiceNumber}, issued by ${invoice.vendorName}, for the following items:
${itemsList}

The amount due is €${invoice.total}, with a due date of ${formatDate(invoice.due_date)}.

Payment methods accepted:
- Bank Transfer:
   IBAN: ${iban}
   Account Holder: ${accountHolder}
   CUI/CNP : ${invoice.vendorCifcnp}
- PayPal via secure link: ${paypalLink}
- Cash (only if arranged in person)

Please note that a late payment fee of 1% per day will be applied for payments received after the due date.

Thank you for your continued trust and collaboration.

This message was generated by Invinity, your smart invoicing assistant.`
        );

        const to = encodeURIComponent(invoice.clientEmail);
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;

        window.open(
            gmailLink,
            "_blank",
            "width=800,height=600,top=100,left=100,noopener,noreferrer"
        );
    };

    return (
        <div className="p-4 h-w-full h-screen">
            <div className="flex flex-col">
                <div className="flex items-center justify-between border-b-2 border-purple-500">
                    <p className="text-gray-700 text-m flex-1 py-4">Manage invoices, streamline payment processing, and filter through detailed financial records.</p>
                    <div className="flex gap-2 items-center">
                        <button
                            className="px-4 py-2 bg-purple-500 border-2 border-purple-500 text-white font-semibold text-sm rounded-lg hover:bg-purple-700 hover:border-purple-700 transition-colors"
                            onClick={openModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 inline-block mr-2">
                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                            Add
                        </button>
                        <InvoiceModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            fetchInvoices={fetchInvoices}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center bg-gray-100 p-2 rounded-md mt-2 mb-2">
                <input
                    type="text"
                    id="search-box"
                    placeholder="🔎︎ Search by client, vendor, amount, or status..."
                    className="flex-1 p-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div>
                <table className="w-full border-collapse text-sm overflow-auto">
                    <thead>
                        <tr>
                            <th
                                className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                onClick={() => handleSort('invoiceNumber')}
                            >
                                Invoice Number
                                {sortColumn === 'invoiceNumber' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                            </th>
                            <th
                                className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                onClick={() => handleSort('clientName')}
                            >
                                Client
                                {sortColumn === 'clientName' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                            </th>
                            <th
                                className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                onClick={() => handleSort('vendorName')}
                            >
                                Vendor
                                {sortColumn === 'vendorName' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                            </th>
                            <th
                                className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                onClick={() => handleSort('issue_date')}
                            >
                                Issue Date
                                {sortColumn === 'issueDate' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                            </th>
                            <th
                                className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                onClick={() => handleSort('due_date')}
                            >
                                Due Date
                                {sortColumn === 'dueDate' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                            </th>
                            <th
                                className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                onClick={() => handleSort('timeStatus')}
                            >
                                Status
                                {sortColumn === 'timeStatus' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                            </th>
                            <th
                                className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                onClick={() => handleSort('total')}
                            >
                                Total
                                {sortColumn === 'total' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                            </th>
                            <th className="px-3 py-2 text-center bg-gray-200">Payment</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInvoices.length > 0 ? (
                            currentInvoices.map((invoice) => (
                                <tr key={invoice.invoiceNumber} className="hover:bg-gray-100">
                                    <td className="px-3 py-2 text-center">{invoice.invoiceNumber}</td>
                                    <td className="px-3 py-2 text-center">{invoice.clientName}</td>
                                    <td className="px-3 py-2 text-center">{invoice.vendorName}</td>
                                    <td className="px-3 py-2 text-center">
                                        {invoice.issue_date ? formatDate(invoice.issue_date) : 'No Issue Date'}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        {invoice.due_date ? formatDate(invoice.due_date) : 'No Due Date'}
                                    </td>

                                    <td className="px-3 py-2 text-center">
                                        <span
                                            className={`inline-block px-2 py-1 font-semibold rounded ${invoice.timeStatus === 'On Time'
                                                ? 'bg-green-100 text-green-800'
                                                : invoice.timeStatus === 'Overdue'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800' // For Pending invoices
                                                }`}
                                        >
                                            {invoice.timeStatus}
                                        </span>
                                    </td>

                                    <td className="px-3 py-2 text-center">${invoice.total.toFixed(2)}</td>

                                    <td className="px-3 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={invoice.paymentStatus === 'Paid'}
                                            onChange={(e) => handlePaymentStatusChange(invoice._id, e.target.checked, invoice)}
                                            className="w-5 h-5 accent-blue-500 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 hover:ring-2 hover:ring-blue-300"
                                        />

                                    </td>


                                    <td className="px-3 py-2 text-center flex justify-center gap-2">
                                        <button className="px-2 py-1 text-center" onClick={() => openEditInvoiceModal(invoice._id)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path d="M16.98 3.02a2.87 2.87 0 1 1 4.06 4.06l-1.41 1.41-4.06-4.06 1.41-1.41zM3 17.25V21h3.75l11.29-11.29-3.75-3.75L3 17.25z" />
                                            </svg>
                                        </button>
                                        <EditInvoiceModal
                                            show={isEditInvoiceModalOpen}
                                            onClose={() => setIsEditInvoiceModalOpen(false)}
                                            invoiceId={invoiceToEdit}
                                            onUpdate={handleInvoiceUpdate}
                                        />
                                        <button
                                            className="px-2 py-1 text-center"
                                            onClick={() => handleViewPDF(invoice)}

                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            className="px-2 py-1 text-center"
                                            onClick={() => {
                                                setInvoiceToDelete(invoice._id); // Set the invoice ID to delete
                                                setShowDeleteModal(true); // Open the modal
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                fill="none"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                            </svg>
                                        </button>
                                        <DeleteInvoiceModal
                                            isOpen={showDeleteModal}
                                            onClose={() => setShowDeleteModal(false)} // Close the modal without deleting
                                            invoiceToDelete={invoiceToDelete} // Pass the invoice ID to the modal
                                            onDeleteSuccess={handleDeleteSuccess} // Pass the success handler to update the invoice list
                                        />
                                        <button
                                            className="px-2 py-1 text-center"
                                            onClick={() => handleSendInvoiceEmail(invoice)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                strokeWidth="2" stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M3 8l7.89 5.26a2.25 2.25 0 0 0 2.22 0L21 8M5 19.5h14a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19 4.5H5A2.25 2.25 0 0 0 2.75 6.75v10.5A2.25 2.25 0 0 0 5 19.5Z" />
                                            </svg>
                                        </button>


                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-center">
                                <td colSpan="100%" className="px-3 py-2">No invoices found</td>
                            </tr>

                        )}
                    </tbody>
                </table>


            </div>

            {/* PDF Modal */}
            {selectedInvoice && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-full lg:w-1/3 h-4/5 relative overflow-hidden">

                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200 z-10"
                            onClick={() => setSelectedInvoice(null)}
                        >
                            ✕
                        </button>

                        {/* PDF Viewer with padding to prevent overlap */}
                        <div className="h-full pt-6 pb-4 pl-4 pr-4 overflow-auto">
                            <PDFViewer width="100%" height="100%">
                                <InvoicePDF invoiceData={selectedInvoice} />
                            </PDFViewer>
                        </div>
                    </div>
                </div>
            )}



            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <button
                    className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                >
                    First
                </button>
                <button
                    className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="px-4 py-2 mx-2 text-sm text-gray-600">{currentPage}</span>
                <button
                    className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
                <button
                    className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    Last
                </button>
            </div>
        </div>
    );
};

export default Invoice;
