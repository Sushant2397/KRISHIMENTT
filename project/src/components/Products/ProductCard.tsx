import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../Common/ui/card';
import { Button } from '../Common/ui/button';
import { Badge } from '../Common/ui/badge';
import { EquipmentDetailModal } from './EquipmentDetailModal';

interface Seller {
  name: string;
  rating: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  images: string[];
  location: string;
  postedDate: string;
  seller: Seller;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  useModal?: boolean; // If true, shows modal; if false, navigates to detail page
  onAddToComparison?: (product: any) => void;
}

export function ProductCard({ product, useModal = true, onAddToComparison }: ProductCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const navigate = useNavigate();

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const postedDate = new Date(product.postedDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative aspect-video bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <Badge 
          variant={product.condition === 'New' ? 'default' : 'secondary'}
          className="absolute top-2 right-2 text-xs"
        >
          {product.condition}
        </Badge>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.title}</h3>
          {product.category && (
            <Badge variant="outline" className="ml-2 whitespace-nowrap">
              {product.category}
            </Badge>
          )}
        </div>
        <p className="text-green-600 font-bold text-xl mb-2">{formattedPrice}</p>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{product.location}</span>
          <span className="mx-2">•</span>
          <span>{postedDate}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span>Seller: {product.seller?.name || 'Anonymous'}</span>
          {product.seller?.rating > 0 && (
            <span className="ml-2 text-amber-500">
              {'★'.repeat(Math.min(5, Math.max(0, product.seller.rating)))}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={() => {
            if (useModal) {
              setShowDetailModal(true);
            } else {
              navigate(`/equipment/${product.id}`);
            }
          }}
        >
          View Details
        </Button>
      </CardFooter>

      {/* Equipment Detail Modal - only show if useModal is true */}
      {useModal && (
        <EquipmentDetailModal
          equipment={product}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onAddToComparison={onAddToComparison}
        />
      )}
    </Card>
  );
}