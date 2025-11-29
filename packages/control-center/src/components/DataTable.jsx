import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const DataTable = ({
    columns,
    data,
    title,
    actions,
    searchPlaceholder = "Search...",
    itemsPerPage = 10
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter(item => {
            return Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [data, searchTerm]);

    // Sort data
    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-slate-400" />;
        if (sortConfig.direction === 'asc') return <ArrowUp size={14} className="text-blue-600" />;
        return <ArrowDown size={14} className="text-blue-600" />;
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    {actions}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="p-4 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => col.sortable && requestSort(col.accessor)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.header}
                                        {col.sortable && getSortIcon(col.accessor)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, rowIndex) => (
                                <tr key={item.id || rowIndex} className="hover:bg-slate-50 transition-colors">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="p-4 text-sm text-slate-700">
                                            {col.cell ? col.cell(item) : item[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-slate-500">
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
                <span className="text-sm text-slate-600">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
                </span>

                <div className="flex items-center gap-2">
                    <button
                        className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <span className="text-sm font-medium text-slate-900">
                        Page {currentPage} of {totalPages || 1}
                    </span>

                    <button
                        className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
