import React from 'react';
import Icon from '../../../components/AppIcon';
import { MetricCard } from '../types';

interface MetricCardsProps {
  metrics: MetricCard[];
}

const MetricCards = ({ metrics }: MetricCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatChange = (change: number, changeType: string) => {
    const sign = changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : '';
    return `${sign}${Math.abs(change)}%`;
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-success';
      case 'decrease':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'TrendingUp';
      case 'decrease':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-shadow duration-150"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.color}`}>
              <Icon name={metric.icon} size={24} color="white" />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
              <Icon name={getChangeIcon(metric.changeType)} size={16} />
              <span className="text-sm font-medium">
                {formatChange(metric.change, metric.changeType)}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {metric.title}
            </h3>
            <p className="text-2xl font-bold text-foreground">
              {typeof metric.value === 'number' && metric.title.includes('Revenue') 
                ? formatCurrency(metric.value)
                : metric.value.toLocaleString('id-ID')
              }
            </p>
            {metric.description && (
              <p className="text-xs text-muted-foreground mt-2">
                {metric.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;