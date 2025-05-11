import { useState, useEffect } from "react";
import { validateClientForm } from '../utils/EntityModalValidation.js';

const EditClientModal = ({ show, onClose, clientId, onUpdate }) => {
  const [error, setError] = useState(null); // Error state
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: '',
    cifcnp: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clientId && show) {  // Ensure clientId is valid and modal is visible
      const fetchClientData = async () => {
        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        if (!token) {
          console.error("No token found");
          return;
        }

        try {
          const response = await fetch(`http://localhost:4000/routes/clients/${clientId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Include Bearer token in the request header
            },
          });

          if (!response.ok) throw new Error('Failed to fetch client data');
          const data = await response.json();
          setClientData(data);  // Set fetched client data
        } catch (error) {
          console.error("Error fetching clients:", error);
          setError(error.message);  // Display error if occurs
        }
      }

      fetchClientData();
    }
  }, [clientId, show]);  // Depend on clientId and show to refetch when the modal is opened

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken"); // Get token from localStorage
    if (!token) return alert("No token found.");
  
    setLoading(true); // Show loading state while waiting for the request
  
    try {
      // Make a PUT request to update the client
      const response = await fetch(`http://localhost:4000/routes/clients/${clientId}`, {
        method: 'PUT', // HTTP method is PUT to update
        headers: {
          'Authorization': `Bearer ${token}`, // Pass token as Authorization header
          'Content-Type': 'application/json', // Content-Type header to indicate JSON data
        },
        body: JSON.stringify(clientData), // Send the updated client data in the request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to update client');
      }
  
      const updatedClient = await response.json(); // Get the updated client data from the response
      onUpdate(updatedClient); // Call the onUpdate callback to update the client in the parent component
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error saving client data:", error.message);
      setError(error.message); // Display error message in the modal
    } finally {
      setLoading(false); // Stop loading state once the request is done
    }
  };
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Client</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {loading ? (
          <div className="">Loading...</div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-left text-sm font-medium text-gray-700 mt-2">Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={clientData.name}
                onChange={handleInputChange}
                placeholder="Enter client name"
              />

              <label className="block text-left text-sm font-medium text-gray-700 mt-2">Phone Number</label>
              <input
                type="number"
                name="phone"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={clientData.phone}
                onChange={handleInputChange}
                placeholder="Enter client phone number"
              />

              <label className="block text-left text-sm font-medium text-gray-700 mt-2">Address</label>
              <input
                type="text"
                name="address"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={clientData.address}
                onChange={handleInputChange}
                placeholder="Enter client address"
              />

              <label className="block text-left text-sm font-medium text-gray-700 mt-2">Email</label>
              <input
                type="text"
                name="email"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={clientData.email}
                onChange={handleInputChange}
                placeholder="Enter client email"
              />

              <label className="block text-left text-sm font-medium text-gray-700 mt-2">Type</label>
              <select
                value={clientData.type}
                onChange={handleInputChange}
                name="type"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              >
                <option value="company">Company</option>
                <option value="individual">Individual</option>
              </select>

              <label className="block text-left text-sm font-medium text-gray-700 mt-2">
                {clientData.type === 'company' ? 'CUI' : 'CNP'}
              </label>
              <input
                type="text"
                name="cifcnp"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={clientData.cifcnp}
                onChange={handleInputChange}
                placeholder={clientData.type === 'company' ? 'Enter CUI' : 'Enter CNP'}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4 justify-center">
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

export default EditClientModal;
