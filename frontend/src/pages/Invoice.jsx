import React, { useState } from 'react';

const Invoice = () => {
    const [activeTab, setActiveTab] = useState('invoice');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [invoices, setInvoices] = useState([
        { id: 1, client: 'Client A', vendor: 'Vendor X', billingDate: '2025-01-01', status: 'Paid', amount: 500 },
        { id: 2, client: 'Client B', vendor: 'Vendor Y', billingDate: '2025-01-02', status: 'Paid', amount: 200 },
        { id: 3, client: 'Client C', vendor: 'Vendor Z', billingDate: '2025-01-03', status: 'Unpaid', amount: 800 }
    ]);

    const handleStatusChange = (invoiceId, newStatus) => {
        setInvoices((prevInvoices) =>
            prevInvoices.map((invoice) =>
                invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
            )
        );
    };

    const exportInvoices = () => {
        console.log('Export invoices');
    };
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const renderModalContent = () => {
        if (activeTab === 'invoice') {
          return (
            <>
              <h2 className="text-xl font-bold mb-4">Add a new invoice</h2>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mt-1">Client</label>
              <input
                type="text"
                id="client"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter client name"
              />
      
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mt-1">Vendor</label>
              <input
                type="text"
                id="vendor"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter vendor name"
              />
      
              <label htmlFor="billingDate" className="block text-sm font-medium text-gray-700 mt-1">Billing Date</label>
              <input
                type="date"
                id="billingDate"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
      
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mt-1">Amount</label>
              <input
                type="number"
                id="amount"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter invoice amount"
              />
      
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mt-1">Status</label>
              <select
                id="status"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
      
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // laceholder for save logic
                    console.log('Invoice saved');
                    closeModal();
                  }}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Save
                </button>
              </div>
            </>
          );
        }
      };
      
   {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">
                                {(() => {
                                    switch (activeTab) {
                                        case 'clients':
                                            return 'Add a new client';
                                        case 'vendors':
                                            return 'Add a new vendor';
                                        case 'products':
                                            return 'Add a new product';

                                    }
                                })()}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={closeModal}
                            >
                                ✕
                            </button>
                        </div>
                        <form className="mt-4">
                            {renderModalContent()}
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white font-semibold text-sm rounded-md hover:bg-blue-600 transition-colors w-full"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

    return (
        <div className="p-4 h-w-full h-screen">
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-black">Invoice</h2>
                <div className="flex items-center justify-between border-b-2 border-blue-500">
                    <p className="text-gray-700 text-sm flex-1 py-4">Manage invoices, streamline payment processing, and filter through detailed financial records.</p>
                    <div className="flex gap-2 items-center">
                        <button
                            className="px-4 py-2 bg-blue-500 border-2 border-blue-500 text-white font-semibold text-sm rounded-lg hover:bg-gray-700 hover:border-gray-700 transition-colors"
                            onClick={openModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 inline-block mr-2">
                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                            Add
                        </button>
                        <button
                            className="px-4 py-2 bg-white border-2 border-gray-700 text-gray-700 text-sm rounded-lg hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors"
                            onClick={exportInvoices}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 inline-block mr-2">
                                <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="flex items-center bg-gray-100 p-2 rounded-md mb-5">
                    <input
                        type="text"
                        id="search-box"
                        placeholder="🔎︎ Search by invoice number, name, amount..."
                        className="flex-1 p-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <table className="w-full border-collapse text-sm overflow-auto">
                    <thead>
                        <tr>
                            <th className="px-3 py-2 text-center bg-gray-200">Invoice number</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Client</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Vendor</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Billing Date</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Status</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Amount</th>
                            <th className="px-3 py-2 text-center bg-gray-200"></th>
                            <th className="px-3 py-2 text-center bg-gray-200"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length > 0 ? (
                            invoices.map((invoice) => (
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
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            className={`px-4 py-2 font-semibold text-sm rounded-md ${invoice.status === "Paid" ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
                                            disabled={invoice.status === "Paid"}
                                            onClick={() => handleStatusChange(invoice.id, 'Paid')}
                                        >
                                            Pay
                                        </button>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <button className="px-4 py-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4">No invoices found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
             {/* Modal Form */}
             {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">
                                {(() => {
                                    switch (activeTab) {
                                        case 'clients':
                                            return 'Add a new client';
                                        case 'vendors':
                                            return 'Add a new vendor';
                                        case 'products':
                                            return 'Add a new product';

                                    }
                                })()}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={closeModal}
                            >
                                ✕
                            </button>
                        </div>
                        <form className="mt-4">
                            {renderModalContent()}
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white font-semibold text-sm rounded-md hover:bg-blue-600 transition-colors w-full"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoice;
