import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h4 className="text-3xl font-heading font-bold text-gray-900">{value}</h4>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-gray-700 group-hover:bg-black group-hover:text-white transition-colors duration-300">
          {Icon && <Icon size={24} />}
        </div>
      </div>
      
      {trend && trendValue && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-semibold flex items-center ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '-'} {trendValue}
          </span>
          <span className="text-gray-400 ml-2">vs last month</span>
        </div>
      )}
      
      {/* Decorative accent */}
      <div className="absolute bottom-0 left-0 h-1 bg-black w-0 group-hover:w-full transition-all duration-300 ease-out" />
    </div>
  );
};

export default StatCard;
