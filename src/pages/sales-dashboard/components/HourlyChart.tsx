import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlyData } from '../types';

interface HourlyChartProps {
  data: HourlyData[];
}

const HourlyChart = ({ data }: HourlyChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-popover-foreground mb-2">
            Jam {label}:00
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-popover-foreground">
                {entry.dataKey === 'revenue' ? 'Pendapatan' : 'Transaksi'}: {' '}
                {entry.dataKey === 'revenue' 
                  ? formatCurrency(entry.value)
                  : entry.value.toLocaleString('id-ID')
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxTransactions = Math.max(...data.map(d => d.transactions));

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Pola Transaksi per Jam
      </h3>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="hour" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `${value}:00`}
            />
            <YAxis 
              yAxisId="revenue"
              orientation="left"
              tickFormatter={formatCurrency}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="transactions"
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              yAxisId="revenue"
              dataKey="revenue" 
              fill="var(--color-primary)"
              radius={[2, 2, 0, 0]}
              opacity={0.8}
            />
            <Bar 
              yAxisId="transactions"
              dataKey="transactions" 
              fill="var(--color-accent)"
              radius={[2, 2, 0, 0]}
              opacity={0.6}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary opacity-80" />
          <span className="text-muted-foreground">Pendapatan</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent opacity-60" />
          <span className="text-muted-foreground">Jumlah Transaksi</span>
        </div>
      </div>
    </div>
  );
};

export default HourlyChart;