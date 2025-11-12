import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategoryDistribution } from '../types';

interface CategoryDistributionChartProps {
  data: CategoryDistribution[];
}

const CategoryDistributionChart = ({ data }: CategoryDistributionChartProps) => {
  const COLORS = [
    'var(--color-primary)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-error)',
    'var(--color-accent)',
    'var(--color-secondary)'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-popover-foreground">{data.category}</p>
          <p className="text-sm text-muted-foreground">Jumlah: {data.count} produk</p>
          <p className="text-sm text-muted-foreground">Nilai: {formatCurrency(data.value)}</p>
          <p className="text-sm text-muted-foreground">Persentase: {data.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Distribusi Kategori</h3>
        <div className="text-sm text-muted-foreground">
          Total: {data.reduce((sum, item) => sum + item.count, 0)} produk
        </div>
      </div>

      <div className="h-80" aria-label="Category Distribution Pie Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percentage }) => `${percentage.toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Details Table */}
      <div className="mt-6 border-t border-border pt-4">
        <div className="space-y-2">
          {data.map((category, index) => (
            <div key={category.category} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium text-foreground">{category.category}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{category.count} produk</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(category.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDistributionChart;