import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

import { PaginationInfo } from '../types';

interface PaginationControlsProps {
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const PaginationControls = ({
  paginationInfo,
  onPageChange,
  onItemsPerPageChange
}: PaginationControlsProps) => {
  const { currentPage, totalPages, totalItems, itemsPerPage } = paginationInfo;

  const itemsPerPageOptions = [
    { value: 10, label: '10 per halaman' },
    { value: 25, label: '25 per halaman' },
    { value: 50, label: '50 per halaman' },
    { value: 100, label: '100 per halaman' }
  ];

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 p-4 bg-card border-t border-border">
      {/* Items per page selector */}
      <div className="flex items-center space-x-2">
        <Select
          options={itemsPerPageOptions}
          value={itemsPerPage}
          onChange={(value) => onItemsPerPageChange(Number(value))}
          className="w-40"
        />
      </div>

      {/* Page info */}
      <div className="text-sm text-muted-foreground">
        Menampilkan {startItem.toLocaleString('id-ID')} - {endItem.toLocaleString('id-ID')} dari {totalItems.toLocaleString('id-ID')} transaksi
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          iconName="ChevronsLeft"
          className="h-8 w-8 p-0"
        />

        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          iconName="ChevronLeft"
          className="h-8 w-8 p-0"
        />

        {/* Page numbers */}
        {getVisiblePages().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="h-8 w-8 p-0"
          >
            {page}
          </Button>
        ))}

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          iconName="ChevronRight"
          className="h-8 w-8 p-0"
        />

        {/* Last page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          iconName="ChevronsRight"
          className="h-8 w-8 p-0"
        />
      </div>
    </div>
  );
};

export default PaginationControls;