// export const USER_ROLES = {
//   FARMER: 'farmer',
//   LABOUR: 'labour'
// };

// export const FARMER_CARDS = [
//   {
//     id: 'government-schemes',
//     title: 'Government Schemes',
//     description: 'View available government agricultural schemes and subsidies',
//     icon: 'Building2',
//     color: 'bg-blue-500',
//     hoverColor: 'hover:bg-blue-600'
//   },
//   {
//     id: 'equipment-buy',
//     title: 'Equipment to Buy',
//     description: 'Browse and purchase agricultural equipment',
//     icon: 'ShoppingCart',
//     color: 'bg-green-500',
//     hoverColor: 'hover:bg-green-600'
//   },
//   {
//     id: 'equipment-sell',
//     title: 'Equipment to Sell',
//     description: 'List your equipment for sale',
//     icon: 'DollarSign',
//     color: 'bg-yellow-500',
//     hoverColor: 'hover:bg-yellow-600'
//   },
//   {
//     id: 'worker-applications',
//     title: 'Worker Applications',
//     description: 'Review applications from agricultural workers',
//     icon: 'Users',
//     color: 'bg-purple-500',
//     hoverColor: 'hover:bg-purple-600'
//   },
//   {
//     id: 'upload-jobs',
//     title: 'Upload Jobs',
//     description: 'Post job opportunities for agricultural workers',
//     icon: 'Upload',
//     color: 'bg-indigo-500',
//     hoverColor: 'hover:bg-indigo-600'
//   },
//   {
//     id: 'real-time-prices',
//     title: 'Real-time Prices',
//     description: 'Check current market prices for crops and grains',
//     icon: 'TrendingUp',
//     color: 'bg-red-500',
//     hoverColor: 'hover:bg-red-600'
//   },
//   {
//     id: 'notifications',
//     title: 'Notifications',
//     description: 'View important updates and alerts',
//     icon: 'Bell',
//     color: 'bg-orange-500',
//     hoverColor: 'hover:bg-orange-600'
//   },
//   {
//     id: 'history',
//     title: 'History',
//     description: 'View your transaction and activity history',
//     icon: 'History',
//     color: 'bg-gray-500',
//     hoverColor: 'hover:bg-gray-600'
//   }
// ];

// export const LABOUR_CARDS = [
//   {
//     id: 'find-jobs',
//     title: 'Find Jobs',
//     description: 'Browse and apply for available agricultural jobs',
//     icon: 'Briefcase',
//     color: 'bg-blue-500',
//     hoverColor: 'hover:bg-blue-600'
//   },
//   {
//     id: 'my-applications',
//     title: 'My Applications',
//     description: 'View the status of your job applications',
//     icon: 'ClipboardList',
//     color: 'bg-green-500',
//     hoverColor: 'hover:bg-green-600'
//   },
//   {
//     id: 'government-schemes',
//     title: 'Government Schemes',
//     description: 'View available government schemes for workers',
//     icon: 'Building2',
//     color: 'bg-purple-500',
//     hoverColor: 'hover:bg-purple-600'
//   },
//   {
//     id: 'skills',
//     title: 'My Skills',
//     description: 'Manage your agricultural skills and certifications',
//     icon: 'Award',
//     color: 'bg-yellow-500',
//     hoverColor: 'hover:bg-yellow-600'
//   },
//   {
//     id: 'earnings',
//     title: 'My Earnings',
//     description: 'Track your job earnings and payments',
//     icon: 'DollarSign',
//     color: 'bg-green-600',
//     hoverColor: 'hover:bg-green-700'
//   },
//   {
//     id: 'notifications',
//     title: 'Notifications',
//     description: 'View important updates and alerts',
//     icon: 'Bell',
//     color: 'bg-red-500',
//     hoverColor: 'hover:bg-red-600'
//   }
// ];

// export const API_ENDPOINTS = {
//   LOGIN: '/auth/login/',
//   REGISTER: '/auth/register/',
//   SCHEMES: '/schemes/',
//   PRICES: '/market/prices/',
//   JOBS: '/jobs/',
//   EQUIPMENT: '/equipment/',
//   NOTIFICATIONS: '/notifications/',
//   HISTORY: '/history/'
// };




export const USER_ROLES = {
  FARMER: 'farmer',
  LABOUR: 'labour'
};

// Dashboard cards for Farmers
export const FARMER_CARDS = [
  {
    id: 'government-schemes',
    titleKey: 'government_schemes_title',       
    descriptionKey: 'government_schemes_desc',  
    icon: 'Building2',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600'
  },
  {
    id: 'equipment-buy',
    titleKey: 'equipment_buy_title',
    descriptionKey: 'equipment_buy_desc',
    icon: 'ShoppingCart',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  },
  {
    id: 'equipment-sell',
    titleKey: 'equipment_sell_title',
    descriptionKey: 'equipment_sell_desc',
    icon: 'DollarSign',
    color: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600'
  },
  {
    id: 'worker-applications',
    titleKey: 'worker_applications_title',
    descriptionKey: 'worker_applications_desc',
    icon: 'Users',
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600'
  },
  {
    id: 'upload-jobs',
    titleKey: 'upload_jobs_title',
    descriptionKey: 'upload_jobs_desc',
    icon: 'Upload',
    color: 'bg-indigo-500',
    hoverColor: 'hover:bg-indigo-600'
  },
  {
    id: 'real-time-prices',
    titleKey: 'real_time_prices_title',
    descriptionKey: 'real_time_prices_desc',
    icon: 'TrendingUp',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600'
  },
  {
    id: 'notifications',
    titleKey: 'notifications_title',
    descriptionKey: 'notifications_desc',
    icon: 'Bell',
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600'
  },
  {
    id: 'history',
    titleKey: 'history_title',
    descriptionKey: 'history_desc',
    icon: 'History',
    color: 'bg-gray-500',
    hoverColor: 'hover:bg-gray-600'
  }
];

// Dashboard cards for Labour
export const LABOUR_CARDS = [
  {
    id: 'find-jobs',
    titleKey: 'find_jobs_title',
    descriptionKey: 'find_jobs_desc',
    icon: 'Briefcase',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600'
  },
  {
    id: 'my-applications',
    titleKey: 'my_applications_title',
    descriptionKey: 'my_applications_desc',
    icon: 'ClipboardList',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  },
  {
    id: 'government-schemes',
    titleKey: 'government_schemes_title',
    descriptionKey: 'government_schemes_desc',
    icon: 'Building2',
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600'
  },
  {
    id: 'skills',
    titleKey: 'skills_title',
    descriptionKey: 'skills_desc',
    icon: 'Award',
    color: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600'
  },
  {
    id: 'earnings',
    titleKey: 'earnings_title',
    descriptionKey: 'earnings_desc',
    icon: 'DollarSign',
    color: 'bg-green-600',
    hoverColor: 'hover:bg-green-700'
  },
  {
    id: 'notifications',
    titleKey: 'notifications_title',
    descriptionKey: 'notifications_desc',
    icon: 'Bell',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600'
  }
];

export const API_ENDPOINTS = {
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  SCHEMES: '/schemes/',
  PRICES: '/market/prices/',
  JOBS: '/jobs/',
  EQUIPMENT: '/equipment/',
  NOTIFICATIONS: '/notifications/',
  HISTORY: '/history/'
};
