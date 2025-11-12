import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { ReorderRecommendation } from '../types';

interface ReorderRecommendationsProps {
  recommendations: ReorderRecommendation[];
  onCreatePurchaseOrder: (productId: string) => void;
}

const ReorderRecommendations = ({ recommendations, onCreatePurchaseOrder }: ReorderRecommendationsProps) => {
  const getPriorityBadge = (priority: ReorderRecommendation['priority']) => {
    const priorityConfig = {
      high: { color: 'bg-error text-error-foreground', label: 'Tinggi' },
      medium: { color: 'bg-warning text-warning-foreground', label: 'Sedang' },
      low: { color: 'bg-secondary text-secondary-foreground', label: 'Rendah' }
    };

    const config = priorityConfig[priority];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getDaysUntilStockoutColor = (days: number) => {
    if (days <= 7) return 'text-error';
    if (days <= 14) return 'text-warning';
    return 'text-muted-foreground';
  };

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Rekomendasi Reorder</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {recommendations.length} produk perlu restock
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedRecommendations.map((recommendation) => (
          <div key={recommendation.productId} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{recommendation.productName}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      Stok: {recommendation.currentStock.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Titik Reorder: {recommendation.reorderPoint.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                {getPriorityBadge(recommendation.priority)}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Saran Qty: </span>
                    <span className="font-medium text-foreground">
                      {recommendation.suggestedQuantity.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Estimasi habis: </span>
                    <span className={`font-medium ${getDaysUntilStockoutColor(recommendation.daysUntilStockout)}`}>
                      {recommendation.daysUntilStockout} hari
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCreatePurchaseOrder(recommendation.productId)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Buat PO
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
          <p className="text-muted-foreground">Semua produk memiliki stok yang cukup</p>
        </div>
      )}
    </div>
  );
};

export default ReorderRecommendations;