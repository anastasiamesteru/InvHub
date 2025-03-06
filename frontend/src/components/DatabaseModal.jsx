import React, { useState } from 'react';
import axios from 'axios';

const DatabaseModal = ({
    activeTab,
    clientType,
    vendorType,
    setIsModalOpen,
    handleClientTypeChange,
    handleVendorTypeChange
}) => {
    const [errors, setErrors] = useState({});

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Form State for Clients
    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhoneNo, setClientPhoneNo] = useState('');
    const [clientCifCnp, setClientCifCnp] = useState('');

    // Form State for Vendors
    const [vendorName, setVendorName] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');
    const [vendorEmail, setVendorEmail] = useState('');
    const [vendorPhoneNo, setVendorPhoneNo] = useState('');
    const [vendorCifCnp, setVendorCifCnp] = useState('');

    // Form State for Items
    const [itemName, setItemName] = useState('');
    const [UM, setUM] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [productUM, setProductUM] = useState('');
    const [serviceUM, setServiceUM] = useState('');
    const [itemType, setItemType] = useState('product'); 

    // Generic handler for input changes
    const handleChange = (setter) => (event) => setter(event.target.value);

    const validateForm = () => {
        const newErrors = {};

        if (activeTab === "clients") {
            if (!clientName.trim()) newErrors.clientName = "Client name is required.";
            if (!clientAddress.trim()) newErrors.clientAddress = "Client address is required.";
            if (!clientPhoneNo.trim() || !/^\d{10}$/.test(clientPhoneNo))
                newErrors.clientPhoneNo = "Valid phone number (10 digits) is required.";
            if (!clientEmail.trim() || !/\S+@\S+\.\S+/.test(clientEmail))
                newErrors.clientEmail = "Valid email is required.";
            if (!clientCifCnp.trim())
                newErrors.clientCifCnp = clientType === "company" ? "CIF is required." : "CNP is required.";
            else if (clientType === "company" && !/^\d{8,9}$/.test(clientCifCnp))
                newErrors.clientCifCnp = "Valid CIF required (8-9 digits).";
            else if (clientType === "individual" && !/^\d{13}$/.test(clientCifCnp))
                newErrors.clientCifCnp = "Valid CNP required (13 digits).";
        }

        if (activeTab === "vendors") {
            if (!vendorName.trim()) newErrors.vendorName = "Vendor name is required.";
            if (!vendorAddress.trim()) newErrors.vendorAddress = "Vendor address is required.";
            if (!vendorPhoneNo.trim() || !/^\d{10}$/.test(vendorPhoneNo))
                newErrors.vendorPhoneNo = "Valid phone number (10 digits) is required.";
            if (!vendorEmail.trim() || !/\S+@\S+\.\S+/.test(vendorEmail))
                newErrors.vendorEmail = "Valid email is required.";
            if (!vendorCifCnp.trim())
                newErrors.vendorCifCnp = vendorType === "company" ? "CIF is required." : "CNP is required.";
            else if (vendorType === "company" && !/^\d{8,9}$/.test(vendorCifCnp))
                newErrors.vendorCifCnp = "Valid CIF required (8-9 digits).";
            else if (vendorType === "individual" && !/^\d{13}$/.test(vendorCifCnp))
                newErrors.vendorCifCnp = "Valid CNP required (13 digits).";
        }

        if (activeTab === "items") {
            if (!itemName.trim()) newErrors.itemName = "Item name is required.";
            if (!UM.trim()) newErrors.UM = "Unit of measurement (UM) is required.";
            if (!price.trim() || isNaN(price) || parseFloat(price) <= 0)
                newErrors.price = "Valid price (greater than 0) is required.";
            if (!quantity.trim() || isNaN(quantity) || parseInt(quantity) <= 0)
                newErrors.quantity = "Valid quantity (greater than 0) is required.";
            if (!description.trim()) newErrors.description = "Description is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        let endpoint = '';
        let payload = {};

        if (activeTab === "clients") {
            endpoint = 'http://localhost:4000/client/create';
            payload = {
                name: clientName,
                address: clientAddress,
                email: clientEmail,
                phone: clientPhoneNo,
                cifCnp: clientCifCnp,
                type: clientType, 
            };
        } else if (activeTab === "vendors") {
            endpoint = 'http://localhost:4000/vendor/create';
            payload = {
                name: vendorName,
                address: vendorAddress,
                email: vendorEmail,
                phone: vendorPhoneNo,
                cifCnp: vendorCifCnp,
                type: vendorType, 
            };
        } else if (activeTab === "items") {
            endpoint = 'http://localhost:4000/item/create';
            payload = {
                name: itemName,
                description,
                price,
                itemType, 
                UM: itemType === 'product' ? productUM : serviceUM,
            };
        }

        try {
            const response = await axios.post(endpoint, payload);
            alert(`${activeTab} entry added successfully!`);
            closeModal();
        } catch (error) {
            console.error('Error posting data:', error);
            alert('Failed to add entry.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">
                        {activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : "Unknown"}
                    </h3>
                    <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                    {activeTab === "clients" && (
                        <>
                            <label className="block text-sm font-medium text-gray-700 mt-2">Name</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={clientName}
                                onChange={handleChange(setClientName)}
                                placeholder="Enter client name"
                            />
                            {errors.clientName && <p className="text-red-500 text-xs">{errors.clientName}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Phone Number</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={clientPhoneNo}
                                onChange={handleChange(setClientPhoneNo)}
                                placeholder="Enter client phone number"
                            />
                            {errors.clientPhoneNo && <p className="text-red-500 text-xs">{errors.clientPhoneNo}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Address</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={clientAddress}
                                onChange={handleChange(setClientAddress)}
                                placeholder="Enter client address"
                            />
                            {errors.clientAddress && <p className="text-red-500 text-xs">{errors.clientAddress}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Email</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={clientEmail}
                                onChange={handleChange(setClientEmail)}
                                placeholder="Enter client email"
                            />
                            {errors.clientEmail && <p className="text-red-500 text-xs">{errors.clientEmail}</p>}

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
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={clientCifCnp}
                                onChange={handleChange(setClientCifCnp)}
                                placeholder={clientType === 'company' ? 'Enter CIF' : 'Enter CNP'}
                            />
                            {errors.clientCifCnp && <p className="text-red-500 text-xs">{errors.clientCifCnp}</p>}
                        </>
                    )}

                    {activeTab === "vendors" && (
                        <>
                            <label className="block text-sm font-medium text-gray-700 mt-2">Name</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vendorName}
                                onChange={handleChange(setVendorName)}
                                placeholder="Enter vendor name"
                            />
                            {errors.vendorName && <p className="text-red-500 text-xs">{errors.vendorName}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Phone Number</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vendorPhoneNo}
                                onChange={handleChange(setVendorPhoneNo)}
                                placeholder="Enter vendor phone number"
                            />
                            {errors.vendorPhoneNo && <p className="text-red-500 text-xs">{errors.vendorPhoneNo}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Address</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vendorAddress}
                                onChange={handleChange(setVendorAddress)}
                                placeholder="Enter vendor address"
                            />
                            {errors.vendorAddress && <p className="text-red-500 text-xs">{errors.vendorAddress}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Email</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vendorEmail}
                                onChange={handleChange(setVendorEmail)}
                                placeholder="Enter vendor email"
                            />
                            {errors.vendorEmail && <p className="text-red-500 text-xs">{errors.vendorEmail}</p>}

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
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vendorCifCnp}
                                onChange={handleChange(setVendorCifCnp)}
                                placeholder={vendorType === 'company' ? 'Enter CIF' : 'Enter CNP'}
                            />
                            {errors.vendorCifCnp && <p className="text-red-500 text-xs">{errors.vendorCifCnp}</p>}
                        </>
                    )}

                    {activeTab === "items" && (
                        <>
                            <label className="block text-sm font-medium text-gray-700 mt-2">Name</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={itemName}
                                onChange={handleChange(setItemName)}
                                placeholder="Enter item name"
                            />
                            {errors.itemName && <p className="text-red-500 text-xs">{errors.itemName}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Type</label>
                            <select
                                value={itemType}
                                onChange={(e) => {
                                    setItemType(e.target.value);
                                    setUM(''); // Reset the UM field when changing item type
                                }}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            >
                                <option value="product">Product</option>
                                <option value="service">Service</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                {itemType === 'product' ? 'Product Unit of Measurement (UM)' : 'Service Unit of Measurement (UM)'}
                            </label>
                            <select
                                value={UM}
                                onChange={handleChange(setUM)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            >
                                {itemType === 'product' ? (
                                    <>
                                        <option value="kg">Kg</option>
                                        <option value="pcs">Pieces</option>
                                        <option value="liters">Liters</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="hours">Hours</option>
                                        <option value="days">Days</option>
                                        <option value="service">Service</option>
                                    </>
                                )}
                            </select>
                            {errors.UM && <p className="text-red-500 text-xs">{errors.UM}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Price</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={price}
                                onChange={handleChange(setPrice)}
                                placeholder="Enter price"
                            />
                            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Quantity</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={quantity}
                                onChange={handleChange(setQuantity)}
                                placeholder="Enter quantity"
                            />
                            {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Description</label>
                            <textarea
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={description}
                                onChange={handleChange(setDescription)}
                                placeholder="Enter item description"
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                        </>
                    )}

                    <div className="mt-4 flex justify-center">
                        <button
                            type="submit"
                            className="px-1 py-2 bg-purple-500 text-white font-semibold text-md rounded-md hover:bg-purple-600 transition-colors w-60"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DatabaseModal;
