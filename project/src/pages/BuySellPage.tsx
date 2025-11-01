import { useState, useEffect } from 'react';
import { Input } from '../components/Common/ui/input';
import { Button } from '../components/Common/ui/button';
import { Search, Plus, Tractor, Sprout, Droplet, Warehouse, Wrench, X, BarChart3 } from 'lucide-react';
import { ProductCard } from '../components/Products/ProductCard';
import { EquipmentComparisonModal } from '../components/Products/EquipmentComparisonModal';
import { createEquipmentListing, fetchEquipment } from '../services/api';
import { useTranslation } from 'react-i18next';


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

interface EquipmentFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  location: string;
  image?: File;
}

const categories = [
  { name: 'Tractors', icon: <Tractor className="h-5 w-5" /> },
  { name: 'Seeds', icon: <Sprout className="h-5 w-5" /> },
  { name: 'Irrigation', icon: <Droplet className="h-5 w-5" /> },
  { name: 'Storage', icon: <Warehouse className="h-5 w-5" /> },
  { name: 'Tools', icon: <Wrench className="h-5 w-5" /> },
  { name: 'Other', icon: <Tractor className="h-5 w-5" /> },
];

export default function BuySellPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [products, setProducts] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<EquipmentFormData>({
    title: '',
    description: '',
    price: '',
    category: 'Tractors',
    condition: 'New',
    location: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [comparisonList, setComparisonList] = useState<Equipment[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Fetch equipment listings
  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setIsLoading(true);
        const response = await fetchEquipment();
        const listings = response.data.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          description: item.description,
          price: parseFloat(item.price),
          category: item.category,
          condition: item.condition,
          location: item.location,
          images: item.image_url ? [item.image_url] : [],
          postedDate: item.posted_date,
          seller: {
            name: item.seller_name || 'Anonymous',
            rating: item.seller_rating || 0
          }
        }));
        setProducts(listings);
      } catch (err) {
        console.error('Failed to fetch equipment:', err);
        setError('Failed to load equipment listings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEquipment();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tokens = localStorage.getItem('tokens');
      if (!tokens) {
        alert('Please log in to create a listing.');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('location', formData.location);
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const response = await createEquipmentListing(formDataToSend);

      // Add the new product to the list
      const newProduct: Equipment = {
        id: response.data.id.toString(),
        title: response.data.title,
        description: response.data.description,
        price: parseFloat(response.data.price),
        category: response.data.category,
        condition: response.data.condition,
        location: response.data.location,
        images: response.data.image_url ? [response.data.image_url] : [],
        postedDate: response.data.posted_date,
        seller: {
          name: response.data.seller_name || 'Anonymous',
          rating: 0
        }
      };

      setProducts(prev => [newProduct, ...prev]);
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create listing:', error);
      alert('Failed to create listing. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'Tractors',
      condition: 'New',
      location: '',
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleAddToComparison = (equipment: Equipment) => {
    const isAlreadyAdded = comparisonList.some(item => item.id === equipment.id);
    if (!isAlreadyAdded && comparisonList.length < 4) {
      setComparisonList(prev => [...prev, equipment]);
      alert('Equipment added to comparison!');
    } else if (isAlreadyAdded) {
      alert('This equipment is already in your comparison list!');
    } else {
      alert('You can compare up to 4 items at a time!');
    }
  };

  const handleRemoveFromComparison = (equipmentId: string) => {
    setComparisonList(prev => prev.filter(item => item.id !== equipmentId));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800"> {t("Farm Equipment Marketplace")}</h1>
          <p className="text-gray-600 mt-2">  {t("Find quality farming equipment and supplies")}</p>
        </div>
        <div className="flex gap-3">
          {comparisonList.length > 0 && (
            <Button 
              variant="outline"
              onClick={() => setShowComparisonModal(true)}
              className="flex items-center"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Compare ({comparisonList.length})
            </Button>
          )}
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />  {t("List Equipment")}
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">   {t("Search")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="search"
                type="text"
                placeholder="Search for equipment..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">  {t("Category")}</label>
            <select
              id="category"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">{t("All Categories")}</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Price Range")} ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
            </label>
            <div className="flex items-center space-x-4">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <input
                type="range"
                min="0"
                max="500000"
                step="1000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-full"
              />
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToComparison={handleAddToComparison}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No equipment found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{t("List New Equipment")}</h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">{t("Title")}</label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">{t("Price")}</label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Field */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("Category")} *
        </label>
        <select
          id="category"
          name="category"
          required
          value={formData.category}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="" disabled>
            {t("Select Category")}
          </option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Condition Field */}
      <div>
        <label
          htmlFor="condition"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("Condition")} *
        </label>
        <select
          id="condition"
          name="condition"
          required
          value={formData.condition}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">{t("Select Condition")}</option>
          <option value="New">{t("New")}</option>
          <option value="Used - Like New">{t("Used - Like New")}</option>
          <option value="Used - Good">{t("Used - Good")}</option>
          <option value="Used - Fair">{t("Used - Fair")}</option>
        </select>
      </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    className="w-full"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Describe the equipment in detail..."
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Image</label>
                  <div className="mt-1 flex items-center">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Choose File
                    </label>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                  </div>
                  {previewUrl && (
                    <div className="mt-2">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  List Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Equipment Comparison Modal */}
      <EquipmentComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        onAddToComparison={handleAddToComparison}
        comparisonList={comparisonList}
        onRemoveFromComparison={handleRemoveFromComparison}
      />
    </div>
  );
}