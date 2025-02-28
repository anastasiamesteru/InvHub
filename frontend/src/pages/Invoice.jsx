import React, { useState } from 'react';
import InvoiceModal from '../components/InvoiceModal';

const Invoice = () => {
    const [activeTab, setActiveTab] = useState('invoice');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [invoices, setInvoices] = useState([
        { id: 1, client: 'Client A', vendor: 'Vendor X', billingDate: '2025-01-01', status: 'Paid', amount: 500 },
        { id: 2, client: 'Client B', vendor: 'Vendor Y', billingDate: '2025-01-02', status: 'Paid', amount: 200 },
        { id: 3, client: 'Client C', vendor: 'Vendor Z', billingDate: '2025-01-03', status: 'Unpaid', amount: 800 },
        { id: 4, client: 'Client A', vendor: 'Vendor X', billingDate: '2025-01-04', status: 'Unpaid', amount: 1200 },
        { id: 5, client: 'Client E', vendor: 'Vendor Y', billingDate: '2025-01-05', status: 'Paid', amount: 1500 },
        { id: 6, client: 'Client D', vendor: 'Vendor Z', billingDate: '2025-01-06', status: 'Paid', amount: 600 },
        { id: 7, client: 'Client F', vendor: 'Vendor X', billingDate: '2025-01-07', status: 'Unpaid', amount: 1000 },
        { id: 8, client: 'Client B', vendor: 'Vendor Y', billingDate: '2025-01-08', status: 'Paid', amount: 700 },
        { id: 9, client: 'Client C', vendor: 'Vendor Z', billingDate: '2025-01-09', status: 'Paid', amount: 900 },
        { id: 10, client: 'Client E', vendor: 'Vendor X', billingDate: '2025-01-10', status: 'Unpaid', amount: 300 }
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const invoicesPerPage = 8;

    const handleStatusChange = (invoiceId, newStatus) => {
        setInvoices((prevInvoices) =>
            prevInvoices.map((invoice) =>
                invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
            )
        );
    };

    const deleteInvoice = (invoiceId) => {
        setInvoices((prevInvoices) => prevInvoices.filter(invoice => invoice.id !== invoiceId));
    };

    const exportInvoices = () => {
        console.log('Export invoices');
    };

    const openModal = () => { setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); };

    const filteredInvoices = invoices.filter((invoice) =>
        invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.amount.toString().includes(searchQuery)
    );

    // Pagination Logic
    const indexOfLastInvoice = currentPage * invoicesPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
    const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-4 h-w-full h-screen">
            <div className="flex flex-col">
                <div className="flex items-center justify-between border-b-2 border-purple-500">
                    <p className="text-gray-700 text-m flex-1 py-4">Manage invoices, streamline payment processing, and filter through detailed financial records.</p>
                    <div className="flex gap-2 items-center">
                        <button
                            className="px-4 py-2 bg-purple-500 border-2 border-purple-500 text-white font-semibold text-sm rounded-lg hover:bg-gray-700 hover:border-gray-700 transition-colors"
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
                            <th className="px-3 py-2 text-center bg-gray-200">Invoice number</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Client</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Vendor</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Billing Date</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Status</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Amount</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInvoices.length > 0 ? (
                            currentInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-100">
                                    <td className="px-3 py-2 text-center">{invoice.id}</td>
                                    <td className="px-3 py-2 text-center">{invoice.client}</td>
                                    <td className="px-3 py-2 text-center">{invoice.vendor}</td>
                                    <td className="px-3 py-2 text-center">{invoice.billingDate}</td>
                                    <td className="px-3 py-2 text-center">
                                        <span className={`inline-block px-2 py-1 font-semibold rounded ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-center">{invoice.amount}</td>
                                    <td className="px-3 py-2 text-center flex justify-center gap-2">
                                        <button className="px-2 py-1 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M16.98 3.02a2.87 2.87 0 1 1 4.06 4.06l-1.41 1.41-4.06-4.06 1.41-1.41zM3 17.25V21h3.75l11.29-11.29-3.75-3.75L3 17.25z" />
                                            </svg>
                                        </button>
                                        <button className="px-2 py-1 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 inline-block mr-2">
                                                <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button className="px-2 py-1 text-center" onClick={() => deleteInvoice(invoice.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-3 py-2 text-center">No invoices found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredInvoices.length / invoicesPerPage)))}
                    disabled={currentPage === Math.ceil(filteredInvoices.length / invoicesPerPage)}
                >
                    Next
                </button>
                <button
                    className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                    onClick={() => setCurrentPage(Math.ceil(filteredInvoices.length / invoicesPerPage))}
                    disabled={currentPage === Math.ceil(filteredInvoices.length / invoicesPerPage)}
                >
                    Last
                </button>
            </div>



        </div>
    );
};

export default Invoice;
