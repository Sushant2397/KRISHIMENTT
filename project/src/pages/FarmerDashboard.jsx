import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Common/Header';
import DashboardCard from '../components/Common/DashboardCard';
import { FARMER_CARDS } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (cardId) => {
    switch(cardId) {
      case 'government-schemes':
        navigate('/schemes');
        break;
      case 'equipment-buy':
        navigate('/equipment/buy');
        break;
      case 'equipment-sell':
        navigate('/equipment/sell');
        break;
      case 'worker-applications':
        navigate('/worker-applications');
        break;
      case 'upload-jobs':
        navigate('/upload-jobs');
        break;
      case 'real-time-prices':
        navigate('/market-prices');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      case 'history':
        navigate('/history');
        break;
      default:
        console.log(`No specific route for ${cardId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your farm operations and connect with the agricultural community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FARMER_CARDS.map((card) => (
            <DashboardCard
              key={card.id}
              card={card}
              onClick={handleCardClick}
            />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">Active Jobs</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">Applications</h3>
              <p className="text-2xl font-bold">45</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">Equipment Listed</h3>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;