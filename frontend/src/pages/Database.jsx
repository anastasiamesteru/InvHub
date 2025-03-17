import React, { useState, useEffect } from 'react';
import DatabaseModal from '../components/DatabaseModal';
import axios from 'axios';

const Database = () => {
    const [activeTab, setActiveTab] = useState('clients');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [clients, setClients] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [items, setItems] = useState([]);

    // Sorting state
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const openModal = () => setIsModalOpen(true);

    const handleButtonClick = (category) => setActiveTab(category);

    useEffect(() => {
        if (activeTab === 'clients') fetchClients();
        else if (activeTab === 'vendors') fetchVendors();
        else if (activeTab === 'items') fetchItems();
    }, [activeTab]);

    const fetchClients = async () => {
        try {
            const response = await fetch('http://localhost:4000/routes/clients/getall');
            if (!response.ok) throw new Error('Failed to fetch clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };

    const fetchVendors = async () => {
        try {
            const response = await fetch('http://localhost:4000/routes/vendors/getall');
            if (!response.ok) throw new Error('Failed to fetch vendors');
            const data = await response.json();
            setVendors(data);
        } catch (error) {
            console.error("Error fetching vendors:", error);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:4000/routes/items/getall');
            if (!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleDelete = async (id) => {

        let deleteEndpoint = "";

        if (activeTab === "clients") deleteEndpoint = `/routes/clients/${id}`;
        else if (activeTab === "vendors") deleteEndpoint = `/routes/vendors/${id}`;
        else if (activeTab === "items") deleteEndpoint = `/routes/items/${id}`;

        try {
            await axios.delete(`http://localhost:4000${deleteEndpoint}`);

            // Refresh the data
            if (activeTab === "clients") fetchClients();
            else if (activeTab === "vendors") fetchVendors();
            else if (activeTab === "items") fetchItems();
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };


    const filteredData = () => {
        const query = searchQuery.toLowerCase();
        let data = [];

        if (activeTab === "clients") data = clients;
        else if (activeTab === "vendors") data = vendors;
        else if (activeTab === "items") data = items;

        data = data.filter(item =>
            Object.values(item).some(value =>
                value?.toString().toLowerCase().includes(query)
            )
        );

        // Apply sorting
        if (sortColumn) {
            data.sort((a, b) => {
                let valueA = a[sortColumn] ?? '';
                let valueB = b[sortColumn] ?? '';

                if (typeof valueA === 'string') valueA = valueA.toLowerCase();
                if (typeof valueB === 'string') valueB = valueB.toLowerCase();

                if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const [currentPage, setCurrentPage] = useState(1);  // Default to 1, not 0

    const thingsPerPage = 2;
    console.log('Current Page:', currentPage);
    
    // Calculate the indexes for pagination
    const indexOfLast = currentPage * thingsPerPage;
    const indexOfFirst = indexOfLast - thingsPerPage;
    
    // Get the filtered data
    const filtereditems = filteredData();
    
    // Calculate the total pages after filtering
    const totalPages = Math.ceil(filtereditems.length / thingsPerPage);
    
    // Adjust current page if it exceeds total pages
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages); // Ensure we stay within valid page range
        }
    }, [filtereditems, currentPage, totalPages]);
    
    const current = filtereditems.slice(indexOfFirst, indexOfLast); // Slice the data based on pagination
    
    


    const renderTableContent = () => {
        const filteredItems = filteredData();
        switch (activeTab) {
            case 'clients':
                return (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                    {sortColumn === 'name' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('phone')}
                                >
                                    Phone No
                                    {sortColumn === 'phone' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('address')}
                                >
                                    Address
                                    {sortColumn === 'address' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('email')}
                                >
                                    Email
                                    {sortColumn === 'email' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('type')}
                                >
                                    Type
                                    {sortColumn === 'type' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('cifcnp')}
                                >
                                    CIF/CNP
                                    {sortColumn === 'cifcnp' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th className="px-3 py-2 text-center bg-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current.length > 0 ? (
                                current.map((client) => (
                                    <tr key={client._id}>
                                        <td className="px-3 py-2 text-center">{client.name}</td>
                                        <td className="px-3 py-2 text-center">{client.phone}</td>
                                        <td className="px-3 py-2 text-center break-words max-w-xs">{client.address}</td>
                                        <td className="px-3 py-2 text-center break-words max-w-xs">{client.email}</td>
                                        <td className="px-3 py-2 text-center">
                                            <span className={`inline-block px-2 py-1 font-semibold rounded ${client.type === 'individual' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {client.type}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-center">{client.cifcnp || "N/A"}</td>

                                        <td className="px-3 py-2 text-center flex justify-center gap-2">
                                            <button className="px-2 py-1 text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                    <path d="M16.98 3.02a2.87 2.87 0 1 1 4.06 4.06l-1.41 1.41-4.06-4.06 1.41-1.41zM3 17.25V21h3.75l11.29-11.29-3.75-3.75L3 17.25z" />
                                                </svg>
                                            </button>
                                            <button className="px-2 py-1 text-center" onClick={() => handleDelete(client._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-3 py-2 text-center">No clients found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                );
            case 'vendors':
                return (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                    {sortColumn === 'name' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('phone')}
                                >
                                    Phone No
                                    {sortColumn === 'phone' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('address')}
                                >
                                    Address
                                    {sortColumn === 'address' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('email')}
                                >
                                    Email
                                    {sortColumn === 'email' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('type')}
                                >
                                    Type
                                    {sortColumn === 'type' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('cifcnp')}
                                >
                                    CIF/CNP
                                    {sortColumn === 'cifcnp' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th className="px-3 py-2 text-center bg-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current.length > 0 ? (
                                current.map((vendor) => (
                                    <tr key={vendor._id}>
                                        <td className="px-3 py-2 text-center">{vendor.name}</td>
                                        <td className="px-3 py-2 text-center">{vendor.phone}</td>
                                        <td className="px-3 py-2 text-center break-words max-w-xs">{vendor.address}</td>
                                        <td className="px-3 py-2 text-center break-words max-w-xs">{vendor.email}</td>
                                        <td className="px-3 py-2 text-center">
                                            <span className={`inline-block px-2 py-1 font-semibold rounded ${vendor.type === 'individual' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {vendor.type}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-center">{vendor.cifcnp || "N/A"}</td>

                                        <td className="px-3 py-2 text-center flex justify-center gap-2">
                                            <button className="px-2 py-1 text-center" >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                    <path d="M16.98 3.02a2.87 2.87 0 1 1 4.06 4.06l-1.41 1.41-4.06-4.06 1.41-1.41zM3 17.25V21h3.75l11.29-11.29-3.75-3.75L3 17.25z" />
                                                </svg>
                                            </button>
                                            <button className="px-2 py-1 text-center" onClick={() => handleDelete(vendor._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>

                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-3 py-2 text-center">No vendors found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                );
            case 'items':
                return (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                    {sortColumn === 'name' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th className="px-3 py-2 text-center bg-gray-200">Description</th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('price')}
                                >
                                    Price
                                    {sortColumn === 'name' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('type')}
                                >
                                    Type
                                    {sortColumn === 'type' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th
                                    className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                    onClick={() => handleSort('um')}
                                >
                                    U.M.
                                    {sortColumn === 'um' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th className="px-3 py-2 text-center bg-gray-200">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {current.length > 0 ? (
                                current.map((item) => (
                                    <tr key={item._id}>
                                        <td className="px-3 py-2 text-center">{item.name}</td>
                                        <td className="px-3 py-2 text-center break-words max-w-xs">{item.description}</td>
                                        <td className="px-3 py-2 text-center">{item.price}</td>
                                        <td className="px-3 py-2 text-center">
                                            <span className={`inline-block px-2 py-1 font-semibold rounded ${item.type === 'product' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'}`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-center">{item.um || "N/A"}</td>
                                        <td className="px-3 py-2 text-center flex justify-center gap-2">
                                            <button className="px-2 py-1 text-center" onClick={() => handleGet(id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                    <path d="M16.98 3.02a2.87 2.87 0 1 1 4.06 4.06l-1.41 1.41-4.06-4.06 1.41-1.41zM3 17.25V21h3.75l11.29-11.29-3.75-3.75L3 17.25z" />
                                                </svg>
                                            </button>
                                            <button className="px-2 py-1 text-center" onClick={() => handleDelete(item._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-3 py-2 text-center">No items found</td>
                                </tr>
                            )}
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
                        setIsModalOpen={setIsModalOpen}
                        fetchClients={fetchClients}
                        fetchVendors={fetchVendors}
                        fetchItems={fetchItems}
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
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredData().length / thingsPerPage)))}
                        disabled={currentPage === Math.ceil(filteredData().length / thingsPerPage)}
                    >
                        Next
                    </button>
                    <button
                        className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                        onClick={() => setCurrentPage(Math.ceil(filteredData().length / thingsPerPage))}
                        disabled={currentPage === Math.ceil(filteredData().length / thingsPerPage)}
                    >
                        Last
                    </button>
                </div>



            </div>
        </div>
    );
};

export default Database;

