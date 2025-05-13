import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { validateClientForm, validateVendorForm, validateItemForm } from '../utils/EntityModalValidation.js';

const DatabaseModal = ({ activeTab, setIsModalOpen, fetchClients, fetchVendors, fetchItems, editingEntity }) => {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [clientData, setClientData] = useState({
        name: '',
        phone: '',
        address: '',
        email: '',
        cifCnp: '',
        type: 'company'

    });

    const [vendorData, setVendorData] = useState({
        name: '',
        phone: '',
        address: '',
        email: '',
        cifCnp: '',
        type: 'company',

    });

    const [itemData, setItemData] = useState({
        name: '',
        um: '',
        price: '',
        description: '',
        type: 'product',
    });



    const handleChange = (event, entity) => {
        const { name, value } = event.target;
        if (entity === 'client') {
            setClientData({
                ...clientData,
                [name]: value,
            });
        } else if (entity === 'vendor') {
            setVendorData({
                ...vendorData,
                [name]: value,
            });
        } else if (entity === 'item') {
            setItemData({
                ...itemData,
                [name]: value,
            });
        }
    };

  useEffect(() => {
    if (activeTab === 'clients') {
        setClientData({
            name: '',
            phone: '',
            address: '',
            email: '',
            cifCnp: '',
            type: 'company', // Reset type here
        });
    } else if (activeTab === 'vendors') {
        setVendorData({
            name: '',
            phone: '',
            address: '',
            email: '',
            cifCnp: '',
            type: 'company', // Reset type here
        });
    } else if (activeTab === 'items') {
        setItemData({
            name: '',
            um: '',
            price: '',
            description: '',
            type: 'product', // Reset type here
        });
    }
}, [activeTab]);


    const handleClientTypeChange = (event) => {
        const value = event.target.value;
        setClientData(prev => ({
            ...prev,
            type: value, // Directly set the type in the data
            cifCnp: '', // Reset CNP/CUI when switching
        }));
    };

    const handleVendorTypeChange = (event) => {
        const value = event.target.value;
        setVendorData(prev => ({
            ...prev,
            type: value, // Directly set the type in the data
            cifCnp: '', // Reset CNP/CUI
        }));
    };

    const handleItemTypeChange = (event) => {
        const value = event.target.value;
        setItemData(prev => ({
            ...prev,
            type: value, // Directly set the type in the data
            um: '', // Reset UM (kg, pcs, etc.)
        }));
    };


    const closeModal = () => setIsModalOpen(false);



    const handleSubmitClient = async (event) => {
        event.preventDefault();

        const validationErrors = validateClientForm(clientData);
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }
        console.log("Validation Errors:", validationErrors);

        setLoading(true);

        const payload = {
            name: clientData.name,
            email: clientData.email,
            type: clientData.type,
            phone: clientData.phone,
            address: clientData.address,
            cifcnp: clientData.cifCnp,
        };

        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        if (!token) {
            alert("No token found");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/routes/clients/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Add the Authorization header with the token
                },
            });

            await fetchClients();
            closeModal();
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitVendor = async (event) => {
        event.preventDefault();

        const validationErrors = validateVendorForm(vendorData);
        if (validationErrors && Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        console.log("Validation Errors:", validationErrors);

        setLoading(true);

        const payload = {
            name: vendorData.name,
            email: vendorData.email,
            type: vendorData.type,
            phone: vendorData.phone,
            address: vendorData.address,
            cifcnp: vendorData.cifCnp,
        };

        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        if (!token) {
            alert("No token found");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/routes/vendors/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Add the Authorization header with the token
                },
            });

            await fetchVendors();
            closeModal();
        } catch (error) {
            console.error("Client POST Error:", error.response || error);

            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmitItem = async (event) => {
        event.preventDefault();
        console.log("Item Data Submitted:", itemData);

        const validationErrors = validateItemForm(itemData);
        if (validationErrors && Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        console.log("Validation Errors:", validationErrors);
        setLoading(true);

        const payload = {
            name: itemData.name,
            um: itemData.um,
            price: itemData.price,
            description: itemData.description,
            type: itemData.type,
        };
        console.log("Payload for Item:", payload);  // Log the payload

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert("No token found");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/routes/items/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log("Item Response:", response);  // Log the server response
            await fetchItems();
            closeModal();
        } catch (error) {
            console.error("Error posting item data:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-800 bg-opacity-60">
            <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{activeTab === 'clients' ? "Add a new client" : activeTab === 'vendors' ? "Add a new vendor" : "Add an new item"} </h3>
                    <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>
                        ✕
                    </button>
                </div>
                <form onSubmit={activeTab === 'clients' ? handleSubmitClient : activeTab === 'vendors' ? handleSubmitVendor : handleSubmitItem} className="mt-4">

                    {activeTab === 'clients' && (
                        <>
                            <label className="block text-sm font-medium text-gray-700 mt-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={clientData.name}
                                onChange={(e) => handleChange(e, 'client')}
                                placeholder="Enter client name"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={clientData.phone}
                                onChange={(e) => handleChange(e, 'client')}
                                placeholder="Enter client phone number"
                            />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={clientData.address}
                                onChange={(e) => handleChange(e, 'client')}
                                placeholder="Enter client address"
                            />
                            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Email</label>
                            <input
                                type="text"
                                name="email"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={clientData.email}
                                onChange={(e) => handleChange(e, 'client')}
                                placeholder="Enter client email"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Type</label>
                            <select
                                value={clientData.type}
                                onChange={handleClientTypeChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            >
                                <option value="company">Company</option>
                                <option value="individual">Individual</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                {clientData.type === 'company' ? 'CUI' : 'CNP'}
                            </label>
                            <input
                                type="text"
                                name="cifCnp"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={clientData.cifCnp}
                                onChange={(e) => handleChange(e, 'client')}
                                placeholder={clientData.type === 'company' ? 'Enter CUI' : 'Enter CNP'}
                            />
                            {errors.cifCnp && <p className="text-red-500 text-xs">{errors.cifCnp}</p>}
                        </>
                    )}

                    {activeTab === "vendors" && (
                        <>
                            <label className="block text-sm font-medium text-gray-700 mt-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vendorData.name}
                                onChange={(e) => handleChange(e, 'vendor')}
                                placeholder="Enter vendor name"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vendorData.phone}
                                onChange={(e) => handleChange(e, 'vendor')}
                                placeholder="Enter vendor phone number"
                            />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vendorData.address}
                                onChange={(e) => handleChange(e, 'vendor')}
                                placeholder="Enter vendor address"
                            />
                            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Email</label>
                            <input
                                type="text"
                                name="email"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vendorData.email}
                                onChange={(e) => handleChange(e, 'vendor')}
                                placeholder="Enter vendor email"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Type</label>
                            <select
                                value={vendorData.type}
                                onChange={handleVendorTypeChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            >
                                <option value="company">Company</option>
                                <option value="individual">Individual</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                {vendorData.type === 'company' ? 'CUI' : 'CNP'}
                            </label>
                            <input
                                type="text"
                                name="cifCnp"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vendorData.cifCnp}
                                onChange={(e) => handleChange(e, 'vendor')}
                                placeholder={vendorData.type === 'company' ? 'Enter CUI' : 'Enter CNP'}
                            />
                            {errors.cifCnp && <p className="text-red-500 text-xs">{errors.cifCnp}</p>}

                        </>
                    )}

                    {activeTab === "items" && (
                        <>
                            <label className="block text-sm font-medium text-gray-700 mt-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={itemData.name}
                                onChange={(e) => handleChange(e, 'item')}
                                placeholder="Enter item name"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Description</label>
                            <textarea
                                name="description"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={itemData.description}
                                onChange={(e) => handleChange(e, 'item')}
                                placeholder="Enter item description"
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                min={0}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={itemData.price}
                                step={0.01}
                                onChange={(e) => handleChange(e, 'item')}
                                placeholder="Enter item price"
                            />
                            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Type</label>
                            <select
                                value={itemData.type}
                                onChange={handleItemTypeChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            >
                                <option value="product">Product</option>
                                <option value="service">Service</option>
                            </select>


                            <label className="block text-sm font-medium text-gray-700 mt-2">Unit of Measurement</label>
                            <input
                                type="text"
                                name="um"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={itemData.um}
                                onChange={(e) => handleChange(e, 'item')}
                                placeholder="Enter unit of measurement"
                            />
                            {errors.um && <p className="text-red-500 text-xs">{errors.um}</p>}

                        </>


                    )}

                    <div className="flex justify-center mt-2">
                        <button type="submit" disabled={loading} className="mt-4 px-4 py-2 font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400">
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DatabaseModal;