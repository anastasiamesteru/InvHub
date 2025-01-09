import React, { useState, useEffect } from 'react';
import './Invoice.css';

const Invoice = () => {
    const [invoices, setInvoices] = useState([
        //placeholders
        { id: 1, client: 'Client A', vendor: 'Vendor X', billingDate: '2025-01-01', status: 'Paid', amount: 500 },
        { id: 2, client: 'Client B', vendor: 'Vendor Y', billingDate: '2025-01-02', status: 'Pending', amount: 200 },
        { id: 3, client: 'Client C', vendor: 'Vendor Z', billingDate: '2025-01-03', status: 'Unpaid', amount: 800 }
    ]);

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
                <h3>Invoice List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Client</th>
                            <th>Vendor</th>
                            <th>Billing Date</th>
                            <th>Status</th>
                            <th>Amount ($)</th>
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
                                    <td>{invoice.status}</td>
                                    <td>{invoice.amount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No invoices found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Invoice;
