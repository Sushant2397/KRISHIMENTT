import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../Common/ui/dialog';
import { Button } from '../Common/ui/button';
import { Input } from '../Common/ui/input';
import { Label } from '../Common/ui/label';
import { Textarea } from '../Common/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Common/ui/select';
import { Upload, X, Tractor, Droplet, Sprout, Warehouse, Wrench, MapPin, IndianRupee, Plus } from 'lucide-react';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded?: () => void;
}

const categories = [
  { value: 'Tractors', label: 'Tractors & Machinery', icon: <Tractor className="w-4 h-4 mr-2" /> },
  { value: 'Irrigation', label: 'Irrigation Systems', icon: <Droplet className="w-4 h-4 mr-2" /> },
  { value: 'Seeds', label: 'Seeds & Plants', icon: <Sprout className="w-4 h-4 mr-2" /> },
  { value: 'Fertilizers', label: 'Fertilizers & Soil', icon: <Warehouse className="w-4 h-4 mr-2" /> },
  { value: 'Tools', label: 'Farm Tools', icon: <Wrench className="w-4 h-4 mr-2" /> },
  { value: 'Other', label: 'Other Equipment', icon: <Plus className="w-4 h-4 mr-2" /> },
];

export function ProductForm({ open, onOpenChange, onProductAdded }: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'Used - Good',
    location: '',
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews].slice(0, 8));
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = [...previews];
    const newImages = [...images];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    setPreviews(newPreviews);
    setImages(newImages);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get authentication token
      const tokens = localStorage.getItem('tokens');
      if (!tokens) {
        alert('Please log in to create a listing.');
        return;
      }

      const parsedTokens = JSON.parse(tokens);
      const accessToken = parsedTokens.access;

      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('location', formData.location);
      
      // Add the first image if available
      if (images.length > 0) {
        formDataToSend.append('image', images[0]);
      }

      // Submit to backend API
      const response = await fetch('http://localhost:8000/api/equipment/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create listing');
      }

      const result = await response.json();
      console.log('Equipment listed successfully:', result);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: 'Used - Good',
        location: '',
      });
      setImages([]);
      setPreviews([]);
      
      // Close the form
      onOpenChange(false);
      
      // Call the callback if provided
      if (onProductAdded) {
        onProductAdded();
      }
      
      // Show success message
      alert('Your equipment has been listed successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`There was an error submitting your listing: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">Sell Farming Equipment</DialogTitle>
          <p className="text-sm text-gray-500">Fill in the details of your farming equipment to list it for sale</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Equipment Photos</Label>
              <span className="text-xs text-gray-500">{previews.length}/8 photos</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {previews.length < 8 && (
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-green-500 transition-colors bg-gray-50">
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 text-center px-2">Add Photo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">First photo will be the main display. Add up to 8 photos.</p>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">Equipment Title*</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., John Deere 5050D Tractor"
                className="py-2 px-3 border-gray-300 focus:ring-green-500 focus:border-green-500"
                required
              />
              <p className="text-xs text-gray-500">Include key details like brand, model, and year</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price (₹)*</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 450000"
                    min="0"
                    className="pl-8 py-2 border-gray-300 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category*</Label>
                <Select 
                  name="category"
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className="border-gray-300 focus:ring-green-500 focus:border-green-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center">
                          {category.icon}
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition" className="text-sm font-medium text-gray-700">Condition*</Label>
                <Select 
                  name="condition"
                  value={formData.condition}
                  onValueChange={(value) => setFormData({...formData, condition: value})}
                >
                  <SelectTrigger className="border-gray-300 focus:ring-green-500 focus:border-green-500">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Used - Like New">Used - Like New</SelectItem>
                    <SelectItem value="Used - Good">Used - Good</SelectItem>
                    <SelectItem value="Used - Fair">Used - Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location*</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="pl-8 py-2 border-gray-300 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Punjab, India"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description*</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[120px] border-gray-300 focus:ring-green-500 focus:border-green-500"
                placeholder="Provide details about the equipment, including specifications, usage hours, maintenance history, and any included accessories"
                required
              />
              <p className="text-xs text-gray-500">Include key details like model year, hours of use, and any special features</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 px-6 py-2 text-sm font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}