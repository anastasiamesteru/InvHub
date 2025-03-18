export const valdiateInvoiceForm = (formData, items) => {
    const newErrors = {};
  
    // Validate client fields
    if (!formData.clientName) {
      newErrors.clientName = "Client name is required.";
    }
    if (!formData.clientAddress) {
      newErrors.clientAddress = "Client address is required.";
    }
    if (!formData.clientEmail) {
      newErrors.clientEmail = "Client email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Please enter a valid email address.";
    }
  
    // CIF/CNP validation based on client type
    if (!formData.clientCifCnp) {
      newErrors.clientCifCnp = formData.clientType === "company" ? "CIF is required." : "CNP is required.";
    } else if (formData.clientType === "company" && !/^\d{8,9}$/.test(formData.clientCifCnp)) {
      newErrors.clientCifCnp = "Please enter a valid CIF.";
    } else if (formData.clientType === "individual" && !/^\d{13}$/.test(formData.clientCifCnp)) {
      newErrors.clientCifCnp = "Please enter a valid CNP.";
    }
  
    // Validate vendor fields
    if (!formData.vendorName) {
      newErrors.vendorName = "Vendor name is required.";
    }
    if (!formData.vendorAddress) {
      newErrors.vendorAddress = "Vendor address is required.";
    }
    if (!formData.vendorEmail) {
      newErrors.vendorEmail = "Vendor email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.vendorEmail)) {
      newErrors.vendorEmail = "Please enter a valid email address.";
    }
  
    // CIF/CNP validation based on vendor type
    if (!formData.vendorCifCnp) {
      newErrors.vendorCifCnp = formData.vendorType === "company" ? "CIF is required." : "CNP is required.";
    } else if (formData.vendorType === "company" && !/^\d{8,9}$/.test(formData.vendorCifCnp)) {
      newErrors.vendorCifCnp = "Please enter a valid CIF.";
    } else if (formData.vendorType === "individual" && !/^\d{13}$/.test(formData.vendorCifCnp)) {
      newErrors.vendorCifCnp = "Please enter a valid CNP.";
    }
  
    // Item validation
    items.forEach((item, index) => {
      if (!item.itemName.trim()) {
        newErrors[`itemName-${index}`] = "Item name is required.";
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`quantity-${index}`] = "Quantity must be a positive number.";
      }
      if (!item.price || item.price <= 0) {
        newErrors[`price-${index}`] = "Price must be a positive number.";
      }
    });
  
    return newErrors;
  };
  