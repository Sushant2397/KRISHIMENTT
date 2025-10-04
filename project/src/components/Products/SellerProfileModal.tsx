import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../Common/ui/dialog';
import { Button } from '../Common/ui/button';
import { Badge } from '../Common/ui/badge';
import { X, Star, MapPin, Calendar, Phone, Mail, MessageCircle, Shield, Award, TrendingUp } from 'lucide-react';

interface Seller {
  id: string;
  name: string;
  rating: number;
  phone?: string;
  email?: string;
  location?: string;
  joinDate?: string;
  totalListings?: number;
  verified?: boolean;
  responseTime?: string;
  profileImage?: string;
}

interface SellerProfileModalProps {
  seller: Seller | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SellerProfileModal({ seller, isOpen, onClose }: SellerProfileModalProps) {
  const [sellerStats, setSellerStats] = useState({
    totalSales: 0,
    averageRating: 0,
    responseRate: '95%',
    memberSince: '2023'
  });

  useEffect(() => {
    if (seller) {
      // TODO: Fetch seller statistics from API
      // For now, using mock data
      setSellerStats({
        totalSales: Math.floor(Math.random() * 100) + 20,
        averageRating: seller.rating || 4.5,
        responseRate: '95%',
        memberSince: seller.joinDate ? new Date(seller.joinDate).getFullYear().toString() : '2023'
      });
    }
  }, [seller]);

  if (!seller) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Seller Profile
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

        <div className="space-y-6">
          {/* Seller Header */}
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {seller.profileImage ? (
                <img
                  src={seller.profileImage}
                  alt={seller.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                  {seller.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-xl font-bold text-gray-800">{seller.name}</h2>
                {seller.verified && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center">
                  {renderStars(sellerStats.averageRating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {sellerStats.averageRating.toFixed(1)} ({sellerStats.totalSales} reviews)
                  </span>
                </div>
              </div>
              
              {seller.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{seller.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Seller Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{sellerStats.totalSales}</p>
              <p className="text-sm text-gray-600">Total Sales</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Star className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{sellerStats.averageRating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <MessageCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{sellerStats.responseRate}</p>
              <p className="text-sm text-gray-600">Response Rate</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{sellerStats.memberSince}</p>
              <p className="text-sm text-gray-600">Member Since</p>
            </div>
          </div>

          {/* Seller Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seller.phone && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{seller.phone}</p>
                  </div>
                </div>
              )}
              
              {seller.email && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{seller.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seller Badges */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center">
                <Award className="h-3 w-3 mr-1" />
                Top Seller
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Trusted Seller
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                Quick Responder
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            {seller.phone && (
              <Button variant="outline" className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Call Seller
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
