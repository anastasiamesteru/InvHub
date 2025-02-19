import React, { useState } from "react"

const InvoiceModal = ({ isOpen, onClose }) => {
    const [cifCnp, setCifCnp] = useState('');

    const [clientType, setClientType] = useState('company');

    const handleClientTypeChange = (event) => {
        setClientType(event.target.value);
    };

    const handleClientCifCnpChange = (event) => {
        setCifCnp(event.target.value);
    };

    const [vendorType, setVendorType] = useState('company');

    const handleVendorTypeChange = (event) => {
        setVendorType(event.target.value);
    };

    const handleVendorCifCnpChange = (event) => {
        setCifCnp(event.target.value);
    };



    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Create New Invoice</h3>
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
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="my-2">
                                <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">Address:</label>
                                <input
                                    id="clientAddress"
                                    type="text"
                                    placeholder="Client Address"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="my-2">
                                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    id="clientEmail"
                                    type="email"
                                    placeholder="client@example.com"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
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
                                <label htmlFor="cif/cnp" className="block text-sm font-medium text-gray-700 mt-1">
                                    {clientType === 'company' ? 'CIF' : 'CNP'}
                                </label>
                                <input
                                    type="text"
                                    id="cif/cnp"
                                    value={cifCnp}
                                    onChange={handleClientCifCnpChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    placeholder={clientType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                                />
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
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="my-2">
                                <label htmlFor="vendorAddress" className="block text-sm font-medium text-gray-700">Address:</label>
                                <input
                                    id="vendorAddress"
                                    type="text"
                                    placeholder="Vendor Address"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="my-2">
                                <label htmlFor="vendorEmail" className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    id="vendorEmail"
                                    type="email"
                                    placeholder="vendor@example.com"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
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
                                <label htmlFor="cif/cnp" className="block text-sm font-medium text-gray-700 mt-1">
                                    {vendorType === 'company' ? 'CIF' : 'CNP'}
                                </label>
                                <input
                                    type="text"
                                    id="cif/cnp"
                                    value={cifCnp}
                                    onChange={handleVendorCifCnpChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    placeholder={vendorType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                                />
                            </div>
                        </div>


                    </div>
                    <div className="mt-6">
                        <table className="w-full border-collapse border border-gray-300">
                            {/* Table Header */}
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">Unit Price</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">Total</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <input type="text" placeholder="Product/Service" className="w-full p-1 border rounded-md" />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <input type="number" placeholder="Qty" className="w-16 p-1 border rounded-md text-center" />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <input type="number" placeholder="Price" className="w-20 p-1 border rounded-md text-center" />
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

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-500 text-white font-semibold text-sm rounded-md hover:bg-purple-600 transition-colors w-full"
                        >
                            Submit
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default InvoiceModal;