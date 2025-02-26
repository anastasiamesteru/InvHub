import React, { useState } from 'react';

const DatabaseModal = ({ activeTab, clientType, vendorType, cifCnp, setCifCnp, handleClientTypeChange, handleVendorTypeChange, setIsModalOpen }) => {
    const [errors, setErrors] = useState({});

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhoneNo, setClientPhoneNo] = useState('');

    const [vendorName, setVendorName] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');
    const [vendorEmail, setVendorEmail] = useState('');

    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleClientNameChange = (event) => setClientName(event.target.value);
    const handleClientAddressChange = (event) => setClientAddress(event.target.value);
    const handleClientEmailChange = (event) => setClientEmail(event.target.value);
    const handleClientPhoneNoChange = (event) => setClientPhoneNo(event.target.value);

    const handleVendorNameChange = (event) => setVendorName(event.target.value);
    const handleVendorAddressChange = (event) => setVendorAddress(event.target.value);
    const handleVendorEmailChange = (event) => setVendorEmail(event.target.value);

    const handleItemNameChange = (event) => setItemName(event.target.value);
    const handleQuantityChange = (event) => setQuantity(event.target.value);
    const handlePriceChange = (event) => setPrice(event.target.value);

    const validateForm = () => {
        const newErrors = {};

        // Client Name Validation
        if (!clientName) {
            newErrors.clientName = "Client name is required.";
        }

        // Client Address Validation
        if (!clientAddress) {
            newErrors.clientAddress = "Client address is required.";
        }

        // Client Address Validation
        if (!clientPhoneNo) {
            newErrors.clientAddress = "Client address is required.";
        }

        // Client Email Validation
        if (!clientEmail) {
            newErrors.clientEmail = "Client email is required.";
        } else if (!/\S+@\S+\.\S+/.test(clientEmail)) {
            newErrors.clientEmail = "Please enter a valid email address.";
        }

        // Client CIF/CNP Validation
        if (!clientCifCnp) {
            newErrors.clientCifCnp = clientType === "company" ? "CIF is required." : "CNP is required.";
        } else if (clientType === "company" && !/^\d{8,9}$/.test(clientCifCnp)) {
            newErrors.clientCifCnp = "Please enter a valid CIF.";
        } else if (clientType === "individual" && !/^\d{13}$/.test(clientCifCnp)) {
            newErrors.clientCifCnp = "Please enter a valid CNP.";
        }

        // Vendor Name Validation
        if (!vendorName) {
            newErrors.vendorName = "Vendor name is required.";
        }

        // Vendor Address Validation
        if (!vendorAddress) {
            newErrors.vendorAddress = "Vendor address is required.";
        }

        // Vendor Email Validation
        if (!vendorEmail) {
            newErrors.vendorEmail = "Vendor email is required.";
        } else if (!/\S+@\S+\.\S+/.test(vendorEmail)) {
            newErrors.vendorEmail = "Please enter a valid email address.";
        }

        // Vendor CIF/CNP Validation
        if (!vendorCifCnp) {
            newErrors.vendorCifCnp = vendorType === "company" ? "CIF is required." : "CNP is required.";
        } else if (vendorType === "company" && !/^\d{8,9}$/.test(vendorCifCnp)) {
            newErrors.vendorCifCnp = "Please enter a valid CIF.";
        } else if (vendorType === "individual" && !/^\d{13}$/.test(vendorCifCnp)) {
            newErrors.vendorCifCnp = "Please enter a valid CNP.";
        }

        // Item Name Validation
        if (!itemName.trim()) {
            newErrors.itemName = "Item name is required.";
        }

        // Quantity Validation
        if (!quantity || quantity == 0) {
            newErrors.quantity = "Quantity must be a positive number.";
        }

        // Price Validation
        if (!price || price == 0) {
            newErrors.price = "Price must be a positive number.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Form is valid, handle the submission logic here
            console.log('Form submitted');
        }
    };

    const renderModalContent = () => {
        switch (activeTab) {
            case 'clients':
                return (
                    <>
                        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mt-1">Name</label>
                        <input
                            type="text"
                            id="clientName"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            value={clientName}
                            onChange={handleClientNameChange}
                            placeholder="Enter client name"
                        />
                        {errors.clientName && <p className="text-red-500 text-xs">{errors.clientName}</p>}

                        <label htmlFor="clientPhoneNo" className="block text-sm font-medium text-gray-700 mt-1">Phone Number</label>
                        <input
                            type="text"
                            id="clientPhoneNo"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter client phone number"
                        />
                        {errors.clientPhoneNo && <p className="text-red-500 text-xs">{errors.clientPhoneNo}</p>}

                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mt-1">Address</label>
                        <input
                            type="text"
                            id="address"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter client address"
                        />
                        {errors.clientAddress && <p className="text-red-500 text-xs">{errors.clientAddress}</p>}

                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-1">Email</label>
                        <input
                            type="text"
                            id="email"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter client email"
                        />
                        {errors.clientEmail && <p className="text-red-500 text-xs">{errors.clientEmail}</p>}

                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mt-1">Type</label>
                        <select
                            id="type"
                            value={clientType}
                            onChange={handleClientTypeChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        >
                            <option value="company">Company</option>
                            <option value="individual">Individual</option>
                        </select>
                        <label htmlFor="cif/cnp" className="block text-sm font-medium text-gray-700 mt-1">
                            {clientType === 'company' ? 'CIF' : 'CNP'}
                        </label>
                        <input
                            type="text"
                            id="cif/cnp"
                            value={cifCnp}
                            onChange={(e) => setCifCnp(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder={clientType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                        />
                        {errors.cifCnp && <p className="text-red-500 text-xs">{errors.cifCnp}</p>}
                    </>
                );
            case 'vendors':
                return (
                    <>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mt-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={clientName}
                            onChange={handleClientNameChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter vendor name"
                        />
                        {errors.clientName && <p className="text-red-500 text-xs">{errors.clientName}</p>}

                        <label htmlFor="phoneno" className="block text-sm font-medium text-gray-700 mt-1">Phone Number</label>
                        <input
                            type="text"
                            id="phoneno"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter vendor phone number"
                        />
                        {errors.phoneNo && <p className="text-red-500 text-xs">{errors.phoneNo}</p>}

                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mt-1">Address</label>
                        <input
                            type="text"
                            id="address"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter vendor address"
                        />
                        {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}

                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-1">Email</label>
                        <input
                            type="text"
                            id="email"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter vendor email"
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mt-1">Type</label>
                        <select
                            id="type"
                            value={vendorType}
                            onChange={handleVendorTypeChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        >
                            <option value="company">Company</option>
                            <option value="individual">Individual</option>
                        </select>
                        <label htmlFor="cif/cnp" className="block text-sm font-medium text-gray-700 mt-1">
                            {vendorType === 'company' ? 'CIF' : 'CNP'}
                        </label>
                        <input
                            type="text"
                            id="cif/cnp"
                            value={cifCnp}
                            onChange={(e) => setCifCnp(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder={vendorType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                        />
                        {errors.cifCnp && <p className="text-red-500 text-xs">{errors.cifCnp}</p>}
                    </>
                );
            case 'items':
                return (
                    <>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mt-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter item name"
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mt-1">Description</label>
                        <input
                            type="text"
                            id="description"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter item description"
                        />
                        {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}

                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mt-1">Price</label>
                        <input
                            type="text"
                            id="price"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter item price"
                        />
                        {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}

                        <label htmlFor="um" className="block text-sm font-medium text-gray-700 mt-1">Unit of Measure (U.M.)</label>
                        <input
                            type="text"
                            id="um"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter item U.M."
                        />
                        {errors.um && <p className="text-red-500 text-xs">{errors.um}</p>}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg w-96 relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 pr-4 pt-4"
                    onClick={closeModal}
                >
                    ✕
                </button>
                <h2 className="text-lg font-semibold mb-4">Add a new {activeTab.slice(0, -1).toLowerCase()}</h2>
                <form onSubmit={handleSubmit}>
                    {renderModalContent()}
                    <div className="flex justify-center mt-4">
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
