import React, { useState } from "react"
import item from "../../../backend/models/item";
import { InvoiceModalValidation } from "../utils/InvoiceModalValidation.js";

const InvoiceModal = ({ isOpen, onClose, fetchInvoices }) => {

    const [clientCifCnp, setClientCifCnp] = useState('');
    const [vendorCifCnp, setVendorCifCnp] = useState('');

    const [clientType, setClientType] = useState('company');
    const [vendorType, setVendorType] = useState('company');

    const [issueDate, setIssueDate] = useState('');
    const [dueDate, setDueDate] = useState('');

    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhoneNo, setClientPhoneNo] = useState('');

    const [vendorName, setVendorName] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');
    const [vendorEmail, setVendorEmail] = useState('');
    const [vendorPhoneNo, setVendorPhoneNo] = useState('');
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const [errors, setErrors] = useState({});

    const handleIssueDateChange = (event) => setIssueDate(event.target.value);
    const handleDueDateChange = (event) => setDueDate(event.target.value);

    const handleClientCifCnpChange = (event) => setClientCifCnp(event.target.value);
    const handleVendorCifCnpChange = (event) => setVendorCifCnp(event.target.value);

    const handleClientTypeChange = (event) => setClientType(event.target.value);
    const handleVendorTypeChange = (event) => setVendorType(event.target.value);

    const handleClientNameChange = (event) => setClientName(event.target.value);
    const handleClientAddressChange = (event) => setClientAddress(event.target.value);
    const handleClientEmailChange = (event) => setClientEmail(event.target.value);

    const handleVendorNameChange = (event) => setVendorName(event.target.value);
    const handleVendorAddressChange = (event) => setVendorAddress(event.target.value);
    const handleVendorEmailChange = (event) => setVendorEmail(event.target.value);

    const handleItemNameChange = (event) => setItemName(event.target.value);
    const handleQuantityChange = (event) => setQuantity(event.target.value);
    const handlePriceChange = (event) => setPrice(event.target.value);

    const validateForm = () => {
        const errors = InvoiceModalValidation({
            issueDate,
            dueDate,
            clientName,
            clientAddress,
            clientPhoneNo,
            clientEmail,
            clientCifCnp,
            clientType,
            vendorName,
            vendorAddress,
            vendorPhoneNo,
            vendorEmail,
            vendorCifCnp,
            vendorType,
            itemName,
            quantity,
            price,
        });
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const onSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            // Handle form submission
            console.log("Form submitted successfully!");
        }
    };

    const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);

    const addItem = () => {
        setItems([...items, { name: "", qty: 1, price: 0 }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (e, index, field) => {
        const { value } = e.target;

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

                <form className="mt-4">
                    <div className="flex flex-col border-b-2 border-gray-400 pt-4 pb-4">
                        <div className="flex justify-between">
                            <div className="w-1/2 pr-2 flex flex-col items-center">
                                <label htmlFor="issueDate" className="block text-sm font-small text-gray-700">Issue date</label>
                                <input
                                    id="issueDate"
                                    type="date"
                                    value={issueDate}
                                    onChange={handleIssueDateChange}
                                    className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="w-1/2 pl-2 flex flex-col items-center">
                                <label htmlFor="dueDate" className="block text-sm font-small text-gray-700">Due date</label>
                                <input
                                    id="dueDate"
                                    type="date"
                                    value={dueDate}
                                    onChange={handleDueDateChange}
                                    className="w-50 mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        {/* Error message below both inputs */}
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
                                    value={clientName}
                                    onChange={handleClientNameChange}
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
                                    value={clientAddress}
                                    onChange={handleClientAddressChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.clientAddress && <p className="text-red-500 text-xs">{errors.clientAddress}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="clientPhoneNo" className="block text-sm font-small text-gray-700">Phone number:</label>
                                <input
                                    id="clientPhoneNo"
                                    type="text"
                                    placeholder="Client phone number"
                                    // value={clientPhoneNo}
                                    // onChange={a}
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
                                    value={clientEmail}
                                    onChange={handleClientEmailChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.clientEmail && <p className="text-red-500 text-xs">{errors.clientEmail}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="type" className="block text-sm font-small text-gray-700 mt-1">Type</label>
                                <select
                                    id="type"
                                    value={clientType}
                                    onChange={handleClientTypeChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                >
                                    <option value="company">Company</option>
                                    <option value="individual">Individual</option>
                                </select>
                            </div>
                            <div className="my-2">
                                <label htmlFor="client-cif-cnp" className="block text-sm font-small text-gray-700 mt-1">
                                    {clientType === 'company' ? 'CIF' : 'CNP'}
                                </label>
                                <input
                                    type="text"
                                    id="client-cif-cnp"
                                    value={clientCifCnp}
                                    onChange={handleClientCifCnpChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    placeholder={clientType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
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
                                    value={vendorName}
                                    onChange={handleVendorNameChange}
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
                                    value={vendorAddress}
                                    onChange={handleVendorAddressChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.vendorAddress && <p className="text-red-500 text-xs">{errors.vendorAddress}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="vendorPhoneNo" className="block text-sm font-small text-gray-700">Phone number:</label>
                                <input
                                    id="vendorPhoneNo"
                                    type="text"
                                    placeholder="Vendor phone number"
                                    //    value={vendorPhoneNo}
                                    //  onChange={a}
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
                                    value={vendorEmail}
                                    onChange={handleVendorEmailChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                                {errors.vendorEmail && <p className="text-red-500 text-xs">{errors.vendorEmail}</p>}

                            </div>
                            <div className="my-2">
                                <label htmlFor="type" className="block text-sm font-small text-gray-700 mt-1">Type</label>
                                <select
                                    id="type"
                                    value={vendorType}
                                    onChange={handleVendorTypeChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                >
                                    <option value="company">Company</option>
                                    <option value="individual">Individual</option>
                                </select>
                            </div>


                            <div className="my-2">
                                <label htmlFor="vendor-cif-cnp" className="block text-sm font-small text-gray-700 mt-1">
                                    {vendorType === 'company' ? 'CIF' : 'CNP'}
                                </label>
                                <input
                                    type="text"
                                    id="vendor-cif-cnp"
                                    value={vendorCifCnp}
                                    onChange={handleVendorCifCnpChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    placeholder={vendorType === 'company' ? 'Enter company CIF' : 'Enter individual CNP'}
                                />
                                {errors.vendorCifCnp && <p className="text-red-500 text-xs">{errors.vendorCifCnp}</p>}

                            </div>
                        </div>


                    </div>
                    <div className="mt-6">
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

                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <input
                                                type="text"
                                                placeholder="Product/Service"
                                                className="w-full h-full rounded-md border border-gray-300 bg-transparent text-gray-700 text-sm px-2 py-1 focus:outline-none focus:border-gray-400"
                                                value={item.name}
                                                onChange={(e) => handleItemChange(e, index, 'name')}
                                            />
                                        </td>

                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <input type="number"
                                                min={1}
                                                placeholder="Qty"
                                                className="w-20 h-full  rounded-md border border-gray-300 bg-transparent text-gray-700 text-sm px-2 py-1 focus:outline-none focus:border-gray-400"
                                                value={item.qty}
                                                onChange={(e) => handleItemChange(e, index, "qty")}
                                            />

                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                placeholder="Price"
                                                className="w-20 h-full rounded-md border border-gray-300 bg-transparent text-gray-700 text-sm px-2 py-1 focus:outline-none focus:border-gray-400"
                                                value={item.price}
                                                onChange={(e) => handleItemChange(e, index, "price")}
                                            />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-2 text-center">
                                            <span>${(item.qty * item.price).toFixed(2)}</span>
                                        </td>
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

                    <div class="w-full max-w-sm mx-auto p-6 bg-white shadow-md rounded-lg">

                        <div class="mb-4">
                            <label for="taxInput" class="block text-gray-700 text-sm font-bold mb-2">Enter Tax Amount:</label>
                            <input
                                type="number"
                                id="taxInput"
                                name="taxInput"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter tax amount"
                                oninput="calculateTotal()"
                            />
                        </div>
                        <div class="mt-4">
                            <p class="text-lg font-semibold text-gray-800">Total: $<span id="totalDisplay">0.00</span></p>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="px-1 py-2 bg-purple-500 text-white font-semibold text-md rounded-md hover:bg-purple-600 transition-colors w-60"
                            onClick={onSubmit} >
                            Submit
                        </button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default InvoiceModal;