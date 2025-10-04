import { useState } from 'react';
import { ProductForm } from '../components/Products/ProductForm';
import { useNavigate } from 'react-router-dom';

export default function SellPage() {
  const [showForm, setShowForm] = useState(true);
  const navigate = useNavigate();

  const handleProductAdded = () => {
    // Redirect to the buy/sell page to see the new listing
    navigate('/equipment/buy');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sell Your Equipment</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ProductForm 
            open={showForm} 
            onOpenChange={setShowForm}
            onProductAdded={handleProductAdded}
          />
        </div>
      </div>
    </div>
  );
}
