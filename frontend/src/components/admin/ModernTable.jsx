import React from 'react';

const ModernTable = ({ columns, data, emptyMessage = "No data found." }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto lg:overflow-visible custom-scrollbar">
        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
          {data.length === 0 ? (
            <div className="py-12 text-center text-gray-500 bg-white">
              <p className="text-sm">{emptyMessage}</p>
            </div>
          ) : (
            data.map((row, rowIndex) => (
              <div key={rowIndex} className="bg-white border border-gray-100 rounded-xl p-4 space-y-4 shadow-sm">
                {columns.map((col, colIndex) => {
                   if (!col.header) return null; // Skip actions/empty headers or handle specifically
                   return (
                     <div key={colIndex} className="flex justify-between items-start border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider pt-1">{col.header}</span>
                        <div className="text-sm font-medium text-gray-900 text-right">
                          {col.render ? col.render(row) : row[col.accessor]}
                        </div>
                     </div>
                   );
                })}
                {/* Find the action column (no header) and render it if exists */}
                {columns.find(c => !c.header) && (
                  <div className="flex justify-end pt-2">
                    {columns.find(c => !c.header).render(row)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Traditional Table */}
        <table className="hidden lg:table w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50/80 border-b border-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 bg-white">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="bg-white hover:bg-gray-50/50 transition-colors duration-150 group"
                >
                  {columns.map((col, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`px-6 py-4 text-sm text-gray-700 ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Basic Pagination Footprint for visual premium feel */}

    </div>
  );
};

export default ModernTable;
