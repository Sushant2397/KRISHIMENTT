import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../Common/ui/dialog';
import { Button } from '../Common/ui/button';
import { Badge } from '../Common/ui/badge';
import { MapPin, Calendar, User, Phone, MessageCircle, X, Eye, Plus, BarChart3 } from 'lucide-react';
import { ContactSellerModal } from './ContactSellerModal';
import { ImageGalleryModal } from './ImageGalleryModal';
import { SellerProfileModal } from './SellerProfileModal';

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

interface EquipmentDetailModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToComparison?: (equipment: Equipment) => void;
}

export function EquipmentDetailModal({ equipment, isOpen, onClose, onAddToComparison }: EquipmentDetailModalProps) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showSellerProfile, setShowSellerProfile] = useState(false);

  if (!equipment) return null;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(equipment.price);

  const postedDate = new Date(equipment.postedDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleContactSeller = () => {
    setShowContactModal(true);
  };

  const handleViewSellerProfile = () => {
    setShowSellerProfile(true);
  };

  const handleViewImageGallery = () => {
    setShowImageGallery(true);
  };

  const handleAddToComparison = () => {
    if (onAddToComparison) {
      onAddToComparison(equipment);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {equipment.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
  
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group cursor-pointer" onClick={handleViewImageGallery}>
              {equipment.images && equipment.images.length > 0 ? (
                <>
                  <img
                    src={equipment.images[0]}
                    alt={equipment.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  {equipment.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      +{equipment.images.length - 1} more
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                  No Image Available
                </div>
              )}
            </div>
            
            {/* Additional Images Thumbnails */}
            {equipment.images && equipment.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {equipment.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" onClick={handleViewImageGallery}>
                    <img
                      src={image}
                      alt={`${equipment.title} ${index + 2}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Price and Condition */}
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">
                {formattedPrice}
              </div>
              <Badge 
                variant={equipment.condition === 'New' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {equipment.condition}
              </Badge>
            </div>

            {/* Category */}
            <div>
              <Badge variant="outline" className="text-sm">
                {equipment.category}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {equipment.description}
              </p>
            </div>

            {/* Location and Date */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{equipment.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Posted on {postedDate}</span>
              </div>
            </div>

            {/* Seller Information */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Seller Information</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={handleViewSellerProfile}>
                  <User className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="font-medium">{equipment.seller?.name || 'Anonymous'}</span>
                  {equipment.seller?.rating > 0 && (
                    <span className="ml-2 text-amber-500">
                      {'★'.repeat(Math.min(5, Math.max(0, equipment.seller.rating)))}
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={handleViewSellerProfile}>
                  View Profile
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                <Button 
                  onClick={handleContactSeller}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
                <Button 
                  onClick={handleAddToComparison}
                  variant="outline"
                  className="flex-1"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Compare
                </Button>
              </div>
              <Button 
                onClick={handleViewImageGallery}
                variant="outline"
                className="w-full"
                disabled={!equipment.images || equipment.images.length === 0}
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Images ({equipment.images?.length || 0})
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Seller Modal */}
        <ContactSellerModal
          equipment={equipment}
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />

        {/* Image Gallery Modal */}
        <ImageGalleryModal
          images={equipment.images || []}
          isOpen={showImageGallery}
          onClose={() => setShowImageGallery(false)}
        />

        {/* Seller Profile Modal */}
        <SellerProfileModal
          seller={{
            id: equipment.id,
            name: equipment.seller.name,
            rating: equipment.seller.rating,
            location: equipment.location,
            joinDate: equipment.postedDate,
            totalListings: 1,
            verified: true,
            responseTime: 'Within 2 hours'
          }}
          isOpen={showSellerProfile}
          onClose={() => setShowSellerProfile(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
