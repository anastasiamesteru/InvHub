import React, { useState } from 'react';
import DatabaseModal from '../components/DatabaseModal';
import axios from 'axios'


const Database = () => {
    const [activeTab, setActiveTab] = useState('clients');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const openModal = () => {
        setIsModalOpen(true);
    };
    const [currentPage, setCurrentPage] = useState(1);
    const elementsPerPage = 8;

    const indexOfLastElement = currentPage * elementsPerPage;
    const indexOfFirstElement = indexOfLastElement - elementsPerPage;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const clients = [
        { id: 1, name: 'John Doe', phone: '555-1234', address: '123 Main St', email: 'john@example.com', cifCnp: '123456789' },
        { id: 2, name: 'Jane Smith', phone: '555-5678', address: '456 Oak St', email: 'jane@example.com', cifCnp: '987654321' },
        { id: 3, name: 'Michael Johnson', phone: '555-9876', address: '789 Pine St', email: 'michael@example.com', cifCnp: '654321987' },
    ];

    const vendors = [
        { id: 1, name: 'ABC Corp', phone: '555-1122', address: '123 Market St', email: 'contact@abccorp.com', cifCnp: '111223344' },
        { id: 2, name: 'XYZ Ltd', phone: '555-3344', address: '456 Broadway St', email: 'contact@xyz.com', cifCnp: '223344556' },
        { id: 3, name: 'Tech Solutions', phone: '555-5566', address: '789 Technology Ave', email: 'tech@solutions.com', cifCnp: '334455667' },
    ];

    const items = [
        { id: 1, name: 'Product 1', description: 'High-quality product', price: '$10', unit: 'pcs' },
        { id: 2, name: 'Product 2', description: 'Affordable product', price: '$20', unit: 'kg' },
        { id: 3, name: 'Product 3', description: 'Premium product', price: '$30', unit: 'liters' },
    ];

    const handleButtonClick = (category) => {
        setActiveTab(category);
    };

    const handleDelete = async (id) => {
        let deleteEndpoint = "";
      
        if (activeTab === "clients") {
          deleteEndpoint = `/client/delete/${id}`;
        } else if (activeTab === "vendors") {
          deleteEndpoint = `/vendor/delete/${id}`;
        } else if (activeTab === "products") {
          deleteEndpoint = `/item/delete/${id}`;
        }
      
        try {
          await axios.delete(`http://localhost:4000${deleteEndpoint}`);
          alert(`${activeTab} entry deleted successfully!`);
        } catch (error) {
          console.error("Error deleting:", error);
        }
      };

      const handleGet = async (id) => {
        let handleEndpoint = "";
    
        if (activeTab === "clients") {
            handleEndpoint = `/clients/get/${id}`;
        } else if (activeTab === "vendors") {
            handleEndpoint = `/vendors/get/${id}`;
        } else if (activeTab === "items") {
            handleEndpoint = `/item/get/${id}`;
        }
    
        try {
            const response = await axios.get(`http://localhost:4000${handleEndpoint}`);
            alert(`Fetched details for ${activeTab}: ${JSON.stringify(response.data)}`);
        } catch (error) {
            console.error("Error fetching:", error);
        }
    };



    const filteredData = () => {
        const query = searchQuery.toLowerCase();
        if (activeTab === 'clients') {
            return clients.filter((client) =>
                client.name.toLowerCase().includes(query) ||
                client.email.toLowerCase().includes(query) ||
                client.address.toLowerCase().includes(query) ||
                client.phone.toLowerCase().includes(query) ||
                client.cifCnp.toLowerCase().includes(query)
            );
        } else if (activeTab === 'vendors') {
            return vendors.filter((vendor) =>
                vendor.name.toLowerCase().includes(query) ||
                vendor.email.toLowerCase().includes(query) ||
                vendor.address.toLowerCase().includes(query) ||
                vendor.phone.toLowerCase().includes(query) ||
                vendor.cifCnp.toLowerCase().includes(query)
            );
        } else if (activeTab === 'items') {
            return items.filter((item) =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.price.toLowerCase().includes(query) ||
                item.unit.toLowerCase().includes(query)
            );
        }
        return [];
    }


    const renderTableContent = () => {
        const filteredItems = filteredData();
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
                                <th className="px-3 py-2 text-center bg-gray-200">Type</th>
                                <th className="px-3 py-2 text-center bg-gray-200">CIF/CNP</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((client) => (
                                <tr key={client.id}>
                                    <td className="px-3 py-2 text-center">{client.id}</td>
                                    <td className="px-3 py-2 text-center">{client.name}</td>
                                    <td className="px-3 py-2 text-center">{client.phone}</td>
                                    <td className="px-3 py-2 text-center">{client.address}</td>
                                    <td className="px-3 py-2 text-center">{client.email}</td>
                                    <td className="px-3 py-2 text-center">{client.type}</td>
                                    <td className="px-3 py-2 text-center">{client.cifCnp}</td>
                                    <td className="px-3 py-2 text-center flex justify-center gap-2">
                                        <button className="px-2 py-1 text-center" >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M16.98 3.02a2.87 2.87 0 1 1 4.06 4.06l-1.41 1.41-4.06-4.06 1.41-1.41zM3 17.25V21h3.75l11.29-11.29-3.75-3.75L3 17.25z" />
                                            </svg>
                                        </button>
                                        <button className="px-2 py-1 text-center" onClick={() => handleDelete()}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
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
                                <th className="px-3 py-2 text-center bg-gray-200">Type</th>
                                <th className="px-3 py-2 text-center bg-gray-200">CIF/CNP</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Actions
                                    
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((vendor) => (
                                <tr key={vendor.id}>
                                    <td className="px-3 py-2 text-center">{vendor.id}</td>
                                    <td className="px-3 py-2 text-center">{vendor.name}</td>
                                    <td className="px-3 py-2 text-center">{vendor.phone}</td>
                                    <td className="px-3 py-2 text-center">{vendor.address}</td>
                                    <td className="px-3 py-2 text-center">{vendor.email}</td>
                                    <td className="px-3 py-2 text-center">{vendor.type}</td>
                                    <td className="px-3 py-2 text-center">{vendor.cifCnp}</td>
                                    <td className="px-3 py-2 text-center flex justify-center gap-2">
                                        <button className="px-2 py-1 text-center" >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M16.98 3.02a2.87 2.87 0 1 1 4.06 4.06l-1.41 1.41-4.06-4.06 1.41-1.41zM3 17.25V21h3.75l11.29-11.29-3.75-3.75L3 17.25z" />
                                            </svg>
                                        </button>
                                        <button className="px-2 py-1 text-center" onClick={() => deleteInvoice(invoice.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
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
                                <th className="px-3 py-2 text-center bg-gray-200">Type</th>
                                <th className="px-3 py-2 text-center bg-gray-200">U.M.</th>
                                <th className="px-3 py-2 text-center bg-gray-200">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-3 py-2 text-center">{item.id}</td>
                                    <td className="px-3 py-2 text-center">{item.name}</td>
                                    <td className="px-3 py-2 text-center">{item.description}</td>
                                    <td className="px-3 py-2 text-center">{item.price}</td>
                                    <td className="px-3 py-2 text-center">{item.type}</td>
                                    <td className="px-3 py-2 text-center">{item.unit}</td>
                                      <td className="px-3 py-2 text-center flex justify-center gap-2">
                                        <button className="px-2 py-1 text-center" onClick={() => handleGet(id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M16.98 3.02a2.87 2.87 0 1 1 4.06 4.06l-1.41 1.41-4.06-4.06 1.41-1.41zM3 17.25V21h3.75l11.29-11.29-3.75-3.75L3 17.25z" />
                                            </svg>
                                        </button>
                                        <button className="px-2 py-1 text-center" onClick={() => handleDelete(id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                
                            ))}
                        </tbody>
                    </table>
                );
            default:
                return <p className="text-center">Select a category to display data.</p>;
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
                <div className="flex items-center bg-gray-100 p-2 rounded-md mt-2 mb-2">
                    <input
                        type="text"
                        id="search-box"
                        placeholder="🔎︎ Search across clients, vendors and items..."
                        className="flex-1 p-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {/* Render Table Content */}

                {renderTableContent()}

                 <div className="flex mt-4">
                <button
                    onClick={openModal}
                    className="px-4 py-2 bg-purple-500 text-white font-semibold text-sm rounded-full hover:bg-purple-600 transition-colors"
                >
                    + Add
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <DatabaseModal
                    activeTab={activeTab}
                    setIsModalOpen={setIsModalOpen} // Pass the setIsModalOpen function
                />
            )}
        </div>


        <div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <button
                    className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                >
                    First
                </button>
                <button
                    className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="px-4 py-2 mx-2 text-sm text-gray-600">{currentPage}</span>
                <button
                    className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredData().length / elementsPerPage)))}
                    disabled={currentPage === Math.ceil(filteredData().length / elementsPerPage)}
                >
                    Next
                </button>
                <button
                    className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                    onClick={() => setCurrentPage(Math.ceil(filteredData().length / elementsPerPage))}
                    disabled={currentPage === Math.ceil(filteredData().length / elementsPerPage)}
                >
                    Last
                </button>
            </div>
        </div>
        </div>
    );
};

export default Database;
