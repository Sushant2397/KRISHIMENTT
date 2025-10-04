import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EquipmentDetailModal } from '../components/Products/EquipmentDetailModal';
import { fetchEquipment } from '../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/Common/ui/button';

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

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEquipment = async () => {
      if (!id) {
        setError('Equipment ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchEquipment();
        const equipmentList = response.data;
        
        // Find the equipment with the matching ID
        const foundEquipment = equipmentList.find((item: any) => item.id.toString() === id);
        
        if (foundEquipment) {
          const equipmentData: Equipment = {
            id: foundEquipment.id.toString(),
            title: foundEquipment.title,
            description: foundEquipment.description,
            price: parseFloat(foundEquipment.price),
            category: foundEquipment.category,
            condition: foundEquipment.condition,
            location: foundEquipment.location,
            images: foundEquipment.image_url ? [foundEquipment.image_url] : [],
            postedDate: foundEquipment.posted_date,
            seller: {
              name: foundEquipment.seller_name || 'Anonymous',
              rating: foundEquipment.seller_rating || 0
            }
          };
          setEquipment(equipmentData);
        } else {
          setError('Equipment not found');
        }
      } catch (err) {
        console.error('Failed to fetch equipment:', err);
        setError('Failed to load equipment details');
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading equipment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Equipment Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The equipment you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/equipment/buy')} className="bg-green-600 hover:bg-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Equipment List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/equipment/buy')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Equipment List
        </Button>
      </div>
      
      <EquipmentDetailModal
        equipment={equipment}
        isOpen={true}
        onClose={() => navigate('/equipment/buy')}
      />
    </div>
  );
}
