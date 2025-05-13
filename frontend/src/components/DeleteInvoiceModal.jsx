import React from 'react';
import axios from 'axios';

const DeleteInvoiceModal = ({ isOpen, onClose, invoiceToDelete, onDeleteSuccess }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

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

            // Call the onDeleteSuccess callback to refresh the invoice list after deleting
            onDeleteSuccess(id);
            onClose(); // Close the modal after deleting
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-10 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h3 className="text-lg font-semibold text-center mb-4">Delete Invoice</h3>
                <p className="text-sm text-center mb-4">Are you sure you want to delete this invoice? This action cannot be undone.</p>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose} // Close modal without deleting
                        className="bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-md hover:bg-gray-400 hover:text-gray-900"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => deleteInvoice(invoiceToDelete)} // Call delete when Confirm/Delete button is clicked
                        className="bg-purple-600 font-semibold text-white px-4 py-2 rounded-md hover:bg-purple-700 hover:text-white"
                    >
                        Delete
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DeleteInvoiceModal;
