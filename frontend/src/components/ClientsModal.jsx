import { useState, useEffect } from "react";

const ClientsModal = ({ show, onClose, onClientSelect }) => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 8;

  useEffect(() => {
    if (show) {
      const fetchClients = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return console.error("No token found");

        try {
          const response = await fetch('http://localhost:4000/routes/clients/getall', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch clients');
          }

          const data = await response.json();
          setClients(data);
        } catch (error) {
          console.error("Error fetching clients:", error.message);
        }
      };

      fetchClients();
    }
  }, [show]);

  const filteredClients = () => {
    const query = searchQuery.toLowerCase();
    const sortedFiltered = clients
      .filter(client =>
        Object.values(client).some(val =>
          val?.toString().toLowerCase().includes(query)
        )
      )
      .sort((a, b) => {
        if (!sortColumn) return 0;
        const valA = a[sortColumn] || '';
        const valB = b[sortColumn] || '';
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });

    const startIndex = (currentPage - 1) * clientsPerPage;
    return sortedFiltered.slice(startIndex, startIndex + clientsPerPage);
  };

  const totalPages = Math.ceil(
    clients.filter(client =>
      Object.values(client).some(val =>
        val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    ).length / clientsPerPage
  );

  const toggleClientSelection = (client) => {
    setSelectedClient((prev) =>
      prev && prev._id === client._id ? null : client
    );
  };

  const handleConfirmSelection = () => {
    if (selectedClient) {
      onClientSelect(selectedClient);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-5xl h-[600px] rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select a Client</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="flex items-center bg-gray-100 p-2 rounded-md mb-4">
          <input
            type="text"
            placeholder="🔎︎ Search for a client..."
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to page 1 on new search
            }}
          />
        </div>

        <div className="max-h-72 overflow-y-auto border rounded-md">
          <table className="w-full text-sm table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-center">
                {['name', 'phone', 'address', 'email', 'type', 'cifcnp'].map((key) => (
                  <th
                    key={key}
                    className="px-3 py-2 cursor-pointer"
                    onClick={() => {
                      if (sortColumn === key) {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortColumn(key);
                        setSortOrder('asc');
                      }
                    }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortColumn === key ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                ))}
                <th className="px-3 py-2">Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients().map((client) => (
                <tr key={client._id} className="text-center border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{client.name}</td>
                  <td className="px-3 py-2">{client.phone}</td>
                  <td className="px-3 py-2">{client.address}</td>
                  <td className="px-3 py-2">{client.email}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 text-xs rounded font-medium ${client.type === 'individual' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                      {client.type}
                    </span>
                  </td>
                  <td className="px-3 py-2">{client.cifcnp || 'N/A'}</td>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedClient?._id === client._id}
                      onChange={() => toggleClientSelection(client)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
              {filteredClients().length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">No clients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 mt-4 justify-center">
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedClient}
            className={`px-4 py-2 rounded text-white ${
              selectedClient ? 'mt-4 px-4 py-2 font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-600' : 'mt-4 px-4 py-2 font-semibold bg-gray-400 cursor-not-allowed'
            }`}
          >
            Select Client
          </button>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? 'px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700'
                    : 'px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsModal;
