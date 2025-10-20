// import React from 'react';
// import { 
//   Search, 
//   Menu, 
//   X, 
//   User, 
//   Shield, 
//   Bell, 
//   LogOut, 
//   Home, 
//   FileText, 
//   ShoppingCart, 
//   Users, 
//   BarChart2, 
//   Clock,
//   ChevronRight,
//   ChevronDown
// } from 'lucide-react';
// import { Link, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';

// const Sidebar = ({ isOpen, onClose }) => {
//   const location = useLocation();
//   const [openSubmenu, setOpenSubmenu] = React.useState(null);

//   const menuItems = [
//     { 
//       title: 'Dashboard', 
//       icon: <Home size={20} />, 
//       path: '/dashboard',
//       submenu: [],
//       description: ''
//     },
//     { 
//       title: 'Government Schemes', 
//       icon: <FileText size={20} />, 
//       path: '/schemes',
//       submenu: [],
//       description: ''
//     },
//     { 
//       title: 'Equipment Marketplace', 
//       icon: <ShoppingCart size={20} />, 
//       path: '/equipment',
//       submenu: [
//         { 
//           title: 'Buy Equipment', 
//           path: '/equipment/buy',
//           description: 'Browse and purchase agricultural equipment'
//         },
//         { 
//           title: 'Sell Equipment', 
//           path: '/equipment/sell',
//           description: 'List your equipment for sale'
//         }
//       ]
//     },
//     { 
//       title: 'Worker Management', 
//       icon: <Users size={20} />, 
//       path: '/workers',
//       submenu: [
//         { 
//           title: 'Applications', 
//           path: '/workers/applications',
//           description: ''
//         },
//         { 
//           title: 'Post Jobs', 
//           path: '/workers/post-job',
//           description: ''
//         }
//       ]
//     },
//     { 
//       title: 'Market Prices', 
//       icon: <BarChart2 size={20} />, 
//       path: '/market-prices',
//       submenu: [],
//       description: ''
//     },
//     { 
//       title: 'Notifications', 
//       icon: <Bell size={20} />, 
//       path: '/notifications',
//       submenu: [],
//       description: ''
//     },
//     { 
//       title: 'History', 
//       icon: <Clock size={20} />, 
//       path: '/history',
//       submenu: [],
//       description: ''
//     },
//   ];

//   const toggleSubmenu = (index) => {
//     setOpenSubmenu(openSubmenu === index ? null : index);
//   };

//   const isActive = (path) => {
//     // For exact matches (like dashboard)
//     if (path === '/dashboard') {
//       return location.pathname === path;
//     }
//     // For nested routes (like /equipment/*)
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <aside 
//       className={cn(
//         "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
//         isOpen ? 'translate-x-0' : '-translate-x-full'
//       )}
//       aria-label="Sidebar"
//     >
//       <div className="h-full overflow-y-auto">
//         <div className="p-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
//         </div>
        
//         <nav className="p-2">
//           <ul className="space-y-1">
//             {menuItems.map((item, index) => (
//               <li key={item.title}>
//                 {item.submenu.length > 0 ? (
//                   <>
//                     <button
//                       onClick={() => toggleSubmenu(index)}
//                       className={cn(
//                         "w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors group",
//                         isActive(item.path) 
//                           ? "bg-blue-50 text-blue-600 font-semibold" 
//                           : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                       )}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <span className="text-gray-500">{item.icon}</span>
//                         <span>{item.title}</span>
//                       </div>
//                       <span className={cn(
//                         "transition-transform duration-200",
//                         isActive(item.path) ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"
//                       )}>
//                         {openSubmenu === index ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//                       </span>
//                     </button>
//                   </>
//                 ) : (
//                   <Link
//                     to={item.path}
//                     className={cn(
//                       "block w-full p-3 rounded-lg text-sm font-medium transition-colors",
//                       isActive(item.path) 
//                         ? "bg-blue-50 text-blue-600 font-semibold" 
//                         : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                     )}
//                     onClick={onClose}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <span className={cn("text-gray-500", isActive(item.path) && "text-blue-500")}>
//                         {item.icon}
//                       </span>
//                       <span>{item.title}</span>
//                     </div>
//                   </Link>
//                 )}
//                 {item.submenu.length > 0 && openSubmenu === index && (
//                   <ul className="ml-8 mt-1 space-y-1">
//                     {item.submenu.map((subItem) => (
//                       <li key={subItem.title}>
//                         <Link
//                           to={subItem.path}
//                           className={cn(
//                             "block p-2 pl-11 text-sm rounded-md transition-colors duration-200",
//                             isActive(subItem.path) 
//                               ? "bg-blue-50 text-blue-600 font-medium shadow-md"
//                               : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md"
//                           )}
//                           onClick={onClose}
//                         >
//                           {subItem.title}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </nav>
        
//         <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
//           <button className="flex items-center w-full p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
//             <LogOut size={18} className="mr-3 text-gray-500" />
//             Logout
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


import React from 'react';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  Shield, 
  Bell, 
  LogOut, 
  Home, 
  FileText, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  Clock,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = React.useState(null);
  const { t } = useTranslation(); // Translation hook

  const menuItems = [
    { 
      title: t('Dashboard'), 
      icon: <Home size={20} />, 
      path: '/dashboard',
      submenu: []
    },
    { 
      title: t('Government Schemes'), 
      icon: <FileText size={20} />, 
      path: '/schemes',
      submenu: []
    },
    { 
      title: t('Equipment Marketplace'), 
      icon: <ShoppingCart size={20} />, 
      path: '/equipment',
      submenu: [
        { title: t('Buy Equipment'), path: '/equipment/buy' },
        { title: t('Sell Equipment'), path: '/equipment/sell' }
      ]
    },
    { 
      title: t('Worker Management'), 
      icon: <Users size={20} />, 
      path: '/workers',
      submenu: [
        { title: t('Applications'), path: '/workers/applications' },
        { title: t('Post Jobs'), path: '/workers/post-job' }
      ]
    },
    { 
      title: t('Market Prices'), 
      icon: <BarChart2 size={20} />, 
      path: '/market-prices',
      submenu: []
    },
    { 
      title: t('Notifications'), 
      icon: <Bell size={20} />, 
      path: '/notifications',
      submenu: []
    },
    { 
      title: t('History'), 
      icon: <Clock size={20} />, 
      path: '/history',
      submenu: []
    }
  ];

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      aria-label="Sidebar"
    >
      <div className="h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{t('Admin Panel')}</h2>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={item.title}>
                {item.submenu.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors group",
                        isActive(item.path) 
                          ? "bg-blue-50 text-blue-600 font-semibold" 
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">{item.icon}</span>
                        <span>{item.title}</span>
                      </div>
                      <span className={cn(
                        "transition-transform duration-200",
                        isActive(item.path) ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"
                      )}>
                        {openSubmenu === index ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    </button>
                    {openSubmenu === index && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.title}>
                            <Link
                              to={subItem.path}
                              className={cn(
                                "block p-2 pl-11 text-sm rounded-md transition-colors duration-200",
                                isActive(subItem.path) 
                                  ? "bg-blue-50 text-blue-600 font-medium shadow-md"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md"
                              )}
                              onClick={onClose}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={cn(
                      "block w-full p-3 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.path) 
                        ? "bg-blue-50 text-blue-600 font-semibold" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                    onClick={onClose}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={cn("text-gray-500", isActive(item.path) && "text-blue-500")}>
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button className="flex items-center w-full p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <LogOut size={18} className="mr-3 text-gray-500" />
            {t('Logout')}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
