import { useState, useEffect } from "react";

const ItemsModal = ({ show, onClose, onItemSelect }) => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (show) {
      const fetchItems = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return console.error("No token found");

        try {
          const response = await fetch('http://localhost:4000/routes/items/getall', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch items');
          }

          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error("Error fetching items:", error.message);
        }
      };

      fetchItems();
    }
  }, [show]);

  const toggleItemSelection = (item) => {
    setSelectedItems((prev) => {
      const alreadySelected = prev.find((i) => i._id === item._id);
      if (alreadySelected) {
        return prev.filter((i) => i._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const filteredItems = () => {
    const query = searchQuery.toLowerCase();
    const sortedFiltered = items
      .filter(item =>
        Object.values(item).some(val =>
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

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedFiltered.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(
    items.filter(item =>
      Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    ).length / itemsPerPage
  );

  const handleConfirmSelection = () => {
    if (selectedItems.length > 0) {
      onItemSelect(selectedItems);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-5xl h-[600px] rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Items</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="flex items-center bg-gray-100 p-2 rounded-md mb-4">
          <input
            type="text"
            placeholder="🔎︎ Search for items..."
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="max-h-72 overflow-y-auto border rounded-md">
        <table className="w-full text-sm table-auto border-collapse">
        <thead>
  <tr className="bg-gray-200 text-center">
    {['name', 'type', 'price', 'um'].map((key) => (
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
        {key === 'um' ? 'U.M.' : key.charAt(0).toUpperCase() + key.slice(1)}
        {sortColumn === key ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
      </th>
    ))}
    <th className="px-3 py-2">Select</th>
  </tr>
</thead>

  <tbody>
    {filteredItems().map((item) => (
      <tr key={item._id} className="text-center border-t hover:bg-gray-50">
        <td className="px-3 py-2">{item.name}</td>
        <td className="px-3 py-2">
          <span className={`px-2 py-1 text-xs rounded font-medium ${item.type === 'product' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'}`}>
     
            {item.type}
          </span>
        </td>
        <td className="px-3 py-2">{item.price}</td>
        <td className="px-3 py-2">{item.um}</td> {/* Now properly aligned */}
        <td className="px-3 py-2">
          <input
            type="checkbox"
            checked={!!selectedItems.find((i) => i._id === item._id)}
            onChange={() => toggleItemSelection(item)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </td>
      </tr>
    ))}
    {filteredItems().length === 0 && (
      <tr>
        <td colSpan="6" className="text-center py-4 text-gray-500">No items found.</td>
      </tr>
    )}
  </tbody>
</table>

        </div>

        <div className="flex justify-end gap-3 mt-4 justify-center">
          <button
            type="button"
            onClick={handleConfirmSelection}
            disabled={selectedItems.length === 0}
            className={`px-4 py-2 font-semibold rounded-md text-white ${
              selectedItems.length > 0 ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Add Selected Items
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
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-300 text-white hover:bg-purple-500'
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

export default ItemsModal;
