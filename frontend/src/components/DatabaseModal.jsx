// DatabaseModal.jsx
import React from 'react';

const DatabaseModal = ({ activeTab, clientType, vendorType, cifCnp, setCifCnp, handleClientTypeChange, handleVendorTypeChange, setIsModalOpen }) => {

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
                        <label htmlFor="phoneno" className="block text-sm font-medium text-gray-700 mt-1">Phone Number</label>
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
                            onChange={(e) => setCifCnp(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder={clientType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                        />
                    </>
                );
            case 'vendors':
                return (
                    <>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mt-1">Name</label>
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
                            onChange={(e) => setCifCnp(e.target.value)}
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
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mt-1">Price</label>
                        <input
                            type="text"
                            id="price"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter item price"
                        />
                        <label htmlFor="um" className="block text-sm font-medium text-gray-700 mt-1">Unit of Measure (U.M.)</label>
                        <input
                            type="text"
                            id="um"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter item U.M."
                        />
                    </>
                );
         
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
                {renderModalContent()}
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="px-1 py-2 bg-purple-500 text-white font-semibold text-md rounded-md hover:bg-purple-600 transition-colors w-60"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>

    );
};

export default DatabaseModal;
