import React from 'react';
import axios from 'axios';

const DeleteEntityModal = ({ isOpen, onClose, idToDelete, activeTab, fetchClients, fetchVendors, fetchItems }) => {
    if (!isOpen) return null;

    const handleDelete = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No token found");
            return;
        }

        let deleteEndpoint = "";

        if (activeTab === "clients") deleteEndpoint = `/routes/clients/${idToDelete}`;
        else if (activeTab === "vendors") deleteEndpoint = `/routes/vendors/${idToDelete}`;
        else if (activeTab === "items") deleteEndpoint = `/routes/items/${idToDelete}`;
        else {
            console.error("Invalid tab for deletion.");
            return;
        }

        try {
            await axios.delete(`http://localhost:4000${deleteEndpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Refresh the appropriate data
            if (activeTab === "clients") fetchClients();
            else if (activeTab === "vendors") fetchVendors();
            else if (activeTab === "items") fetchItems();

            onClose(); // Close modal after deletion
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-10 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h3 className="text-lg font-semibold text-center mb-4">Delete {activeTab.slice(0, -1)}</h3>
                <p className="text-sm text-center mb-4">
                    Are you sure you want to delete this {activeTab.slice(0, -1)}? This action cannot be undone.
                </p>

                 <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose} // Close modal without deleting
                        className="bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-md hover:bg-gray-400 hover:text-gray-900"
                    >
                        Cancel
                    </button>
                    <button
                         onClick={handleDelete} // Call delete when Confirm/Delete button is clicked
                        className="bg-purple-600 font-semibold text-white px-4 py-2 rounded-md hover:bg-purple-700 hover:text-white"
                    >
                        Delete
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DeleteEntityModal;
