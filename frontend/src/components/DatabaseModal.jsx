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
    });

    const [vendorData, setVendorData] = useState({
        name: '',
        phone: '',
        address: '',
        email: '',
        cifCnp: '',
    });

    const [itemData, setItemData] = useState({
        name: '',
        um: '',
        price: '',
        description: '',
    });

    const [clientType, setClientType] = useState('company');
    const [vendorType, setVendorType] = useState('company');
    const [itemType, setItemType] = useState('product');

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
        // Reset form data when the tab changes
        if (activeTab === 'clients') {
            setClientData({
                name: '',
                phone: '',
                address: '',
                email: '',
                cifCnp: '',
            });
        } else if (activeTab === 'vendors') {
            setVendorData({
                name: '',
                phone: '',
                address: '',
                email: '',
                cifCnp: '',
            });
        } else if (activeTab === 'items') {
            setItemData({
                name: '',
                um: '',
                price: '',
                description: '',
            });
        }
    }, [activeTab]);
    
    const handleClientTypeChange = (event) => setClientType(event.target.value);
    const handleVendorTypeChange = (event) => setVendorType(event.target.value);
    const handleItemTypeChange = (event) => setItemType(event.target.value);

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
            type: clientType,
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
            type: vendorType,
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
            type: itemType,
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : 'Unknown'}</h3>
                    <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>
                        ✕
                    </button>
                </div>
                <form onSubmit={activeTab === 'clients' ? handleSubmitClient : activeTab === 'vendors' ? handleSubmitVendor : handleSubmitItem} className="mt-4">
                {console.log("Current submit handler:", activeTab === 'clients' ? 'handleSubmitClient' : activeTab === 'vendors' ? 'handleSubmitVendor' : 'handleSubmitItem')}

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
                                type="number"
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
                                value={clientType}
                                onChange={handleClientTypeChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            >
                                <option value="company">Company</option>
                                <option value="individual">Individual</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                {clientType === 'company' ? 'CIF' : 'CNP'}
                            </label>
                            <input
                                type="text"
                                name="cifCnp"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={clientData.cifCnp}
                                onChange={(e) => handleChange(e, 'client')}
                                placeholder={clientType === 'company' ? 'Enter CIF' : 'Enter CNP'}
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
                                type="number"
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
                                value={vendorType}
                                onChange={handleVendorTypeChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            >
                                <option value="company">Company</option>
                                <option value="individual">Individual</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                {vendorType === 'company' ? 'CIF' : 'CNP'}
                            </label>
                            <input
                                type="text"
                                name="cifCnp"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vendorData.cifCnp}
                                onChange={(e) => handleChange(e, 'vendor')}
                                placeholder={vendorType === 'company' ? 'Enter CIF' : 'Enter CNP'}
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
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={itemData.price}
                                onChange={(e) => handleChange(e, 'item')}
                                placeholder="Enter item price"
                            />
                            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Type</label>
                            <select
                                value={itemType}
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