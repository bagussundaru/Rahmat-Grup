import React, { useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from 'components/ui/AppIcon';
import Image from 'components/ui/AppImage';
import { Product } from '../types';

interface Props {
  products: Product[];
  onSelect: (product: Product) => void;
}

const PopulerProductsCarousel: React.FC<Props> = ({ products, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (delta: number) => {
    const el = containerRef.current;
    if (el) el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  useEffect(() => {
    // Auto-scroll hint
    const el = containerRef.current;
    if (el) {
      el.scrollLeft = 0;
    }
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon name="Star" size={16} className="text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Produk Populer</h3>
        </div>
        <div className="space-x-2 hidden sm:flex">
          <Button variant="outline" size="sm" iconName="ChevronLeft" onClick={() => scrollBy(-200)}>Prev</Button>
          <Button variant="outline" size="sm" iconName="ChevronRight" onClick={() => scrollBy(200)}>Next</Button>
        </div>
      </div>

      <div ref={containerRef} className="flex space-x-3 overflow-x-auto scrollbar-hide py-2">
        {products.map((p) => (
          <button key={p.id} onClick={() => onSelect(p)} className="min-w-[140px] bg-muted rounded-lg p-2 text-left hover:bg-muted/70 transition-colors">
            <div className="w-full h-24 rounded-md overflow-hidden bg-background mb-2">
              {p.image ? (
                <Image src={p.image} alt={p.alt || p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="Package" size={20} className="text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
            <div className="text-xs text-muted-foreground">{p.category}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopulerProductsCarousel;
