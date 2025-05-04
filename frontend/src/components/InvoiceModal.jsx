import React, { useState, useEffect } from "react"
import { InvoiceModalValidation } from "../utils/InvoiceModalValidation.js";
import axios from 'axios';
import ClientsModal from "./ClientsModal.jsx";
import VendorsModal from "./VendorsModal.jsx";
import ItemsModal from "./ItemsModal.jsx";

const InvoiceModal = ({ isOpen, onClose, fetchInvoices }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [showClientsModal, setShowClientsModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const [showVendorsModal, setShowVendorsModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);

    const [showItemsModal, setShowItemsModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // or an array if multiple items

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: '',
        clientName: '', clientAddress: '', clientPhoneNo: '', clientEmail: '', clientType: 'company', clientCifcnp: '',
        vendorName: '', vendorAddress: '', vendorPhoneNo: '', vendorEmail: '', vendorType: 'company', vendorCifcnp: '',
        issue_date: '', due_date: '', tax: 0, total: 0,
        items: [{ itemName: '', quantity: 1, unitPrice: 0, um: '' }],
    });


    const calculateTotalWithoutTax = () => {
        return invoiceData.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
    };

    const calculateTotal = () => {
        const totalItemsCost = calculateTotalWithoutTax();
        const validTax = !isNaN(invoiceData.tax) && invoiceData.tax >= 0 ? invoiceData.tax : 0;
        const taxAmount = (totalItemsCost * validTax) / 100;
        return totalItemsCost + taxAmount;
    };

    const addItem = () => {
        setInvoiceData((prevData) => ({
            ...prevData,
            items: [
                ...prevData.items,
                { itemName: '', quantity: 1, unitPrice: 0, um: '' },
            ],
        }));
    };

    const removeItem = (index) => {
        setInvoiceData((prevData) => ({
            ...prevData,
            items: prevData.items.filter((_, i) => i !== index),
        }));
    };

    const handleItemChange = (e, field, index) => {
        const { value } = e.target;
        setInvoiceData((prevData) => {
            const updatedItems = prevData.items.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value,
                    }
                    : item
            );
            return { ...prevData, items: updatedItems };
        });
    };

    useEffect(() => {
        if (isOpen) {
            // Generate invoice number
            const generatedInvoiceNumber = `INV-${Math.floor(Math.random() * 9000) + 1000}`;

            const totalItemsCost = invoiceData.items.reduce(
                (total, item) => total + (item.unitPrice * item.quantity), 0
            );
            const validTax = !isNaN(invoiceData.tax) && invoiceData.tax >= 0 ? invoiceData.tax : 0;
            const taxAmount = (totalItemsCost * validTax) / 100;

            setInvoiceData(prevData => ({
                ...prevData,
                invoiceNumber: generatedInvoiceNumber,
                total: totalItemsCost + taxAmount,
            }));
        }
    }, [isOpen, invoiceData.items, invoiceData.tax])

    const handleChange = (e, field) => {
        const { value } = e.target;
        setInvoiceData(prevData => ({
            ...prevData,
            [field]: field === "tax" ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = InvoiceModalValidation(invoiceData);

        // Check if there are any errors
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);  // Set errors in state
            return;
        }


        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No token found");
            alert("Authentication token missing. Please log in again.");
            return;
        }

        // Create the payload
        const payload = {
            invoiceNumber: invoiceData.invoiceNumber,
            clientName: invoiceData.clientName,
            clientEmail: invoiceData.clientEmail,
            clientType: invoiceData.clientType,
            clientPhoneNo: invoiceData.clientPhoneNo,
            clientAddress: invoiceData.clientAddress,
            clientCifcnp: invoiceData.clientCifcnp,
            vendorName: invoiceData.vendorName,
            vendorEmail: invoiceData.vendorEmail,
            vendorType: invoiceData.vendorType,
            vendorPhoneNo: invoiceData.vendorPhoneNo,
            vendorAddress: invoiceData.vendorAddress,
            vendorCifcnp: invoiceData.vendorCifcnp,
            issue_date: invoiceData.issue_date,
            due_date: invoiceData.due_date,
            items: invoiceData.items,
            tax: invoiceData.tax,
            total: invoiceData.total,
        };

        try {
            const response = await axios.post('http://localhost:4000/routes/invoices/create', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Invoice response:', response);
            await fetchInvoices();
            onClose();
        } catch (error) {
            console.error('Error posting item data:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                alert(`Error: ${error.response?.data?.message || error.message}`);
            } else {
                alert(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'Invalid Date';
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return 'Invalid Date';

        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year = parsedDate.getFullYear();

        return `${day}/${month}/${year}`;
    };
    //console.log("Invoice data: ", invoiceData);

    const onClientSelect = (selectedClient) => {
        setInvoiceData((prevData) => ({
            ...prevData,
            clientName: selectedClient.name,
            clientAddress: selectedClient.address,
            clientPhoneNo: selectedClient.phone,
            clientEmail: selectedClient.email,
            clientType: selectedClient.type, // 'company' or 'individual'
            clientCifcnp: selectedClient.cifcnp,
        }));

        setShowClientsModal(false); // Close modal after selection
    };

    const onVendorSelect = (selectedVendor) => {
        setInvoiceData((prevData) => ({
            ...prevData,
            vendorName: selectedVendor.name,
            vendorAddress: selectedVendor.address,
            vendorPhoneNo: selectedVendor.phone,
            vendorEmail: selectedVendor.email,
            vendorType: selectedVendor.type, // 'company' or 'individual'
            vendorCifcnp: selectedVendor.cifcnp,
        }));

        setShowVendorsModal(false); // Close modal after selection
    };

    const onItemSelect = (selectedItems) => {
        const itemsArray = Array.isArray(selectedItems) ? selectedItems : [selectedItems];

        setInvoiceData((prevData) => ({
            ...prevData,
            items: [
                ...prevData.items,
                ...itemsArray.map(item => ({
                    itemName: item.name,
                    quantity: 1,
                    unitPrice: item.price,
                    um: item.um,
                }))
            ]
        }));

        setShowItemsModal(false);
    };


    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Create a new invoice</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col border-b-2 border-gray-400 pt-4 pb-4">
                        <div className="flex justify-between">
                            <div className="w-1/2 pr-2 flex flex-col items-center">
                                <label htmlFor="issue_date" className="block text-sm font-small text-gray-700">Issue date</label>
                                <input
                                    id="issue_date"
                                    type="date"
                                    value={invoiceData.issue_date}
                                    onChange={(e) => handleChange(e, 'issue_date')}
                                    className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                                />

                            </div>

                            <div className="w-1/2 pl-2 flex flex-col items-center">
                                <label htmlFor="dueDate" className="block text-sm font-small text-gray-700">Due date</label>
                                <input
                                    id="due_date"
                                    type="date"
                                    value={invoiceData.due_date}
                                    onChange={(e) => handleChange(e, 'due_date')}
                                    className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        {errors.due_date && (
                            <p className="text-red-500 text-xs text-center mt-2">{errors.due_date}</p>
                        )}
                    </div>



                    <div className="flex justify-between border-b-2 border-gray-400 pt-4 pb-4">
                        {/* Client Info*/}
                        <div className="w-1/2 pr-5 border-r-2 border-gray-300">
                            <h3 className="text-lg font-semibold text-center">Client Information</h3>
                            <div className="my-2">
                                <label htmlFor="clientName" className="block text-sm font-small text-gray-700">Name:</label>
                                <input
                                    id="clientName"
                                    type="text"
                                    placeholder="Client Name"
                                    value={invoiceData.clientName}
                                    onChange={(e) => handleChange(e, 'clientName')}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.clientName && <p className="text-red-500 text-xs">{errors.clientName}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="clientAddress" className="block text-sm font-small text-gray-700">Address:</label>
                                <input
                                    id="clientAddress"
                                    type="text"
                                    placeholder="Client Address"
                                    value={invoiceData.clientAddress}
                                    onChange={(e) => handleChange(e, 'clientAddress')}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.clientAddress && <p className="text-red-500 text-xs">{errors.clientAddress}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="clientPhoneNo" className="block text-sm font-small text-gray-700">Phone number:</label>
                                <input
                                    id="clientPhoneNo"
                                    type="number"
                                    placeholder="Client phone number"
                                    value={invoiceData.clientPhoneNo}
                                    onChange={(e) => handleChange(e, 'clientPhoneNo')}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.clientPhoneNo && <p className="text-red-500 text-xs">{errors.clientPhoneNo}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="clientEmail" className="block text-sm font-small text-gray-700">Email:</label>
                                <input
                                    id="clientEmail"
                                    type="email"
                                    placeholder="client@example.com"
                                    value={invoiceData.clientEmail}
                                    onChange={(e) => handleChange(e, 'clientEmail')}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.clientEmail && <p className="text-red-500 text-xs">{errors.clientEmail}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="type" className="block text-sm font-small text-gray-700 mt-1">Type</label>
                                <select
                                    id="clientType"
                                    value={invoiceData.clientType}
                                    onChange={(e) => handleChange(e, 'clientType')}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                >
                                    <option value="company">Company</option>
                                    <option value="individual">Individual</option>
                                </select>
                            </div>
                            <div className="my-2">
                                <label htmlFor="client-cif-cnp" className="block text-sm font-small text-gray-700 mt-1">
                                    {invoiceData.clientType === 'company' ? 'CIF' : 'CNP'}
                                </label>
                                <input
                                    type="text"
                                    id="client-cif-cnp"
                                    value={invoiceData.clientCifcnp}
                                    onChange={(e) => handleChange(e, 'clientCifcnp')}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    placeholder={invoiceData.clientType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                                />
                                {errors.clientCifcnp && <p className="text-red-500 text-xs">{errors.clientCifcnp}</p>}

                            </div>
                            <div className="my-2 flex justify-center">
                                <button className="mt-4 px-4 py-2 font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400" onClick={() => setShowClientsModal(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                    </svg>


                                </button>
                                <ClientsModal
                                    show={showClientsModal}
                                    onClientSelect={onClientSelect}
                                    onClose={() => setShowClientsModal(false)}
                                />
                            </div>


                        </div>

                        {/* Vendor Info*/}
                        <div className="w-1/2 pr-5 border-gray-300 pl-4">
                            <h3 className="text-lg font-semibold text-center">Vendor Information</h3>
                            <div className="my-2">
                                <label htmlFor="vendorName" className="block text-sm font-small text-gray-700">Name:</label>
                                <input
                                    id="vendorName"
                                    type="text"
                                    placeholder="Vendor Name"
                                    value={invoiceData.vendorName}
                                    onChange={(e) => handleChange(e, 'vendorName')}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.vendorName && <p className="text-red-500 text-xs">{errors.vendorName}</p>}

                            </div>

                            <div className="my-2">
                                <label htmlFor="vendorAddress" className="block text-sm font-small text-gray-700">Address:</label>
                                <input
                                    id="vendorAddress"
                                    type="text"
                                    placeholder="Vendor Address"
                                    value={invoiceData.vendorAddress}
                                    onChange={(e) => handleChange(e, 'vendorAddress')}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.vendorAddress && <p className="text-red-500 text-xs">{errors.vendorAddress}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="vendorPhoneNo" className="block text-sm font-small text-gray-700">Phone number:</label>
                                <input
                                    id="vendorPhoneNo"
                                    type="number"
                                    placeholder="Vendor phone number"
                                    value={invoiceData.vendorPhoneNo}
                                    onChange={(e) => handleChange(e, 'vendorPhoneNo')}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.vendorPhoneNo && <p className="text-red-500 text-xs">{errors.vendorPhoneNo}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="vendorEmail" className="block text-sm font-small text-gray-700">Email:</label>
                                <input
                                    id="vendorEmail"
                                    type="email"
                                    placeholder="vendor@example.com"
                                    value={invoiceData.vendorEmail}
                                    onChange={(e) => handleChange(e, 'vendorEmail')}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.vendorEmail && <p className="text-red-500 text-xs">{errors.vendorEmail}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="type" className="block text-sm font-small text-gray-700 mt-1">Type</label>
                                <select
                                    id="vendorType"
                                    value={invoiceData.vendorType}
                                    onChange={(e) => handleChange(e, 'vendorType')}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                >
                                    <option value="company">Company</option>
                                    <option value="individual">Individual</option>
                                </select>
                            </div>


                            <div className="my-2">
                                <label htmlFor="vendor-cif-cnp" className="block text-sm font-small text-gray-700 mt-1">
                                    {invoiceData.vendorType === 'company' ? 'CIF' : 'CNP'}
                                </label>
                                <input
                                    type="text"
                                    id="vendor-cif-cnp"
                                    value={invoiceData.vendorCifcnp}
                                    onChange={(e) => handleChange(e, 'vendorCifcnp')}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    placeholder={invoiceData.vendorType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                                />
                                {errors.vendorCifcnp && <p className="text-red-500 text-xs">{errors.vendorCifcnp}</p>}

                            </div>
                            <div className="my-2 flex justify-center">
                                <button className="mt-4 px-4 py-2 font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400" onClick={() => setShowVendorsModal(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                    </svg>
                                </button>
                                <VendorsModal
                                    show={showVendorsModal}
                                    onVendorSelect={onVendorSelect}
                                    onClose={() => setShowVendorsModal(false)}
                                />
                            </div>

                        </div>


                    </div>
                    <div className="mt-6 border-b-2 border-gray-400 pb-4">
                        <table className="w-full border-collapse border border-gray-300">
                            {/* Table Header */}
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 font-small text-center">Item</th>
                                    <th className="border border-gray-300 px-4 py-2 font-small text-center">Quantity</th>
                                    <th className="border border-gray-300 px-4 py-2 font-small text-center">Unit Price</th>
                                    <th className="border border-gray-300 px-4 py-2 font-small text-center">U.M.</th>
                                    <th className="border border-gray-300 px-4 py-2 font-small text-center">Line Total</th>
                                    <th className="border border-gray-300 px-4 py-2 font-large text-center"></th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {invoiceData.items.map((item, index) => (
                                    <tr key={index} className="border border-gray-300">
                                        {/* Product/Service */}
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <input
                                                type="text"
                                                placeholder="Product/Service"
                                                className="w-full h-full rounded-md border border-gray-300 bg-transparent text-gray-700 text-sm px-2 py-1 focus:outline-none focus:border-gray-400"
                                                value={item.itemName}
                                                onChange={(e) => handleItemChange(e, 'itemName', index)}
                                            />
                                        </td>

                                        {/* Quantity */}
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <input
                                                type="number"
                                                min={1}
                                                placeholder="qty"
                                                className="w-20 h-full rounded-md border border-gray-300 bg-transparent text-gray-700 text-sm px-2 py-1 focus:outline-none focus:border-gray-400"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(e, 'quantity', index)}
                                            />
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                placeholder="price"
                                                className="w-20 h-full rounded-md border border-gray-300 bg-transparent text-gray-700 text-sm px-2 py-1 focus:outline-none focus:border-gray-400"
                                                value={item.unitPrice}
                                                min={0}
                                                onChange={(e) => handleItemChange(e, 'unitPrice', index)}
                                            />
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="text"
                                                placeholder="um"
                                                className="w-20 h-full rounded-md border border-gray-300 bg-transparent text-gray-700 text-sm px-2 py-1 focus:outline-none focus:border-gray-400"
                                                value={item.um}
                                                onChange={(e) => handleItemChange(e, 'um', index)}
                                            />
                                        </td>
                                        {/* Total Price */}
                                        <td className="border border-gray-300 px-2 py-2 text-center">
                                            <span>
                                                {(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}
                                            </span>
                                        </td>

                                        <td className="px-2 py-4 text-center flex justify-center items-center">
                                            <button type="button" className="px-1 py-1 text-center" onClick={() => removeItem(index)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                            <button type="button" className="px-1 py-1 text-center" onClick={() => setShowItemsModal(true)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                                </svg>
                                            </button>
                                            <ItemsModal
                                                show={showItemsModal}
                                                onItemSelect={onItemSelect}
                                                onClose={() => setShowItemsModal(false)}
                                            />
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Add new line button */}
                        <button type="button" className="mt-4 px-4 py-2 font-semibold bg-purple-500 hover:bg-purple-600 text-white rounded-md" onClick={addItem}>+ Add new line</button>

                        {/* Button to Pick Items from DB */}

                    </div>


                    <div className="w-full mx-auto bg-white flex flex-col items-end mt-4">

                        <div className="mb-4 flex items-center">
                            <label htmlFor="taxInput" className="block text-gray-700 text-md font-bold mr-2">Tax Amount:</label>
                            <input
                                type="number"
                                id="taxInput"
                                name="taxInput"
                                value={invoiceData.tax}
                                onChange={(e) => handleChange(e, 'tax')}
                                className="w-20 h-full rounded-md border border-gray-300 bg-transparent text-gray-700 text-sm px-2 py-1 focus:outline-none focus:border-gray-400"
                                placeholder="Enter tax amount"
                            />
                        </div>

                        <div className="mb-4 flex items-center">
                            <p className="text-md font-semibold text-gray-800">Total: $<span id="totalDisplay">{calculateTotal().toFixed(2)}</span></p>
                        </div>

                    </div>


                    <div className="flex justify-center mt-2">
                        <button type="submit" disabled={loading} className="mt-4 px-4 py-2 font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400">
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}
export default InvoiceModal;