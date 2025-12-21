// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Common/Header';
// import DashboardCard from '../components/Common/DashboardCard';
// import { FARMER_CARDS } from '../utils/constants';
// import { getMyInquiries } from '../services/inquiryService.ts';
// import { useAuth } from '../contexts/AuthContext';

// const FarmerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [inquiries, setInquiries] = useState([]);
//   const [loadingInquiries, setLoadingInquiries] = useState(false);

//   const handleCardClick = (cardId) => {
//     switch(cardId) {
//       case 'government-schemes':
//         navigate('/schemes');
//         break;
//       case 'equipment-buy':
//         navigate('/equipment/buy');
//         break;
//       case 'equipment-sell':
//         navigate('/equipment/sell');
//         break;
//       case 'worker-applications':
//         navigate('/worker-applications');
//         break;
//       case 'upload-jobs':
//         navigate('/upload-jobs');
//         break;
//       case 'real-time-prices':
//         navigate('/market-prices');
//         break;
//       case 'notifications':
//         navigate('/notifications');
//         break;
//       case 'history':
//         navigate('/history');
//         break;
//       default:
//         console.log(`No specific route for ${cardId}`);
//     }
//   };

//   useEffect(() => {
//     const load = async () => {
//       setLoadingInquiries(true);
//       try {
//         const data = await getMyInquiries();
//         setInquiries(data);
//       } catch (e) {
//         console.error('Failed to load inquiries', e);
//       } finally {
//         setLoadingInquiries(false);
//       }
//     };
//     if (user) load();
//   }, [user]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
//       <Header />
      
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome back, {user?.name}!
//           </h1>
//           <p className="text-gray-600">
//             Manage your farm operations and connect with the agricultural community.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {FARMER_CARDS.map((card) => (
//             <DashboardCard
//               key={card.id}
//               card={card}
//               onClick={handleCardClick}
//             />
//           ))}
//         </div>

//         <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
//               <h3 className="text-lg font-semibold mb-2">Active Jobs</h3>
//               <p className="text-2xl font-bold">12</p>
//             </div>
//             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
//               <h3 className="text-lg font-semibold mb-2">Applications</h3>
//               <p className="text-2xl font-bold">45</p>
//             </div>
//             <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
//               <h3 className="text-lg font-semibold mb-2">Equipment Listed</h3>
//               <p className="text-2xl font-bold">8</p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold text-gray-900">Leads (Buyer Inquiries)</h2>
//             {loadingInquiries && <span className="text-sm text-gray-500">Loading...</span>}
//           </div>
//           {inquiries.length === 0 && !loadingInquiries ? (
//             <p className="text-gray-600">No inquiries yet.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-left text-sm">
//                 <thead>
//                   <tr className="text-gray-600">
//                     <th className="py-2 pr-4">Date</th>
//                     <th className="py-2 pr-4">Equipment</th>
//                     <th className="py-2 pr-4">Buyer</th>
//                     <th className="py-2 pr-4">Email</th>
//                     <th className="py-2 pr-4">Phone</th>
//                     <th className="py-2 pr-4">Message</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {inquiries.map((inq) => (
//                     <tr key={inq.id} className="border-t">
//                       <td className="py-2 pr-4">{new Date(inq.created_at).toLocaleString()}</td>
//                       <td className="py-2 pr-4">{inq.equipment_title || inq.equipment}</td>
//                       <td className="py-2 pr-4">{inq.buyer_name}</td>
//                       <td className="py-2 pr-4">
//                         <a className="text-blue-600 hover:underline" href={`mailto:${inq.buyer_email}`}>{inq.buyer_email}</a>
//                       </td>
//                       <td className="py-2 pr-4">
//                         {inq.buyer_phone ? <a className="text-blue-600 hover:underline" href={`tel:${inq.buyer_phone}`}>{inq.buyer_phone}</a> : '—'}
//                       </td>
//                       <td className="py-2 pr-4 max-w-md truncate" title={inq.message}>{inq.message}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default FarmerDashboard;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/Common/DashboardCard';
import { FARMER_CARDS } from '../utils/constants';
import { getMyInquiries } from '../services/inquiryService.ts';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const handleCardClick = (cardId) => {
    switch (cardId) {
      case 'government-schemes': navigate('/schemes'); break;
      case 'equipment-buy': navigate('/equipment/buy'); break;
      case 'equipment-sell': navigate('/equipment/sell'); break;
      case 'worker-applications': navigate('/worker-applications'); break;
      case 'upload-jobs': navigate('/upload-jobs'); break;
      case 'real-time-prices': navigate('/market-prices'); break;
      case 'notifications': navigate('/notifications'); break;
      case 'history': navigate('/history'); break;
      default: console.log(`No route defined for ${cardId}`);
    }
  };

  useEffect(() => {
    const loadInquiries = async () => {
      setLoadingInquiries(true);
      try {
        const data = await getMyInquiries();
        setInquiries(data);
      } catch (error) {
        console.error('Failed to load inquiries', error);
      } finally {
        setLoadingInquiries(false);
      }
    };
    if (user) loadInquiries();
  }, [user]);

  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-green-100 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('Welcome back')}, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {t('Manage your farm operations and connect with the agricultural community.')}
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FARMER_CARDS.map((card) => (
            <DashboardCard
              key={card.id}
              card={{
                ...card,
                title: t(card.titleKey),
                description: t(card.descriptionKey)
              }}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Quick Stats')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">{t('Active Jobs')}</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">{t('Applications')}</h3>
              <p className="text-2xl font-bold">45</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">{t('Equipment Listed')}</h3>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>

        {/* Buyer Inquiries */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{t('Leads')}</h2>
            {loadingInquiries && <span className="text-sm text-gray-500">{t('Loading..')}</span>}
          </div>
          {inquiries.length === 0 && !loadingInquiries ? (
            <p className="text-gray-600">{t('No inquiries yet.')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-600">
                    <th className="py-2 pr-4">{t('date')}</th>
                    <th className="py-2 pr-4">{t('equipment')}</th>
                    <th className="py-2 pr-4">{t('buyer')}</th>
                    <th className="py-2 pr-4">{t('email')}</th>
                    <th className="py-2 pr-4">{t('phone')}</th>
                    <th className="py-2 pr-4">{t('message')}</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="border-t">
                      <td className="py-2 pr-4">{new Date(inq.created_at).toLocaleString()}</td>
                      <td className="py-2 pr-4">{inq.equipment_title || inq.equipment}</td>
                      <td className="py-2 pr-4">{inq.buyer_name}</td>
                      <td className="py-2 pr-4">
                        <a className="text-blue-600 hover:underline" href={`mailto:${inq.buyer_email}`}>{inq.buyer_email}</a>
                      </td>
                      <td className="py-2 pr-4">
                        {inq.buyer_phone ? <a className="text-blue-600 hover:underline" href={`tel:${inq.buyer_phone}`}>{inq.buyer_phone}</a> : '—'}
                      </td>
                      <td className="py-2 pr-4 max-w-md truncate" title={inq.message}>{inq.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
