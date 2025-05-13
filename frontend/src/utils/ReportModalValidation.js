// src/utils/validation.js

export const ReportModalValidation = (data) => {
    const errors = {};

    const {
        title,
        description,
        selectedCheckboxes,
        startDate,
        endDate
    } = data;

    const safeTrim = (value) => (value && typeof value === 'string' ? value.trim() : "");

    // Title validation
    if (!safeTrim(title)) {
        errors.title = "Report title is required.";
    } else if (title.length > 100) {
        errors.title = "Title must be under 100 characters.";
    }

    // Description validation
    if (!safeTrim(description)) {
        errors.description = "Report description is required.";
    } else if (description.length < 10) {
        errors.description = "Description must be at least 10 characters.";
    }

   const isAnySelected = Object.values(selectedCheckboxes).some(category => 
        Object.values(category).some(value => value)
    );

    if (!isAnySelected) {
        errors.selectedCheckboxes = "At least one indicator must be selected.";
    }

    if (!safeTrim(startDate)) {
        errors.startDate = "Start date is required.";
    }

    if (!safeTrim(endDate)) {
        errors.endDate = "End date is required.";
    }

    if (safeTrim(startDate) && safeTrim(endDate)) {
        if (new Date(endDate) < new Date(startDate)) {
            errors.date_order = "Due date cannot be before issue date.";
        }
    }

    return errors;
};
