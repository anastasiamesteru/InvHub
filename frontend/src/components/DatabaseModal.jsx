import React, { useState } from 'react';
import axios from 'axios';

const DatabaseModal = ({ activeTab, setIsModalOpen, fetchClients, fetchVendors, fetchItems }) => {
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

    const validateClientForm = () => {
        const newErrors = {};
        if (!clientData.name.trim()) newErrors.name = 'Name is required.';
        if (!clientData.address.trim()) newErrors.address = 'Address is required.';
        if (!clientData.phone.trim() || !/^\d{10}$/.test(clientData.phone)) newErrors.phone = 'Valid phone number (10 digits) is required.';
        if (!clientData.email.trim() || !/\S+@\S+\.\S+/.test(clientData.email)) newErrors.email = 'Valid email is required.';
        if (!clientData.cifCnp.trim()) {
            newErrors.cifCnp = clientType === 'company' ? 'CIF is required.' : 'CNP is required.';
        } else if (clientType === 'company' && !/^\d{8,9}$/.test(clientData.cifCnp)) {
            newErrors.cifCnp = 'Valid CIF required (8-9 digits).';
        } else if (clientType === 'individual' && !/^\d{13}$/.test(clientData.cifCnp)) {
            newErrors.cifCnp = 'Valid CNP required (13 digits).';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateVendorForm = () => {
        const newErrors = {};
        if (!vendorData.name.trim()) newErrors.name = 'Name is required.';
        if (!vendorData.address.trim()) newErrors.address = 'Address is required.';
        if (!vendorData.phone.trim() || !/^\d{10}$/.test(vendorData.phone)) newErrors.phone = 'Valid phone number (10 digits) is required.';
        if (!vendorData.email.trim() || !/\S+@\S+\.\S+/.test(vendorData.email)) newErrors.email = 'Valid email is required.';
        if (!vendorData.cifCnp.trim()) {
            newErrors.cifCnp = vendorType === 'company' ? 'CIF is required.' : 'CNP is required.';
        } else if (vendorType === 'company' && !/^\d{8,9}$/.test(vendorData.cifCnp)) {
            newErrors.cifCnp = 'Valid CIF required (8-9 digits).';
        } else if (vendorType === 'individual' && !/^\d{13}$/.test(vendorData.cifCnp)) {
            newErrors.cifCnp = 'Valid CNP required (13 digits).';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateItemForm = () => {
        const newErrors = {};
        if (!itemData.name.trim()) newErrors.name = 'Item name is required.';
        if (!itemData.UM.trim()) newErrors.UM = 'Unit of measurement is required.';
        if (!itemData.price.trim() || isNaN(itemData.price) || parseFloat(itemData.price) <= 0) newErrors.price = 'Valid price (greater than 0) is required.';
        if (!itemData.description.trim()) newErrors.description = 'Description is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitClient = async (event) => {
        event.preventDefault();

        // Validate form before proceeding
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
            // Send data to the server
            const response = await axios.post('http://localhost:4000/routes/clients/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            await fetchClients();
            closeModal();
        } catch (error) {
            // Detailed error handling
            if (error.response) {
                // Server returned a response, display specific message
                alert(`Error: ${error.response?.data?.message || 'An error occurred'}`);
            } else {
                // No response from the server (e.g., network issue)
                alert(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleSubmitVendor = async (event) => {
        event.preventDefault();

        // Validate form before proceeding
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
            // Send data to the server
            const response = await axios.post('http://localhost:4000/routes/vendors/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            await fetchVendors();

            // Success message
            closeModal();
        } catch (error) {
            // Detailed error handling
            if (error.response) {
                // Server returned a response, display specific message
                alert(`Error: ${error.response?.data?.message || 'An error occurred'}`);
            } else {
                // No response from the server (e.g., network issue)
                alert(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleSubmitItem = async (event) => {
        event.preventDefault();
        if (!validateItemForm()) return;

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
