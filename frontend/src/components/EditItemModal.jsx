import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditItemModal = ({ show, onClose, itemId, onUpdate }) => {
    const [loading, setLoading] = useState(false);

    const [itemData, setItemData] = useState({
        name: '',
        um: '',
        price: '',
        description: '',
        type: '',
    });

    useEffect(() => {
        if (itemId && show) {  // Ensure itemId is valid and modal is visible
            const fetchItemData = async () => {
                const token = localStorage.getItem('authToken'); // Get the token from localStorage
                if (!token) {
                    console.error("No token found");
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:4000/routes/items/${itemId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Include Bearer token in the request header
                        },
                    });

                    if (!response.ok) throw new Error('Failed to fetch item data');
                    const data = await response.json();
                    setItemData(data);  // Set fetched item data
                } catch (error) {
                    console.error("Error fetching item:", error);
                    setError(error.message);  // Display error if occurs
                }
            }

            fetchItemData();
        }
    }, [itemId, show]);  // Depend on itemId and show to refetch when the modal is opened

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setItemData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem("authToken"); // Get token from localStorage
        if (!token) return alert("No token found.");

        setLoading(true); // Show loading state while waiting for the request

        try {
            // Make a PUT request to update the item
            const response = await fetch(`http://localhost:4000/routes/items/${itemId}`, {
                method: 'PUT', // HTTP method is PUT to update
                headers: {
                    'Authorization': `Bearer ${token}`, // Pass token as Authorization header
                    'Content-Type': 'application/json', // Content-Type header to indicate JSON data
                },
                body: JSON.stringify(itemData), // Send the updated item data in the request body
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            const updatedItem = await response.json(); // Get the updated item data from the response
            onUpdate(updatedItem); // Call the onUpdate callback to update the item in the parent component
            onClose(); // Close the modal after successful update
        } catch (error) {
            console.error("Error saving item data:", error.message);
            setError(error.message); // Display error message in the modal
        } finally {
            setLoading(false); // Stop loading state once the request is done
        }
    };

    if (!show) return null;

    return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-800 bg-opacity-10">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Edit item</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
      
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-left text-sm font-medium text-gray-700 mt-2">Name</label>
                <input
                  type="text"
                  name="name"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  value={itemData.name}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                />
      
                <label className="block text-left text-sm font-medium text-gray-700 mt-2">Description</label>
                <textarea
                  name="description"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  value={itemData.description}
                  onChange={handleInputChange}
                  placeholder="Enter item description"
                />
      
                <label className="block text-left text-sm font-medium text-gray-700 mt-2">Price</label>
                <input
                  type="number"
                  name="price"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  value={itemData.price}
                  onChange={handleInputChange}
                  placeholder="Enter item price"
                />
      
                <label className="block text-left text-sm font-medium text-gray-700 mt-2">Type</label>
                <select
                  name="type"
                  value={itemData.type}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                >
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                </select>
      
                <label className="block text-left text-sm font-medium text-gray-700 mt-2">Unit of Measurement</label>
                <input
                  type="text"
                  name="um"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  value={itemData.um}
                  onChange={handleInputChange}
                  placeholder="Enter unit of measurement"
                />
              </div>
      
              <div className="flex justify-end gap-3 mt-4 justify-center">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
    );
};

export default EditItemModal;
