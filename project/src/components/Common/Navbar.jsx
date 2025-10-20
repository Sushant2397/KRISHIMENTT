// import React, { useState } from 'react';
// import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';

// const Navbar = ({ onLoginClick, onContactClick }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-lg">AG</span>
//             </div>
//             <h1 className="text-xl font-bold text-gray-900">Smart Agriculture</h1>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <a href="#home" className="text-gray-700 hover:text-green-600 transition-all duration-300 hover:scale-105 relative group">
//               Home
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
//             </a>
//             <a href="#features" className="text-gray-700 hover:text-green-600 transition-all duration-300 hover:scale-105 relative group">
//               Features
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
//             </a>
//             <a href="#about" className="text-gray-700 hover:text-green-600 transition-all duration-300 hover:scale-105 relative group">
//               About
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
//             </a>
//             <button
//               onClick={onContactClick}
//               className="text-gray-700 hover:text-green-600 transition-all duration-300 hover:scale-105 relative group"
//             >
//               Contact Us
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
//             </button>
//             <button
//               onClick={onLoginClick}
//               className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:-translate-y-1 group"
//             >
//               <span className="group-hover:scale-105 transition-transform duration-300">Login / Sign Up</span>
//             </button>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="text-gray-700 hover:text-green-600 transition-colors duration-200"
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden bg-white border-t border-gray-200">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200">
//                 Home
//               </a>
//               <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200">
//                 Features
//               </a>
//               <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200">
//                 About
//               </a>
//               <button
//                 onClick={onContactClick}
//                 className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
//               >
//                 Contact Us
//               </button>
//               <button
//                 onClick={onLoginClick}
//                 className="block w-full mt-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
//               >
//                 Login / Sign Up
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next"; // ✅ import translation hook

const Navbar = ({ onLoginClick, onContactClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation(); // ✅ initialize translation

  // Function to change language
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">KM</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {t("Krishiment")}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="nav-link">
              {t("Home")}
            </a>
            <a href="#features" className="nav-link">
              {t("Features")}
            </a>
            <a href="#about" className="nav-link">
              {t("About")}
            </a>
            <button onClick={onContactClick} className="nav-link">
              {t("Contact")}
            </button>

            {/* 🌐 Language Switcher (moved before Login/Signup) */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
              className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="en">English</option>
              <option value="mr">मराठी</option>
              <option value="hi">हिन्दी</option>
            </select>

            <button
              onClick={onLoginClick}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:-translate-y-1 group"
            >
              <span className="group-hover:scale-105 transition-transform duration-300">
                {t("Login/Signup")}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="mobile-link">
                {t("Home")}
              </a>
              <a href="#features" className="mobile-link">
                {t("Features")}
              </a>
              <a href="#about" className="mobile-link">
                {t("About")}
              </a>
              <button onClick={onContactClick} className="mobile-link">
                {t("Contact")}
              </button>

              {/* 🌐 Mobile Language Switcher (before login/signup) */}
              <div className="mt-3 px-3">
                <select
                  onChange={(e) => changeLanguage(e.target.value)}
                  value={i18n.language}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="en">English</option>
                  <option value="mr">मराठी</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>

              <button
                onClick={onLoginClick}
                className="block w-full mt-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                {t("Login/Signup")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Shared styles */}
      <style>{`
        .nav-link {
          position: relative;
          color: #374151;
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          color: #16a34a;
          transform: scale(1.05);
        }
        .nav-link::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #16a34a;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .mobile-link {
          display: block;
          padding: 0.5rem 0.75rem;
          color: #374151;
          transition: color 0.2s;
        }
        .mobile-link:hover {
          color: #16a34a;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
