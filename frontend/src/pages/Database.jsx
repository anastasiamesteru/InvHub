import React, { useState } from 'react';

const Database = () => {
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

    const [activeTab, setActiveTab] = useState('clients');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock data for Clients, Vendors, and Products
    const clients = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Michael Johnson', email: 'michael@example.com' },
    ];

    const vendors = [
        { id: 1, name: 'ABC Corp', contact: 'contact@abccorp.com' },
        { id: 2, name: 'XYZ Ltd', contact: 'contact@xyz.com' },
        { id: 3, name: 'Tech Solutions', contact: 'tech@solutions.com' },
    ];

    const items = [
        { id: 1, name: 'Product 1', price: '$10' },
        { id: 2, name: 'Product 2', price: '$20' },
        { id: 3, name: 'Product 3', price: '$30' },
    ];

    const handleButtonClick = (category) => {
        setActiveTab(category);
    };

    const renderTableContent = () => {
        switch (activeTab) {
            case 'clients':
                return (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="px-3 py-2 text-center bg-gray-200">ID</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Name</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Phone No</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Address</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Email</th>
                                <th className="px-3 py-2 text-center bg-gray-200">CIF/CNP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id}>
                                    <td className="px-3 py-2 text-center">{client.id}</td>
                                    <td className="px-3 py-2 text-center">{client.name}</td>
                                    <td className="px-3 py-2 text-center">{client.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'vendors':
                return (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="px-3 py-2 text-center bg-gray-200">ID</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Name</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Phone No</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Address</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Email</th>
                                <th className="px-3 py-2 text-center bg-gray-200">CIF/CNP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map(vendor => (
                                <tr key={vendor.id}>
                                    <td className="px-3 py-2 text-center">{vendor.id}</td>
                                    <td className="px-3 py-2 text-center">{vendor.name}</td>
                                    <td className="px-3 py-2 text-center">{vendor.contact}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'items':
                return (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="px-3 py-2 text-center bg-gray-200">ID</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Name</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Description</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Price</th>
                                <th className="px-3 py-2 text-center bg-gray-200">U.M.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td className="px-3 py-2 text-center">{item.id}</td>
                                    <td className="px-3 py-2 text-center">{item.name}</td>
                                    <td className="px-3 py-2 text-center">{item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            default:
                return <p className="text-center">Select a category to display data.</p>;
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const renderModalContent = () => {
        switch (activeTab) {
            case 'clients':
                return (
                    <>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mt-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter client name"
                        />
                        <label htmlFor="phoneno" className="block text-sm font-medium text-gray-700 mt-1" >Phone Number</label>
                        <input
                            type="text"
                            id="phoneno"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter client phone number"
                        />
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mt-1">Address</label>
                        <input
                            type="text"
                            id="address"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter client address"
                        />
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-1">Email</label>
                        <input
                            type="text"
                            id="email"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter client email"
                        />
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
                            onChange={handleClientCifCnpChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder={clientType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                        />
                    </>
                );
            case 'vendors':
                return (
                    <>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mt-1"> Name</label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter vendor name"
                        />
                        <label htmlFor="phoneno" className="block text-sm font-medium text-gray-700 mt-1">Phone Number</label>
                        <input
                            type="text"
                            id="phoneno"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter vendor phone number"
                        />
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mt-1">Address</label>
                        <input
                            type="text"
                            id="address"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter vendor address"
                        />
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-1">Email</label>
                        <input
                            type="text"
                            id="email"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter vendor email"
                        />
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
                            onChange={handleVendorCifCnpChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder={vendorType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                        />

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
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mt-1">Description</label>
                        <input
                            type="text"
                            id="description"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter item description"
                        />
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mt-1">Type</label>
                        <select
                            id="type"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        >
                            <option value="product">Product</option>
                            <option value="service">Service</option>
                        </select>

                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mt-1">Price</label>
                        <input
                            type="text"
                            id="price"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter item price"
                        />
                        <label htmlFor="um" className="block text-sm font-medium text-gray-700 mt-1">U.M.</label>
                        <input
                            type="text"
                            id="um"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter item u.m."
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 h-screen">
            <div className="flex flex-col">
                <div className="flex items-center justify-between border-b-2 border-purple-500">
                    <p className="text-gray-700 text-m flex-1 py-4">
                        Manage your database, add, organize and track clients, vendors, and items with precision.
                    </p>
                    <div className="flex gap-2 items-center">
                        <button
                            className={`px-4 py-2 bg-purple-500 border-2 text-white font-semibold text-sm rounded-lg hover:border-purple-600 hover:bg-purple-600 transition-colors ${activeTab === 'clients' ? 'bg-gray-700 border-purple-500' : 'border-purple-500 hover:border-purple-600'}`}
                            onClick={() => handleButtonClick('clients')}
                        >
                            Clients
                        </button>
                        <button
                            className={`px-4 py-2 bg-purple-500 border-2 text-white font-semibold text-sm rounded-lg hover:border-purple-600 hover:bg-purple-600 transition-colors ${activeTab === 'vendors' ? 'bg-gray-700 border-purple-500' : 'border-purple-500 hover:border-purple-600'}`}
                            onClick={() => handleButtonClick('vendors')}
                        >
                            Vendors
                        </button>
                        <button
                            className={`px-4 py-2 bg-purple-500 border-2 text-white font-semibold text-sm rounded-lg hover:border-purple-600 hover:bg-purple-600 transition-colors ${activeTab === 'items' ? 'bg-gray-700 border-purple-500' : 'border-purple-500 hover:border-purple-600'}`}
                            onClick={() => handleButtonClick('items')}
                        >
                            Items
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                {renderTableContent()}
            </div>

            {/* Add New Button */}
            <div className="flex mt-4">
                <button
                    onClick={openModal}
                    className="px-4 py-2 bg-purple-500 text-white font-semibold text-sm rounded-full hover:bg-purple-600 transition-colors"
                >
                    + Add
                </button>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">
                                {(() => {
                                    switch (activeTab) {
                                        case 'clients':
                                            return 'Add a new client';
                                        case 'vendors':
                                            return 'Add a new vendor';
                                        case 'items':
                                            return 'Add a new item';

                                    }
                                })()}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={closeModal}
                            >
                                ✕
                            </button>
                        </div>
                        <form className="mt-4">
                            {renderModalContent()}
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
            )}
        </div>
    );
};

export default Database;
