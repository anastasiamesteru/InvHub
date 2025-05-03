// src/utils/validation.js

export const InvoiceModalValidation = (data) => {
    const errors = {};

    const {
        issue_date, due_date, clientName, clientAddress, clientPhoneNo,clientEmail,
         clientCifcnp, clientType, vendorName, vendorAddress,
        vendorPhoneNo, vendorEmail, vendorCifcnp, vendorType,
        itemName, quantity, price
    } = data;

    // Ensure all strings are defined before calling .trim()
    const safeTrim = (value) => (value && typeof value === 'string' ? value.trim() : "");

    // Due and issue date validation
    if (due_date < issue_date) errors.due_date = "Due date cannot be before issue date.";

    // Client Validations
    if (!safeTrim(clientName)) errors.clientName = "Client name is required.";
    if (!safeTrim(clientAddress)) errors.clientAddress = "Client address is required.";
    if (!safeTrim(clientPhoneNo) || !/^\d{10}$/.test(clientPhoneNo)) errors.clientPhoneNo = "Valid phone number (10 digits) is required.";
    if (!safeTrim(clientEmail)) errors.clientEmail = "Client email is required.";

    if (!safeTrim(clientCifcnp)) {
        errors.clientCifcnp = clientType === "company" ? "CIF is required." : "CNP is required.";
    } else if (clientType === "company" && !/^\d{8,9}$/.test(clientCifcnp)) {
        errors.clientCifcnp = "Valid CIF required (8-9 digits).";
    } else if (clientType === "individual" && !/^\d{13}$/.test(clientCifcnp)) {
        errors.clientCifcnp = "Valid CNP required (13 digits).";
    }

    // Vendor Validations
    if (!safeTrim(vendorName)) errors.vendorName = "Vendor name is required.";
    if (!safeTrim(vendorAddress)) errors.vendorAddress = "Vendor address is required.";
    if (!safeTrim(vendorPhoneNo) || !/^\d{10}$/.test(vendorPhoneNo)) errors.vendorPhoneNo = "Valid phone number (10 digits) is required.";
    if (!safeTrim(vendorEmail)) errors.vendorEmail = "Vendor email is required.";

    if (!safeTrim(vendorCifcnp)) {
        errors.vendorCifcnp = vendorType === "company" ? "CIF is required." : "CNP is required.";
    } else if (vendorType === "company" && !/^\d{8,9}$/.test(vendorCifcnp)) {
        errors.vendorCifcnp = "Valid CIF required (8-9 digits).";
    } else if (vendorType === "individual" && !/^\d{13}$/.test(vendorCifcnp)) {
        errors.vendorCifcnp = "Valid CNP required (13 digits).";
    }

    // Item Validations
    //if (!safeTrim(itemName)) errors.itemName = "Item name is required.";
    //if (!safeTrim(quantity) || isNaN(quantity) || parseFloat(quantity) <= 0) errors.quantity = "Valid quantity is required.";
    //if (!safeTrim(price) || isNaN(price) || parseFloat(price) <= 0) errors.price = "Valid price (greater than 0) is required.";

    return errors;
};
