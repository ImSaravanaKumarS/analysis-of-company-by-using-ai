import React from 'react';
// Fix: Assuming recharts is available in the project to render charts.
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { StockDataPoint } from '../types';

interface StockChartProps {
  data: StockDataPoint[];
  currencySymbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, currencySymbol }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No historical stock data available to display.
      </div>
    );
  }

  const formattedData = data.map(d => ({
    ...d,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <h3 className="text-xl font-semibold text-cyan-400 mb-4">Historical Stock Price (Last 30 Days)</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis 
              dataKey="date" 
              stroke="#A0AEC0" 
              tick={{ fontSize: 12 }} 
              tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis 
              stroke="#A0AEC0" 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => `${currencySymbol}${value}`}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A202C',
                borderColor: '#4A5568',
                color: '#E2E8F0',
              }}
              labelStyle={{ color: '#A0AEC0' }}
              formatter={(value: number) => [`${currencySymbol}${value.toFixed(2)}`, 'Price']}
            />
            <Legend wrapperStyle={{ color: '#E2E8F0' }} />
            <Line type="monotone" dataKey="price" stroke="#4FD1C5" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;