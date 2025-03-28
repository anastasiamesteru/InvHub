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
        UM: '',
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

    const handleClientTypeChange = (event) => setClientType(event.target.value);
    const handleVendorTypeChange = (event) => setVendorType(event.target.value);
    const handleItemTypeChange = (event) => setItemType(event.target.value);

    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (editingEntity) {
            if (activeTab === 'client') {
                setClientData({
                    name: editingEntity.name || '',
                    phone: editingEntity.phone || '',
                    address: editingEntity.address || '',
                    email: editingEntity.email || '',
                    cifCnp: editingEntity.cifCnp || '',
                });
                setClientType(editingEntity.type || 'company');
            } else if (activeTab === 'vendor') {
                setVendorData({
                    name: editingEntity.name || '',
                    phone: editingEntity.phone || '',
                    address: editingEntity.address || '',
                    email: editingEntity.email || '',
                    cifCnp: editingEntity.cifCnp || '',
                });
                setVendorType(editingEntity.type || 'company');
            } else if (activeTab === 'item') {
                setItemData({
                    name: editingEntity.name || '',
                    UM: editingEntity.UM || '',
                    price: editingEntity.price || '',
                    description: editingEntity.description || '',
                });
                setItemType(editingEntity.type || 'product');
            }
        }
    }, [editingEntity, activeTab]);


    const handleSubmitClient = async (event) => {
        event.preventDefault();

        const validationErrors = validateClientForm(clientData);
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        const payload = {
            name: clientData.name,
            email: clientData.email,
            type: clientType,
            phone: clientData.phone,
            address: clientData.address,
            cifcnp: clientData.cifCnp,
        };

        try {
            let response;
            if (editingEntity) {
                response = await axios.put(`http://localhost:4000/routes/clients/${id}`, payload, {
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                // Create new client
                response = await axios.post('http://localhost:4000/routes/clients/create', payload, {
                    headers: { 'Content-Type': 'application/json' },
                });
            }

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
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        const payload = {
            name: vendorData.name,
            email: vendorData.email,
            type: vendorType,
            phone: vendorData.phone,
            address: vendorData.address,
            cifcnp: vendorData.cifCnp,
        };

        try {
            // Send data to the server
            const response = await axios.post('http://localhost:4000/routes/vendors/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            await fetchVendors();

            closeModal();
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response?.data?.message || 'An error occurred'}`);
            } else {
                alert(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleSubmitItem = async (event) => {
        event.preventDefault();

        const validationErrors = validateItemForm(itemData);
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        const payload = {
            name: itemData.name,
            UM: itemData.UM,
            price: itemData.price,
            description: itemData.description,
            type: itemType,
        };

        try {
            const response = await axios.post('http://localhost:4000/routes/items/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Item response:', response);
            await fetchItems();

            closeModal();
        } catch (error) {
            console.error('Error posting item data:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                alert(`Error: ${error.response?.data?.message || error.message}`);
            } else {
                alert(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleUpdateClient = async (event) => {
        event.preventDefault();

        if (!validateClientForm()) return;

        setLoading(true);

        const payload = {
            name: clientData.name,
            email: clientData.email,
            type: clientType,
            phone: clientData.phone,
            address: clientData.address,
            cifcnp: clientData.cifCnp,
        };

        try {
            const response = await axios.put(`http://localhost:4000/routes/clients/${entityToEdit.id}`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            await fetchClients();
            closeModal();
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || 'An error occurred'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateVendor = async (event) => {
        event.preventDefault();

        if (!validateVendorForm()) return;

        setLoading(true);

        const payload = {
            name: vendorData.name,
            email: vendorData.email,
            type: vendorType,
            phone: vendorData.phone,
            address: vendorData.address,
            cifcnp: vendorData.cifCnp,
        };

        try {
            const response = await axios.put(`http://localhost:4000/routes/vendors/${entityToEdit.id}`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            await fetchVendors();
            closeModal();
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || 'An error occurred'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateItem = async (event) => {
        event.preventDefault();

        if (!validateItemForm()) return;

        setLoading(true);

        const payload = {
            name: itemData.name,
            UM: itemData.UM,
            price: itemData.price,
            description: itemData.description,
        };

        try {
            const response = await axios.put(`http://localhost:4000/routes/items/${entityToEdit.id}`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            await fetchItems();
            closeModal();
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || 'An error occurred'}`);
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
                                name="UM"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={itemData.UM}
                                onChange={(e) => handleChange(e, 'item')}
                                placeholder="Enter unit of measurement"
                            />
                            {errors.UM && <p className="text-red-500 text-xs">{errors.UM}</p>}

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