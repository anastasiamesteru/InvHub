// src/utils/validation.js

export const InvoiceModalValidation = (data) => {
    const errors = {};

    const { issueDate, dueDate, clientName, clientAddress, clientEmail, clientCifCnp, clientType, vendorName, vendorAddress, vendorEmail, vendorCifCnp, vendorType, itemName, quantity, price } = data;

    // Due and issue date validation
    if (dueDate < issueDate) errors.dueDate = "Due date cannot be before issue date.";

    // Client Validations
    if (!clientName.trim()) errors.clientName = "Client name is required.";
    if (!clientAddress.trim()) errors.clientAddress = "Client address is required.";
    if (!clientEmail.trim() || !/\S+@\S+\.\S+/.test(clientEmail)) errors.clientEmail = "Valid email is required.";
    if (!clientCifCnp.trim()) {
        errors.clientCifCnp = clientType === "company" ? "CIF is required." : "CNP is required.";
    } else if (clientType === "company" && !/^\d{8,9}$/.test(clientCifCnp)) {
        errors.clientCifCnp = "Valid CIF required (8-9 digits).";
    } else if (clientType === "individual" && !/^\d{13}$/.test(clientCifCnp)) {
        errors.clientCifCnp = "Valid CNP required (13 digits).";
    }

    // Vendor Validations
    if (!vendorName.trim()) errors.vendorName = "Vendor name is required.";
    if (!vendorAddress.trim()) errors.vendorAddress = "Vendor address is required.";
    if (!vendorEmail.trim() || !/\S+@\S+\.\S+/.test(vendorEmail)) errors.vendorEmail = "Valid email is required.";
    if (!vendorCifCnp.trim()) {
        errors.vendorCifCnp = vendorType === "company" ? "CIF is required." : "CNP is required.";
    } else if (vendorType === "company" && !/^\d{8,9}$/.test(vendorCifCnp)) {
        errors.vendorCifCnp = "Valid CIF required (8-9 digits).";
    } else if (vendorType === "individual" && !/^\d{13}$/.test(vendorCifCnp)) {
        errors.vendorCifCnp = "Valid CNP required (13 digits).";
    }

    // Item Validations
    if (!itemName.trim()) errors.itemName = "Item name is required.";
    if (!quantity.trim() || isNaN(quantity) || parseFloat(quantity) <= 0) errors.quantity = "Valid quantity is required.";
    if (!price.trim() || isNaN(price) || parseFloat(price) <= 0) errors.price = "Valid price (greater than 0) is required.";

    return errors;
};
