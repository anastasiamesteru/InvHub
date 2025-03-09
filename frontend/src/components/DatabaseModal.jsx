import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DatabaseModal = ({
    activeTab,
    setIsModalOpen,
}) => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        cifCnp: '',
        UM: '',
        price: '',
        quantity: '',
        description: '',
    });

    const [clientType, setClientType] = useState('company');
    const [vendorType, setVendorType] = useState('company');
    const [itemType, setItemType] = useState('company');

    const handleClientTypeChange = (event) => setClientType(event.target.value);
    const handleVendorTypeChange = (event) => setVendorType(event.target.value);
    const handleItemTypeChange = (event) => setItemType(event.target.value);

    const closeModal = () => setIsModalOpen(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};

        if (activeTab === "clients" || activeTab === "vendors") {
            if (!formData.name.trim()) newErrors.name = "Name is required.";
            if (!formData.address.trim()) newErrors.address = "Address is required.";
            if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone))
                newErrors.phone = "Valid phone number (10 digits) is required.";
            if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
                newErrors.email = "Valid email is required.";
            if (!formData.cifCnp.trim())
                newErrors.cifCnp = (activeTab === "clients" ? clientType : vendorType) === "company" ? "CIF is required." : "CNP is required.";
            else if ((activeTab === "clients" ? clientType : vendorType) === "company" && !/^\d{8,9}$/.test(formData.cifCnp))
                newErrors.cifCnp = "Valid CIF required (8-9 digits).";
            else if ((activeTab === "clients" ? clientType : vendorType) === "individual" && !/^\d{13}$/.test(formData.cifCnp))
                newErrors.cifCnp = "Valid CNP required (13 digits).";
        }

        if (activeTab === "items") {
            if (!formData.name.trim()) newErrors.name = "Item name is required.";
            if (!formData.UM.trim()) newErrors.UM = "Unit of measurement is required.";
            if (!formData.price.trim() || isNaN(formData.price) || parseFloat(formData.price) <= 0)
                newErrors.price = "Valid price (greater than 0) is required.";
            if (!formData.description.trim()) newErrors.description = "Description is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Ensure the form is valid
        if (!validateForm()) {
            alert('Form validation failed!');
            return;
        }
    
        // Dynamically set the endpoint based on the activeTab
        const endpoint = `http://localhost:4000/${activeTab}/create`;
    
        // Make sure clientType or vendorType is set correctly
        const payload = { 
            ...formData, 
            type: activeTab === "clients" ? clientType : vendorType 
        };
    
        console.log('Payload:', payload);  // Debugging: Check payload structure
    
        try {
            // Send data to the server via axios POST request
            const response = await axios.post(endpoint, payload);
            console.log('Response:', response);  // Debugging: Check server response
            alert(`${activeTab} entry added successfully!`);
            closeModal();
        } catch (error) {
            // Handle error properly and log more details
            console.error('Error posting data:', error);
            if (error.response) {
                // Server responded with an error
                console.error('Error response:', error.response);
                alert(`Failed to add entry. Error: ${error.response.data.message || 'Unknown error'}`);
            } else {
                // Network or other errors
                alert('Failed to add entry. Please check your network connection.');
            }
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
                                name="name"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter client name"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter client phone number"
                            />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter client address"
                            />
                            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Email</label>
                            <input
                                type="text"
                                name="email"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={formData.email}
                                onChange={handleChange}
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
                                value={formData.cifCnp}
                                onChange={handleChange}
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
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter vendor name"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter vendor phone number"
                            />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter vendor address"
                            />
                            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Email</label>
                            <input
                                type="text"
                                name="email"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={formData.email}
                                onChange={handleChange}
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
                                value={formData.cifCnp}
                                onChange={handleChange}
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
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter item name"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Description</label>
                            <textarea
                                name="description"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter item description"
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}

                            <label className="block text-sm font-medium text-gray-700 mt-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={formData.price}
                                onChange={handleChange}
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
                                value={formData.UM}
                                onChange={handleChange}
                                placeholder="Enter unit of measurement"
                            />
                            {errors.UM && <p className="text-red-500 text-xs">{errors.UM}</p>}

                      

                           
                        </>
                    )}

                    <button
                        type="submit" onClick={handleSubmit}
                        className="w-full py-2 px-4 mt-4 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DatabaseModal;
