import React from 'react';
// Fix: Assuming recharts is available in the project to render charts.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { RevenueDataPoint } from '../types';

interface RevenueDisplayProps {
  quarterlyData: RevenueDataPoint[];
  annualData: RevenueDataPoint[];
  currencySymbol: string;
}

const CustomTooltip = ({ active, payload, label, currencySymbol }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/80 p-3 border border-gray-700 rounded-lg shadow-lg">
        <p className="label text-cyan-400">{`${label}`}</p>
        <p className="intro text-white">{`Revenue: ${currencySymbol}${payload[0].value.toLocaleString()}M`}</p>
      </div>
    );
  }
  return null;
};

const RevenueChart: React.FC<{ data: RevenueDataPoint[]; title: string; currencySymbol: string }> = ({ data, title, currencySymbol }) => {
    if (!data || data.length === 0) {
        return (
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">{title}</h3>
            <p className="text-center text-gray-500 py-8">No data available.</p>
          </div>
        );
      }
    
    return (
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">{title}</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="period" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#A0AEC0" tick={{ fontSize: 12 }} tickFormatter={(value) => `${currencySymbol}${value}M`} />
                        <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} cursor={{ fill: 'rgba(79, 209, 197, 0.1)' }} />
                        <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                        <Bar dataKey="revenue" fill="#4FD1C5" name="Revenue (in Millions)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const RevenueDisplay: React.FC<RevenueDisplayProps> = ({ quarterlyData, annualData, currencySymbol }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <RevenueChart data={quarterlyData} title="Quarterly Revenue" currencySymbol={currencySymbol} />
      <RevenueChart data={annualData} title="Annual Revenue" currencySymbol={currencySymbol} />
    </div>
  );
};

export default RevenueDisplay;