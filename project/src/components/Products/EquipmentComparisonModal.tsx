import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../Common/ui/dialog';
import { Button } from '../Common/ui/button';
import { Badge } from '../Common/ui/badge';
import { X, Plus, Trash2, Star, MapPin, Calendar } from 'lucide-react';

interface Seller {
  name: string;
  rating: number;
}

interface Equipment {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  location: string;
  images: string[];
  postedDate: string;
  seller: Seller;
}

interface EquipmentComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToComparison: (equipment: Equipment) => void;
  comparisonList: Equipment[];
  onRemoveFromComparison: (equipmentId: string) => void;
}

export function EquipmentComparisonModal({ 
  isOpen, 
  onClose, 
  onAddToComparison, 
  comparisonList, 
  onRemoveFromComparison 
}: EquipmentComparisonModalProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-green-100 text-green-800';
      case 'Used - Like New':
        return 'bg-blue-100 text-blue-800';
      case 'Used - Good':
        return 'bg-yellow-100 text-yellow-800';
      case 'Used - Fair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Equipment Comparison ({comparisonList.length} items)
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {comparisonList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Equipment to Compare</h3>
            <p className="text-gray-600 mb-4">
              Add equipment items to compare their features, prices, and details.
            </p>
            <Button onClick={onClose} variant="outline">
              Browse Equipment
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    {comparisonList.map((equipment) => (
                      <th key={equipment.id} className="text-center p-4 min-w-[250px]">
                        <div className="space-y-2">
                          <div className="relative">
                            {equipment.images && equipment.images.length > 0 ? (
                              <img
                                src={equipment.images[0]}
                                alt={equipment.title}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveFromComparison(equipment.id)}
                              className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <h3 className="font-semibold text-sm line-clamp-2">{equipment.title}</h3>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price Row */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">Price</td>
                    {comparisonList.map((equipment) => (
                      <td key={equipment.id} className="p-4 text-center">
                        <span className="text-green-600 font-bold text-lg">
                          {formatPrice(equipment.price)}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Condition Row */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">Condition</td>
                    {comparisonList.map((equipment) => (
                      <td key={equipment.id} className="p-4 text-center">
                        <Badge className={getConditionColor(equipment.condition)}>
                          {equipment.condition}
                        </Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Category Row */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">Category</td>
                    {comparisonList.map((equipment) => (
                      <td key={equipment.id} className="p-4 text-center">
                        <Badge variant="outline">{equipment.category}</Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Location Row */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">Location</td>
                    {comparisonList.map((equipment) => (
                      <td key={equipment.id} className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm">{equipment.location}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Posted Date Row */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">Posted Date</td>
                    {comparisonList.map((equipment) => (
                      <td key={equipment.id} className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm">{formatDate(equipment.postedDate)}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Seller Row */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">Seller</td>
                    {comparisonList.map((equipment) => (
                      <td key={equipment.id} className="p-4 text-center">
                        <div className="space-y-1">
                          <p className="font-medium">{equipment.seller.name}</p>
                          <div className="flex items-center justify-center">
                            {renderStars(equipment.seller.rating)}
                            <span className="ml-1 text-xs text-gray-600">
                              ({equipment.seller.rating})
                            </span>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Description Row */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">Description</td>
                    {comparisonList.map((equipment) => (
                      <td key={equipment.id} className="p-4 text-center">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {equipment.description}
                        </p>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                Close Comparison
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                View All Equipment
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
