import React, { useState } from "react"
import item from "../../../backend/models/item";
import { InvoiceModalValidation } from "../utils/InvoiceModalValidation.js";
import axios from 'axios';

const InvoiceModal = ({ isOpen, onClose, fetchInvoices }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Form validation function
    const validateForm = () => {
        const errors = InvoiceModalValidation({
            clientName: invoiceData.clientName,
            clientAddress: invoiceData.clientAddress,
            clientPhoneNo: invoiceData.clientPhoneNo,
            clientType: invoiceData.clientType,
            clientCifCnp: invoiceData.clientCifCnp,

            vendorName: invoiceData.vendorName,
            vendorAddress: invoiceData.vendorAddress,
            vendorPhoneNo: invoiceData.vendorPhoneNo,
            vendorType: invoiceData.vendorType,
            vendorCifCnp: invoiceData.vendorCifCnp,

            issueDate: invoiceData.issueDate,
            dueDate: invoiceData.dueDate,
            tax: invoiceData.tax,
            total: invoiceData.total,

            items: invoiceData.items,
        });

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: '',

        clientName: '', clientAddress: '', clientPhoneNo: '', clientEmail: '', clientType: 'company', clientCifCnp: '',

        vendorName: '', vendorAddress: '', vendorPhoneNo: '', vendorEmail: '', vendorType: 'company', vendorCifCnp: '',

        issueDate: '', dueDate: '', tax: 0, total: 0,

        items: [{ name: '', qty: 1, price: 0 }],
    });

    const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0); // Total state for displaying total with tax

    const calculateTotalWithoutTax = () => {
        return items.reduce((total, item) => total + (item.price * item.qty), 0);
    };

    const calculateTotal = () => {
        const totalItemsCost = calculateTotalWithoutTax();
        const validTax = !isNaN(invoiceData.tax) && invoiceData.tax >= 0 ? invoiceData.tax : 0;
        const taxAmount = (totalItemsCost * validTax) / 100;
        return totalItemsCost + taxAmount;
    };

    const addItem = () => {
        setItems([...items, { name: "", qty: 1, price: 0 }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleChange = (e, field, index = null) => {
        const { value } = e.target;

        if (index !== null) {
            // Handling item-specific changes (for the list of items)
            setItems((prevItems) =>
                prevItems.map((item, i) =>
                    i === index
                        ? {
                            ...item,
                            [field]: field === "qty" || field === "price" ? parseFloat(value) || 0 : value
                        }
                        : item
                )
            );
        } else {
            // Handling general invoice data changes
            setInvoiceData((prevData) => ({
                ...prevData,
                [field]: field === "tax" ? parseFloat(value) || 0 : value, // Ensure tax is treated as a number
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        const invoiceNumber = `INV-${Math.floor(Math.random() * 9000) + 1000}`;

        setLoading(true);

        const payload = {
            invoiceNumber, // Use the generated number
            clientName: invoiceData.clientName,
            clientEmail: invoiceData.clientEmail,
            clientType: invoiceData.clientType,
            clientPhoneNo: invoiceData.clientPhoneNo,
            clientAddress: invoiceData.clientAddress,
            clientCifCnp: invoiceData.clientCifCnp,

            vendorName: invoiceData.vendorName,
            vendorEmail: invoiceData.vendorEmail,
            vendorType: invoiceData.vendorType,
            vendorPhoneNo: invoiceData.vendorPhoneNo,
            vendorAddress: invoiceData.vendorAddress,
            vendorCifCnp: invoiceData.vendorCifCnp,

            issueDate: invoiceData.issueDate,
            dueDate: invoiceData.dueDate,
            items: items, // Use the latest items state
            tax: tax,
            total: calculateTotal(), // Correctly calculate the total
        };

        try {
            const response = await axios.post('http://localhost:4000/routes/invoices/create', payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            await fetchInvoices(); 
            closeModal();
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

   console.log("Invoice Data:", invoiceData); // For debugging purposes

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
                                <label htmlFor="issueDate" className="block text-sm font-small text-gray-700">Issue date</label>
                                <input
                                    id="issueDate"
                                    type="date"
                                    value={invoiceData.issueDate}
                                    onChange={(e) => handleChange(e, 'issueDate')}
                                    className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="w-1/2 pl-2 flex flex-col items-center">
                                <label htmlFor="dueDate" className="block text-sm font-small text-gray-700">Due date</label>
                                <input
                                    id="dueDate"
                                    type="date"
                                    value={invoiceData.dueDate}
                                    onChange={(e) => handleChange(e, 'dueDate')}
                                    className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        {errors.dueDate && (
                            <p className="text-red-500 text-xs text-center mt-2">{errors.dueDate}</p>
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
                                    value={invoiceData.clientCifCnp}
                                    onChange={(e) => handleChange(e, 'clientCifCnp')}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    placeholder={invoiceData.clientType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                                />
                                {errors.clientCifCnp && <p className="text-red-500 text-xs">{errors.clientCifCnp}</p>}

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
                                    value={invoiceData.vendorCifCnp}
                                    onChange={(e) => handleChange(e, 'vendorCifCnp')}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    placeholder={invoiceData.vendorType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                                />
                                {errors.vendorCifCnp && <p className="text-red-500 text-xs">{errors.vendorCifCnp}</p>}

                            </div>
                        </div>


                    </div>
                    <div className="mt-6 border-b-2 border-gray-400 pb-4">
                        <table className="w-full border-collapse   border border-gray-300">
                            {/* Table Header */}
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 font-small text-center">Item</th>
                                    <th className="border border-gray-300 px-4 py-2 font-small text-center">Quantity</th>
                                    <th className="border border-gray-300 px-4 py-2 font-small text-center">Unit Price</th>
                                    <th className="border border-gray-300 px-4 py-2 font-small text-center">Line Total</th>
                                    <th className="border border-gray-300 px-4 py-2 font-large text-center"></th>

                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className="border border-gray-300">
                                        {/* Product/Service */}
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <input
                                                type="text"
                                                placeholder="Product/Service"
                                                className="w-full h-full rounded-md border border-gray-300 bg-transparent text-gray-700 text-sm px-2 py-1 focus:outline-none focus:border-gray-400"
                                                value={item.name}
                                                onChange={(e) => handleChange(e, 'name', index)}
                                            />
                                        </td>

                                        {/* Quantity */}
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <input
                                                type="number"
                                                min={1}
                                                placeholder="Qty"
                                                className="w-20 h-full rounded-md border border-gray-300 bg-transparent text-gray-700 text-sm px-2 py-1 focus:outline-none focus:border-gray-400"
                                                value={item.qty}
                                                onChange={(e) => handleChange(e, 'qty', index)}
                                            />
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                placeholder="Price"
                                                className="w-20 h-full rounded-md border border-gray-300 bg-transparent text-gray-700 text-sm px-2 py-1 focus:outline-none focus:border-gray-400"
                                                value={item.price}
                                                onChange={(e) => handleChange(e, 'price', index)} 
                                            />
                                        </td>

                                        {/* Total Price */}
                                        <td className="border border-gray-300 px-2 py-2 text-center">
                                            <span>${(item.qty * item.price).toFixed(2)}</span>
                                        </td>

                                        {/* Remove Item Button */}
                                        <td className="px-2 py-4 text-center flex justify-center items-center">
                                            <button className="px-1 py-1 text-center" onClick={() => removeItem(index)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>

                        {/* Add new line button */}
                        <button type="button" className="mt-4 px-4 py-2 font-semibold bg-purple-500 hover:bg-purple-600 text-white rounded-md" onClick={addItem}>+ Add new line</button>
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
                        <button type="submit" disabled={loading} className="mt-4 px-12 py-2 font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400">
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    )
}
export default InvoiceModal;