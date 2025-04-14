import React, { useState, useEffect } from 'react';
import ReportModal from '../components/ReportModal';
import axios from 'axios';
import { PDFViewer } from "@react-pdf/renderer";
import ReportPDF from '../components/ReportPDF';
const Report = () => {
    const [reports, setReports] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const fetchReports = async () => {
        try {
            const response = await fetch('http://localhost:4000/routes/reports/getall');
            if (!response.ok) throw new Error('Failed to fetch reports');
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);


    const deleteReport = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/routes/reports/${id}`);
            console.log("Report deleted successfully");

            setReports(prevReports => prevReports.filter(report => report._id !== id));

            fetchReports();
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const filteredReports = () => {
        const query = searchQuery?.toLowerCase() || '';
        let data = reports ?? []; // Ensure data is correctly initialized

        // Apply filtering
        data = data.filter(report =>
            Object.values(report).some(value =>
                value?.toString().toLowerCase().includes(query)
            )
        );

        // Apply sorting if necessary
        if (sortColumn) {
            data.sort((a, b) => {
                let valueA = a[sortColumn] ?? '';
                let valueB = b[sortColumn] ?? '';

                if (typeof valueA === 'string') valueA = valueA.toLowerCase();
                if (typeof valueB === 'string') valueB = valueB.toLowerCase();

                if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    };

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 8;

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = filteredReports().slice(indexOfFirstReport, indexOfLastReport);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const handleViewPDF = (report) => {
        setSelectedReport(report);
    };

    const renderIndicators = (indicators) => {
        const selectedIndicators = [];

        Object.entries(indicators).forEach(([category, values]) => {
            Object.entries(values).forEach(([key, value]) => {
                if (value) {
                    const label = key.replace(/([A-Z])/g, " $1");
                    selectedIndicators.push(`${category}: ${label}`);
                }
            });
        });

        return selectedIndicators.length > 0 ? (
            <ul className="text-sm text-gray-600 list-disc list-inside">
                {selectedIndicators.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        ) : (
            <p className="text-sm text-gray-400">No indicators selected.</p>
        );
    };


    return (
        <div className="p-4 h-w-full h-screen">
            <div className="flex items-center justify-between border-b-2 border-purple-500">
                <p className="text-gray-700 text-m flex-1 py-4"> Explore your report data and transform numbers into valuable knowledge.</p>
                <div className="flex gap-2 items-center">
                    <button
                        className="px-4 py-2 bg-purple-500 border-2 border-purple-500 text-white font-semibold text-sm rounded-lg hover:bg-gray-700 hover:border-gray-700 transition-colors"
                        onClick={openModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 inline-block mr-2">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                        </svg>
                        Add
                    </button>
                    <ReportModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        fetchReports={fetchReports}
                    />
                </div>
            </div>



            <div className="flex items-center bg-gray-100 p-2 rounded-md mt-2 mb-2">
                <input
                    type="text"
                    id="search-box"
                    placeholder="🔎︎ Search by client, vendor, amount, or status..."
                    className="flex-1 p-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>


            <div>
                <table className="w-full border-collapse text-sm overflow-auto">
                    <thead>
                        <tr>
                            <th
                                className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                onClick={() => handleSort('reportNumber')}
                            >
                                Report Number
                                {sortColumn === 'reportNumber' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                            </th>
                            <th
                                className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                onClick={() => handleSort('title')}
                            >
                                Report Title
                                {sortColumn === 'title' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                            </th>
                            <th
                                className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                onClick={() => handleSort('startDate')}
                            >
                                Start Date
                                {sortColumn === 'startDate' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                            </th>
                            <th
                                className="px-3 py-2 text-center bg-gray-200 cursor-pointer"
                                onClick={() => handleSort('endDate')}
                            >
                                End Date
                                {sortColumn === 'endDate' ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                            </th>
                            <th className="px-3 py-2 text-center bg-gray-200">Indicators</th>
                            <th className="px-3 py-2 text-center bg-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentReports.length > 0 ? (
                            currentReports.map((report) => (
                                <tr key={report.reportNumber} className="hover:bg-gray-100">
                                    <td className="px-3 py-2 text-center">{report.reportNumber}</td>
                                    <td className="px-3 py-2 text-center">{report.title}</td>


                                    <td className="px-3 py-2 text-center">
                                        {report.startDate ? formatDate(report.startDate) : 'No Start Date'}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        {report.endDate ? formatDate(report.endDate) : 'No End Date'}
                                    </td>


                                    <td className="px-3 py-2 text-center">
                                        <div>
                                            <div>
                                                <strong>Payment Status: </strong>
                                                {Object.values(report.indicators.paymentStatus).filter(value => value).length} / 4 indicators
                                            </div>
                                            <div>
                                                <strong>Overdue Analysis: </strong>
                                                {Object.values(report.indicators.overdueAnalysis).filter(value => value).length} / 4 indicators
                                            </div>
                                            <div>
                                                <strong>Financials: </strong>
                                                {Object.values(report.indicators.financials).filter(value => value).length} / 1 indicator
                                            </div>
                                        </div>
                                    </td>


                                    <td className="px-3 py-2 text-center flex justify-center gap-2">
                                        <button className="px-2 py-1 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M16.98 3.02a2.87 2.87 0 1 1 4.06 4.06l-1.41 1.41-4.06-4.06 1.41-1.41zM3 17.25V21h3.75l11.29-11.29-3.75-3.75L3 17.25z" />
                                            </svg>
                                        </button>
                                        <button className="px-2 py-1 text-center" onClick={() => handleViewPDF(report)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button className="px-2 py-1 text-center" onClick={() => deleteReport(report._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-center">
                                <td colSpan="100%" className="px-3 py-2">No reports found</td>
                            </tr>
                        )}
                    </tbody>

                </table>


                {/* PDF Modal */}
                {selectedReport && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 h-4/5 relative overflow-hidden">

                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200 z-10"
                                onClick={() => setSelectedReport(null)}
                            >
                                ✕
                            </button>

                            {/* PDF Viewer with padding to prevent overlap */}
                            <div className="h-full pt-6 pb-4 pl-4 pr-4 overflow-auto">
                                <PDFViewer width="100%" height="100%">
                                    <ReportPDF reportData={selectedReport} />
                                </PDFViewer>
                            </div>
                        </div>
                    </div>
                )}




                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    <button
                        className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                    >
                        First
                    </button>
                    <button
                        className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 mx-2 text-sm text-gray-600">{currentPage}</span>
                    <button
                        className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredReports.length / reportsPerPage)))}
                        disabled={currentPage === Math.ceil(filteredReports.length / reportsPerPage)}
                    >
                        Next
                    </button>
                    <button
                        className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700"
                        onClick={() => setCurrentPage(Math.ceil(filteredReports.length / reportsPerPage))}
                        disabled={currentPage === Math.ceil(filteredReports.length / reportsPerPage)}
                    >
                        Last
                    </button>
                </div>





            </div>
        </div>
    );
};

export default Report;
