// src/utils/validation.js

export const InvoiceModalValidation = (data) => {
    const errors = {};

    const {
        issueDate, dueDate, clientName, clientAddress, clientPhoneNo,
        clientEmail, clientCifCnp, clientType, vendorName, vendorAddress,
        vendorPhoneNo, vendorEmail, vendorCifCnp, vendorType,
        itemName, quantity, price
    } = data;

    // Ensure all strings are defined before calling .trim()
    const safeTrim = (value) => (value && typeof value === 'string' ? value.trim() : "");

    // Due and issue date validation
    if (dueDate < issueDate) errors.dueDate = "Due date cannot be before issue date.";

    // Client Validations
    if (!safeTrim(clientName)) errors.clientName = "Client name is required.";
    if (!safeTrim(clientAddress)) errors.clientAddress = "Client address is required.";
    if (!safeTrim(clientPhoneNo) || !/^\d{10}$/.test(clientPhoneNo)) errors.phone = "Valid phone number (10 digits) is required.";
    if (!safeTrim(clientCifCnp)) {
        errors.clientCifCnp = clientType === "company" ? "CIF is required." : "CNP is required.";
    } else if (clientType === "company" && !/^\d{8,9}$/.test(clientCifCnp)) {
        errors.clientCifCnp = "Valid CIF required (8-9 digits).";
    } else if (clientType === "individual" && !/^\d{13}$/.test(clientCifCnp)) {
        errors.clientCifCnp = "Valid CNP required (13 digits).";
    }

    // Vendor Validations
    if (!safeTrim(vendorName)) errors.vendorName = "Vendor name is required.";
    if (!safeTrim(vendorAddress)) errors.vendorAddress = "Vendor address is required.";
    if (!safeTrim(vendorPhoneNo) || !/^\d{10}$/.test(vendorPhoneNo)) errors.phone = "Valid phone number (10 digits) is required.";
   
    if (!safeTrim(vendorCifCnp)) {
        errors.vendorCifCnp = vendorType === "company" ? "CIF is required." : "CNP is required.";
    } else if (vendorType === "company" && !/^\d{8,9}$/.test(vendorCifCnp)) {
        errors.vendorCifCnp = "Valid CIF required (8-9 digits).";
    } else if (vendorType === "individual" && !/^\d{13}$/.test(vendorCifCnp)) {
        errors.vendorCifCnp = "Valid CNP required (13 digits).";
    }

    // Item Validations
    if (!safeTrim(itemName)) errors.itemName = "Item name is required.";
    if (!safeTrim(quantity) || isNaN(quantity) || parseFloat(quantity) <= 0) errors.quantity = "Valid quantity is required.";
    if (!safeTrim(price) || isNaN(price) || parseFloat(price) <= 0) errors.price = "Valid price (greater than 0) is required.";

    return errors;
};
