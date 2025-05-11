// src/utils/validation.js

export const validateClientForm = (data = {}) => {
    const errors = {};
    const { name = "", email = "", phone = "", address = "", cifCnp = "", clientType = "" } = data;

    if (!name.trim()) errors.name = "Client name is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = "Valid email is required.";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) errors.phone = "Valid phone number (10 digits) is required.";
    if (!address.trim()) errors.address = "Client address is required.";

    if (!cifCnp.trim()) {
        errors.cifCnp = clientType === "company" ? "CUI is required." : "CNP is required.";
    } else if (clientType === "company" && !/^RO\d{2,10}$/.test(cifCnp)) {
        errors.cifCnp = "Valid CUI required (8-9 digits).";
    } else if (clientType === "individual" && !/^\d{13}$/.test(cifCnp)) {
        errors.cifCnp = "Valid CNP required (13 digits).";
    }

    return Object.keys(errors).length === 0 ? null : errors;
};


export const validateVendorForm = (data) => {
    const errors = {};
    const { name, address, phone, email, cifCnp, vendorType } = data;

    if (!name.trim()) errors.name = "Vendor name is required.";
    if (!address.trim()) errors.address = "Vendor address is required.";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) errors.phone = "Valid phone number (10 digits) is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = "Valid email is required.";

    if (!cifCnp.trim()) {
        errors.cifCnp = vendorType === "company" ? "CUI is required." : "CNP is required.";
    } else if (vendorType === "company" && !/^RO\d{2,10}$/.test(cifCnp)) {
        errors.cifCnp = "Valid CUI required (8-9 digits).";
    } else if (vendorType === "individual" && !/^\d{13}$/.test(cifCnp)) {
        errors.cifCnp = "Valid CNP required (13 digits).";
    }

    return errors;
};

export const validateItemForm = (data) => {
    const errors = {};
    const { name, um, price, description } = data;

    if (!name.trim()) errors.name = "Item name is required.";
    if (!um.trim()) errors.um = "Unit of measurement is required.";
    if (!price.trim() || isNaN(price) || parseFloat(price) <= 0) errors.price = "Valid price (greater than 0) is required.";
    if (!description.trim()) errors.description = "Description is required.";

    return errors;
};
