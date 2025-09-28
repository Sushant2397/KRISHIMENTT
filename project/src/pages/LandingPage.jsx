import React, { useState } from 'react';
import { ArrowRight, Users, Tractor, TrendingUp, Shield, Clock, Award, Sparkles } from 'lucide-react';
import Navbar from '../components/Common/Navbar';
import ContactModal from '../components/Common/ContactModal';

const LandingPage = ({ onGetStarted }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: 'Connect Farmers & Workers',
      description: 'Bridge the gap between farmers and agricultural workers with our smart matching system.'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Market Prices',
      description: 'Stay updated with live market prices for crops, grains, and vegetables.'
    },
    {
      icon: Shield,
      title: 'Government Schemes',
      description: 'Access information about government agricultural schemes and subsidies.'
    },
    {
      icon: Clock,
      title: 'Equipment Marketplace',
      description: 'Buy and sell agricultural equipment with ease and transparency.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Farmers' },
    { number: '25,000+', label: 'Agricultural Workers' },
    { number: '500+', label: 'Equipment Listed' },
    { number: '98%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onLoginClick={onGetStarted}
        onContactClick={() => setIsContactModalOpen(true)}
      />

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-green-50 via-blue-50 to-green-100 py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <div className="flex justify-center mb-6">
              <div className="animate-bounce">
                <Sparkles className="text-green-500 w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Smart Agriculture
              <span className="block text-green-600 animate-fade-in-up animation-delay-300">Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
              Connecting farmers and agricultural workers through technology. 
              Access government schemes, real-time market prices, and equipment marketplace all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-900">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center space-x-2 group"
              >
                <span>Get Started</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2 transform transition-all duration-500 group-hover:scale-125 group-hover:text-green-700">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium transition-colors duration-300 group-hover:text-gray-800">
                  {stat.label}
                </div>
                <div className="w-0 h-0.5 bg-green-500 mx-auto mt-2 transition-all duration-500 group-hover:w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Floating Animation Elements */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-green-300 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-32 right-20 w-3 h-3 bg-blue-300 rounded-full animate-ping opacity-40 animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-40 animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
              We provide comprehensive solutions for modern agriculture with cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-3 group animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <feature.icon size={24} className="text-white transition-all duration-300 group-hover:scale-125" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-green-600">
                  {feature.title}
                </h3>
                <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  {feature.description}
                </p>
                <div className="w-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 mt-4 transition-all duration-500 group-hover:w-full rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 animate-fade-in-left">
                Empowering Agriculture Through Technology
              </h2>
              <p className="text-lg text-gray-600 mb-6 animate-fade-in-left animation-delay-300">
                Our platform bridges the gap between traditional farming and modern technology. 
                We connect farmers with skilled workers, provide access to government schemes, 
                and offer real-time market insights to help make informed decisions.
              </p>
              <div className="space-y-4 animate-fade-in-left animation-delay-600">
                <div className="flex items-center space-x-3">
                  <Award className="text-green-600 animate-pulse" size={20} />
                  <span className="text-gray-700">Trusted by thousands of farmers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="text-green-600 animate-pulse animation-delay-500" size={20} />
                  <span className="text-gray-700">Secure and reliable platform</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="text-green-600 animate-pulse animation-delay-1000" size={20} />
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 animate-fade-in-right transform hover:scale-105 transition-all duration-500">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group">
                  <Tractor className="text-green-600 mb-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" size={32} />
                  <h4 className="font-semibold text-gray-900">For Farmers</h4>
                  <p className="text-sm text-gray-600">Manage operations, find workers, access schemes</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group animation-delay-300">
                  <Users className="text-blue-600 mb-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" size={32} />
                  <h4 className="font-semibold text-gray-900">For Workers</h4>
                  <p className="text-sm text-gray-600">Find jobs, build reputation, grow career</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-green-600 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-white/10 rounded-full animate-spin-slow animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/15 rounded-full animate-spin-slow animation-delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in-up relative z-10">
            Ready to Transform Your Agricultural Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-300 relative z-10">
            Join thousands of farmers and workers who are already benefiting from our platform.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:-translate-y-2 inline-flex items-center space-x-2 group animate-fade-in-up animation-delay-600 relative z-10"
          >
            <span>Start Your Journey</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AG</span>
                </div>
                <h3 className="text-lg font-bold">Smart Agriculture</h3>
              </div>
              <p className="text-gray-400">
                Connecting farmers and workers through innovative technology solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>For Farmers</li>
                <li>For Workers</li>
                <li>Equipment Marketplace</li>
                <li>Government Schemes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+91 98765 43210</li>
                <li>support@smartagriculture.com</li>
                <li>123 Agriculture Hub</li>
                <li>Green Valley, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Smart Agriculture Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;