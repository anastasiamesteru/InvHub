import React, { useState } from 'react';

const ReportModal = ({ isOpen, onClose }) => {
    const [reportDetails, setReportDetails] = useState({
        title: '',
        description: '',
        date: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Report submitted:', reportDetails);
        // Add logic to submit report here
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">Add Report</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={reportDetails.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={reportDetails.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-purple-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={reportDetails.date}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-700"
                        >
                            Add Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
