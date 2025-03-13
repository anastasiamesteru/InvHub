import React from 'react';

const ConfirmEntityDeleteModal = ({ isOpen, onCancel, onConfirm }) => {
    if (!isOpen) return null; 

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-96">
                <h3 className="text-xl font-semibold">Are you sure?</h3>
                <p className="mt-4">Do you really want to delete this entry? This action cannot be undone.</p>
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ConfirmEntityDeleteModal;
