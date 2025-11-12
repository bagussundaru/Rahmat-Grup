import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { DateRange } from '../types';

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const DateRangeSelector = ({ dateRange, onDateRangeChange }: DateRangeSelectorProps) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const presetOptions = [
    { key: 'today', label: 'Hari Ini', icon: 'Calendar' },
    { key: 'week', label: 'Minggu Ini', icon: 'CalendarDays' },
    { key: 'month', label: 'Bulan Ini', icon: 'CalendarRange' },
    { key: 'custom', label: 'Kustom', icon: 'Settings' }
  ];

  const handlePresetChange = (preset: 'today' | 'week' | 'month' | 'custom') => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (preset) {
      case 'today':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        break;
      case 'week':
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        startDate = startOfWeek;
        endDate = endOfWeek;
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        break;
      default:
        startDate = dateRange.startDate;
        endDate = dateRange.endDate;
        setIsCustomOpen(true);
    }

    onDateRangeChange({
      startDate,
      endDate,
      preset
    });
  };

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    const newDate = new Date(value);
    const updatedRange = {
      ...dateRange,
      preset: 'custom' as const,
      [type === 'start' ? 'startDate' : 'endDate']: newDate
    };
    onDateRangeChange(updatedRange);
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Periode Laporan</h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {presetOptions.map((option) => (
            <Button
              key={option.key}
              variant={dateRange.preset === option.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetChange(option.key as any)}
              iconName={option.icon}
              iconPosition="left"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {(dateRange.preset === 'custom' || isCustomOpen) && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={formatDateForInput(dateRange.startDate)}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={formatDateForInput(dateRange.endDate)}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Periode Aktif:</span>
          <span className="font-medium text-foreground">
            {formatDisplayDate(dateRange.startDate)} - {formatDisplayDate(dateRange.endDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;