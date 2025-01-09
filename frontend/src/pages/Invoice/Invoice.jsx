import React, { useState, useEffect } from 'react';
import './Invoice.css';

const Invoice = () => {
    const [invoices, setInvoices] = useState([
        //placeholders
        { id: 1, client: 'Client A', vendor: 'Vendor X', billingDate: '2025-01-01', status: 'Paid', amount: 500 },
        { id: 2, client: 'Client B', vendor: 'Vendor Y', billingDate: '2025-01-02', status: 'Paid', amount: 200 },
        { id: 3, client: 'Client C', vendor: 'Vendor Z', billingDate: '2025-01-03', status: 'Unpaid', amount: 800 }
    ]);

    const handleStatusChange = (invoiceId, newStatus) => {
        // Update the status for the specific invoice
        setInvoices((prevInvoices) =>
            prevInvoices.map((invoice) =>
                invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
            )
        );
    };

    // Function for creating a new invoice
    const createInvoice = () => {
        console.log('Create new invoice');
    };

    // Function for exporting invoices
    const exportInvoices = () => {
        console.log('Export invoices');
    };

    // Function for deleting invoices
    const deleteInvoices = () => {
        console.log('Delete selected invoices');
    };

    return (
        <div className="invoice-page">
            <div className="invoice-header">
                <h2>Invoice</h2>
                <div className="invoice-description">
                    <p>Manage invoices, streamline payment processing, and filter through detailed financial records.</p>
                    <div className="invoice-buttons">
                        <button className="add" onClick={createInvoice}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                            Add
                        </button>
                        <button className="download" onClick={exportInvoices}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                            Download PDF
                        </button>
                    </div>
                </div>

            </div>

            {/* Invoice Table */}
            <div className="invoice-table">
                <div class="table-search">
                    <div class="search-input-wrapper">
                        <input type="text" id="search-box" placeholder="🔎︎ Search by invoice number, name, amount..." oninput="filterTable()" />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Invoice number</th>
                            <th>Client</th>
                            <th>Vendor</th>
                            <th>Billing Date</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td>{invoice.id}</td>
                                    <td>{invoice.client}</td>
                                    <td>{invoice.vendor}</td>
                                    <td>{invoice.billingDate}</td>
                                    <td className={`status ${invoice.status.toLowerCase()}`}>
    <label className={`status-label`}>
        {invoice.status}
    </label>
</td>
                                    <td>{invoice.amount}</td>

                                    <td className="table-actions">
                                        <button
                                            className={`edit-button ${invoice.status === "Paid" ? "paid" : "unpaid"
                                                }`}
                                            onClick={() => handlePayClick(invoice.id)}
                                            disabled={invoice.status === "Paid"}
                                        >
                                            Pay
                                        </button>
                                    </td>
                                    <td>
                                        <button><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No invoices found</td>
                            </tr>
                        )}

                    </tbody>


                </table>
            </div>
        </div>
    );
};

export default Invoice;
