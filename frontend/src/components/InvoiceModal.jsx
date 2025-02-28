import React, { useState } from "react"

const InvoiceModal = ({ isOpen, onClose }) => {
    const [clientCifCnp, setClientCifCnp] = useState('');
    const [vendorCifCnp, setVendorCifCnp] = useState('');

    const [clientType, setClientType] = useState('company');
    const [vendorType, setVendorType] = useState('company');

    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientEmail, setClientEmail] = useState('');

    const [vendorName, setVendorName] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');
    const [vendorEmail, setVendorEmail] = useState('');

    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const [errors, setErrors] = useState({});

    const handleClientCifCnpChange = (event) => setClientCifCnp(event.target.value);
    const handleVendorCifCnpChange = (event) => setVendorCifCnp(event.target.value);

    const handleClientTypeChange = (event) => setClientType(event.target.value);
    const handleVendorTypeChange = (event) => setVendorType(event.target.value);

    const handleClientNameChange = (event) => setClientName(event.target.value);
    const handleClientAddressChange = (event) => setClientAddress(event.target.value);
    const handleClientEmailChange = (event) => setClientEmail(event.target.value);

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

    const onSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            // Handle form submission
            console.log("Form submitted successfully!");
        }
    };

    const [products, setProducts] = useState([
        { itemName: '', quantity: '', price: '' }
    ]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Create a new invoice</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form className="mt-4">
                    <div className="flex justify-between border-b-2 border-gray-400 pb-4">
                        <div className="w-1/2 pr-2 flex flex-col items-center">
                            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Invoice number</label>
                            <input
                                id="invoiceNumber"
                                type="text"
                                className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="w-1/2 pl-2 flex flex-col items-center">
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                            <input
                                id="currency"
                                type="text"
                                className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>


                    <div className="flex justify-between border-b-2 border-gray-400 pt-4 pb-4">
                        <div className="w-1/2 pr-2 flex flex-col items-center">
                            <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">Issue date</label>
                            <input
                                id="issueDate"
                                type="date"
                                className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="w-1/2 pl-2 flex flex-col items-center">
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due date</label>
                            <input
                                id="dueDate"
                                type="date"
                                className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>


                    <div className="flex justify-between border-b-2 border-gray-400 pt-4 pb-4">
                        {/* Client Info*/}
                        <div className="w-1/2 pr-5 border-r-2 border-gray-300">
                            <h3 className="text-lg font-semibold text-center">Client Information</h3>
                            <div className="my-2">
                                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Name:</label>
                                <input
                                    id="clientName"
                                    type="text"
                                    placeholder="Client Name"
                                    value={clientName}
                                    onChange={handleClientNameChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.clientName && <p className="text-red-500 text-xs">{errors.clientName}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">Address:</label>
                                <input
                                    id="clientAddress"
                                    type="text"
                                    placeholder="Client Address"
                                    value={clientAddress}
                                    onChange={handleClientAddressChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.clientAddress && <p className="text-red-500 text-xs">{errors.clientAddress}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    id="clientEmail"
                                    type="email"
                                    placeholder="client@example.com"
                                    value={clientEmail}
                                    onChange={handleClientEmailChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.clientEmail && <p className="text-red-500 text-xs">{errors.clientEmail}</p>}

                            </div>
                            <div className="my-2">
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
                            </div>
                            <div className="my-2">
                                <label htmlFor="client-cif-cnp" className="block text-sm font-medium text-gray-700 mt-1">
                                    {clientType === 'company' ? 'CIF' : 'CNP'}
                                </label>
                                <input
                                    type="text"
                                    id="client-cif-cnp"
                                    value={clientCifCnp}
                                    onChange={handleClientCifCnpChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    placeholder={clientType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                                />
                                {errors.clientCifCnp && <p className="text-red-500 text-xs">{errors.clientCifCnp}</p>}

                            </div>

                        </div>

                        {/* Vendor Info*/}
                        <div className="w-1/2 pr-5 border-gray-300 pl-4">
                            <h3 className="text-lg font-semibold text-center">Vendor Information</h3>
                            <div className="my-2">
                                <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">Name:</label>
                                <input
                                    id="vendorName"
                                    type="text"
                                    placeholder="Vendor Name"
                                    value={vendorName}
                                    onChange={handleVendorNameChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.vendorName && <p className="text-red-500 text-xs">{errors.vendorName}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="vendorAddress" className="block text-sm font-medium text-gray-700">Address:</label>
                                <input
                                    id="vendorAddress"
                                    type="text"
                                    placeholder="Vendor Address"
                                    value={vendorAddress}
                                    onChange={handleVendorAddressChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.vendorAddress && <p className="text-red-500 text-xs">{errors.vendorAddress}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="vendorEmail" className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    id="vendorEmail"
                                    type="email"
                                    placeholder="vendor@example.com"
                                    value={vendorEmail}
                                    onChange={handleVendorEmailChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.vendorEmail && <p className="text-red-500 text-xs">{errors.vendorEmail}</p>}

                            </div>
                            <div className="my-2">
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
                            </div>


                            <div className="my-2">
                                <label htmlFor="vendor-cif-cnp" className="block text-sm font-medium text-gray-700 mt-1">
                                    {vendorType === 'company' ? 'CIF' : 'CNP'}
                                </label>
                                <input
                                    type="text"
                                    id="vendor-cif-cnp"
                                    value={vendorCifCnp}
                                    onChange={handleVendorCifCnpChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    placeholder={vendorType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                                />
                                {errors.vendorCifCnp && <p className="text-red-500 text-xs">{errors.vendorCifCnp}</p>}

                            </div>
                        </div>


                    </div>
                    <div className="mt-6">
                        <table className="w-full border-collapse border border-gray-300">
                            {/* Table Header */}
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 text-center">Item</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">Unit Price</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">Total</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">

                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <input type="text" placeholder="Product/Service" className="w-full p-1 border rounded-md" value={itemName}
                                            onChange={handleItemNameChange} />

                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <input type="number" placeholder="Qty" className="w-16 p-1 border rounded-md text-center" value={quantity}
                                            onChange={handleQuantityChange} />

                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <input type="number" placeholder="Price" className="w-20 p-1 border rounded-md text-center" value={price}
                                            onChange={handlePriceChange} />

                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <span>$0.00</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Add Item Button */}
                        <button className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md">+ Add new line</button>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="px-1 py-2 bg-purple-500 text-white font-semibold text-md rounded-md hover:bg-purple-600 transition-colors w-60"
                            onClick={onSubmit} >
                            Submit
                        </button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default InvoiceModal;