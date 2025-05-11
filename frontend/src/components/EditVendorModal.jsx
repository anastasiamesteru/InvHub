import { useState, useEffect } from "react";

const EditVendorModal = ({ show, onClose, vendorId, onUpdate }) => {
  const [error, setError] = useState(null);
  const [vendorData, setVendorData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: '',
    cifcnp: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vendorId && show) {
      const fetchVendorData = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
          const response = await fetch(`http://localhost:4000/routes/vendors/${vendorId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error('Failed to fetch vendor data');
          const data = await response.json();
          setVendorData(data);
        } catch (error) {
          console.error("Error fetching vendor:", error);
          setError(error.message);
        }
      };

      fetchVendorData();
    }
  }, [vendorId, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return alert("No token found.");

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/routes/vendors/${vendorId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      });

      if (!response.ok) throw new Error('Failed to update vendor');

      const updatedVendor = await response.json();
      onUpdate(updatedVendor);
      onClose();
    } catch (error) {
      console.error("Error saving vendor data:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Vendor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-left text-sm font-medium text-gray-700 mt-2">Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={vendorData.name}
                onChange={handleInputChange}
                placeholder="Enter vendor name"
              />

              <label className="block text-left text-sm font-medium text-gray-700 mt-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={vendorData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />

              <label className="block text-left text-sm font-medium text-gray-700 mt-2">Address</label>
              <input
                type="text"
                name="address"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={vendorData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
              />

              <label className="block text-left text-sm font-medium text-gray-700 mt-2">Email</label>
              <input
                type="text"
                name="email"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={vendorData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />

              <label className="block text-left text-sm font-medium text-gray-700 mt-2">Type</label>
              <select
                value={vendorData.type}
                onChange={handleInputChange}
                name="type"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              >
                <option value="company">Company</option>
                <option value="individual">Individual</option>
              </select>

              <label className="block text-left text-sm font-medium text-gray-700 mt-2">
                {vendorData.type === 'company' ? 'CUI' : 'CNP'}
              </label>
              <input
                type="text"
                name="cifcnp"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={vendorData.cifcnp}
                onChange={handleInputChange}
                placeholder={vendorData.type === 'company' ? 'Enter CUI' : 'Enter CNP'}
              />
            </div>

            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditVendorModal;
