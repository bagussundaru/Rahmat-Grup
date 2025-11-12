import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from "components/ui/AppIcon";
import { PaymentMethodData } from '../types';

interface PaymentMethodChartProps {
  data: PaymentMethodData[];
}

const PaymentMethodChart = ({ data }: PaymentMethodChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value);
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'tunai':
        return 'Banknote';
      case 'qris':
        return 'QrCode';
      case 'kartu':
        return 'CreditCard';
      default:
        return 'Wallet';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name={getMethodIcon(data.method)} size={16} className="text-popover-foreground" />
            <span className="text-sm font-medium text-popover-foreground">
              {data.method}
            </span>
          </div>
          <p className="text-sm text-popover-foreground">
            Jumlah: {formatCurrency(data.amount)}
          </p>
          <p className="text-sm text-popover-foreground">
            Persentase: {data.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-col space-y-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <Icon name={getMethodIcon(entry.payload.method)} size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{entry.payload.method}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {formatCurrency(entry.payload.amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.payload.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Metode Pembayaran
      </h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <CustomLegend payload={data.map((item, index) => ({ 
        ...item, 
        color: item.color,
        payload: item 
      }))} />
    </div>
  );
};

export default PaymentMethodChart;