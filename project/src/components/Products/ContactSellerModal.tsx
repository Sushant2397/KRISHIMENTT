import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../Common/ui/dialog';
import { Button } from '../Common/ui/button';
import { Input } from '../Common/ui/input';
import { Textarea } from '../Common/ui/textarea';
import { Label } from '../Common/ui/label';
import { X, Phone, Mail, MessageCircle, User } from 'lucide-react';

interface Seller {
  name: string;
  rating: number;
  phone?: string;
  email?: string;
}

interface Equipment {
  id: string;
  title: string;
  price: number;
  seller: Seller;
}

interface ContactSellerModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactSellerModal({ equipment, isOpen, onClose }: ContactSellerModalProps) {
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'inquiry'>('inquiry');
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!equipment) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInquiryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to send inquiry
      console.log('Sending inquiry:', {
        equipmentId: equipment.id,
        equipmentTitle: equipment.title,
        sellerName: equipment.seller.name,
        ...inquiryData
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Your inquiry has been sent successfully! The seller will contact you soon.');
      onClose();
      setInquiryData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Failed to send inquiry:', error);
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneCall = () => {
    if (equipment.seller.phone) {
      window.open(`tel:${equipment.seller.phone}`);
    } else {
      alert('Seller phone number not available');
    }
  };

  const handleEmail = () => {
    if (equipment.seller.email) {
      window.open(`mailto:${equipment.seller.email}?subject=Inquiry about ${equipment.title}`);
    } else {
      alert('Seller email not available');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Contact Seller
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
          {/* Equipment Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{equipment.title}</h3>
            <p className="text-green-600 font-bold text-xl">
              ₹{equipment.price.toLocaleString('en-IN')}
            </p>
            <p className="text-gray-600">Seller: {equipment.seller.name}</p>
          </div>

          {/* Contact Method Selection */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Choose Contact Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant={contactMethod === 'phone' ? 'default' : 'outline'}
                onClick={() => setContactMethod('phone')}
                className="flex items-center justify-center p-4"
                disabled={!equipment.seller.phone}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Seller
              </Button>
              <Button
                variant={contactMethod === 'email' ? 'default' : 'outline'}
                onClick={() => setContactMethod('email')}
                className="flex items-center justify-center p-4"
                disabled={!equipment.seller.email}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button
                variant={contactMethod === 'inquiry' ? 'default' : 'outline'}
                onClick={() => setContactMethod('inquiry')}
                className="flex items-center justify-center p-4"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Inquiry
              </Button>
            </div>
          </div>

          {/* Contact Actions */}
          {contactMethod === 'phone' && (
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Call Seller</h3>
              <p className="text-gray-600 mb-4">
                {equipment.seller.phone || 'Phone number not available'}
              </p>
              {equipment.seller.phone && (
                <Button onClick={handlePhoneCall} className="bg-green-600 hover:bg-green-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              )}
            </div>
          )}

          {contactMethod === 'email' && (
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Send Email</h3>
              <p className="text-gray-600 mb-4">
                {equipment.seller.email || 'Email not available'}
              </p>
              {equipment.seller.email && (
                <Button onClick={handleEmail} className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Open Email
                </Button>
              )}
            </div>
          )}

          {contactMethod === 'inquiry' && (
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={inquiryData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={inquiryData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={inquiryData.phone}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={inquiryData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Ask about the equipment, negotiate price, or request more information..."
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
