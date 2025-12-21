// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Common/Header';
// import DashboardCard from '../components/Common/DashboardCard';
// import { LABOUR_CARDS } from '../utils/constants';
// import { useAuth } from '../contexts/AuthContext';

// const LabourDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Add any initialization logic here
//     setLoading(false);
//   }, []);

//   const handleCardClick = (cardId) => {
//     console.log(`Clicked on ${cardId}`);
//     // Add navigation logic based on cardId
//     switch(cardId) {
//       case 'find-jobs':
//         navigate('/jobs');
//         break;
//       case 'government-schemes':
//         navigate('/schemes');
//         break;
//       case 'my-applications':
//         navigate('/my-applications');
//         break;
//       case 'skills':
//         navigate('/skills');
//         break;
//       case 'earnings':
//         navigate('/earnings');
//         break;
//       case 'notifications':
//         navigate('/notifications');
//         break;
//       // Add more cases as needed
//       default:
//         console.log(`No specific route for ${cardId}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
//       <Header />
      
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome back, {user?.name || 'Worker'}!
//           </h1>
//           <p className="text-gray-600">
//             Find job opportunities and grow your agricultural career.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {LABOUR_CARDS && LABOUR_CARDS.length > 0 ? (
//             LABOUR_CARDS.map((card) => (
//               <DashboardCard
//                 key={card.id}
//                 card={card}
//                 onClick={() => handleCardClick(card.id)}
//               />
//             ))
//           ) : (
//             <div className="col-span-full text-center py-8">
//               <p className="text-gray-500">No dashboard items available at the moment.</p>
//             </div>
//           )}
//         </div>

//         <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">Your Activity</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
//               <h3 className="text-lg font-semibold mb-2">Applications Sent</h3>
//               <p className="text-2xl font-bold">23</p>
//             </div>
//             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
//               <h3 className="text-lg font-semibold mb-2">Jobs Completed</h3>
//               <p className="text-2xl font-bold">15</p>
//             </div>
//             <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
//               <h3 className="text-lg font-semibold mb-2">Rating</h3>
//               <p className="text-2xl font-bold">4.8⭐</p>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LabourDashboard;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/Common/DashboardCard';
import { LABOUR_CARDS } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import userService from '../services/userService';
import ratingService from '../services/ratingService';
import { Star } from 'lucide-react';

const LabourDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await userService.getAvailability();
        setIsAvailable(!!res.data.is_available);
      } catch (e) {
        setIsAvailable(null);
      }
      
      // Load rating data
      try {
        const ratingRes = await ratingService.getMyAverageRating();
        setAverageRating(ratingRes.data.average_rating);
        setTotalRatings(ratingRes.data.total_ratings);
      } catch (e) {
        console.error('Failed to load rating:', e);
        setAverageRating(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleCardClick = (cardId) => {
    switch (cardId) {
      case 'find-jobs':
        navigate('/jobs');
        break;
      case 'government-schemes':
        navigate('/schemes');
        break;
      case 'my-applications':
        navigate('/my-applications');
        break;
      case 'skills':
        navigate('/skills');
        break;
      case 'earnings':
        navigate('/earnings');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      default:
        console.log(`No specific route for ${cardId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-green-100 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Availability toggle */}
        <div className="mb-6 bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">{t('Availability')}</div>
            <div className="text-lg font-semibold text-gray-900">
              {isAvailable ? t('Active and looking for jobs') : t('Inactive')}
            </div>
          </div>
          <button
            onClick={async () => {
              if (isAvailable === null) return;
              const next = !isAvailable;
              setIsAvailable(next);
              try {
                await userService.setAvailability(next);
              } catch (e) {
                // revert on error
                setIsAvailable(!next);
                alert(t('Failed to update availability'));
              }
            }}
            className={`px-4 py-2 rounded-lg text-white ${isAvailable ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}`}
            disabled={isAvailable === null}
          >
            {isAvailable ? t('Set Inactive') : t('Set Active')}
          </button>
        </div>
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('Welcome back')}, {user?.name || t('Worker')}!
          </h1>
          <p className="text-gray-600">
            {t('Find job opportunities and grow your agricultural career.')}
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {LABOUR_CARDS && LABOUR_CARDS.length > 0 ? (
            LABOUR_CARDS.map((card) => (
              <DashboardCard
                key={card.id}
                card={{
                  ...card,
                  title: t(card.titleKey),
                  description: t(card.descriptionKey),
                }}
                onClick={() => handleCardClick(card.id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">{t('No dashboard items available at the moment.')}</p>
            </div>
          )}
        </div>

        {/* Activity Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Your Activity')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">{t('Applications Sent')}</h3>
              <p className="text-2xl font-bold">23</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">{t('Jobs Completed')}</h3>
              <p className="text-2xl font-bold">15</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">{t('Rating')}</h3>
              {averageRating !== null ? (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <p className="text-sm opacity-90">
                    {totalRatings} {totalRatings === 1 ? t('rating') : t('ratings')}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm opacity-90">{t('No ratings yet')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourDashboard;
