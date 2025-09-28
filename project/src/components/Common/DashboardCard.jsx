import React from 'react';
import * as Icons from 'lucide-react';

const DashboardCard = ({ card, onClick }) => {
  const IconComponent = Icons[card.icon] || Icons.Square;

  return (
    <div
      onClick={() => onClick(card.id)}
      className={`
        ${card.color} ${card.hoverColor}
        p-6 rounded-xl cursor-pointer
        transform transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-xl hover:-translate-y-1
        bg-gradient-to-br from-white/10 to-transparent
        backdrop-blur-sm border border-white/20
        group relative overflow-hidden
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <IconComponent 
            size={32} 
            className="text-white transform group-hover:scale-110 transition-transform duration-300" 
          />
          <div className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white/60 transition-colors duration-300" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
          {card.title}
        </h3>
        
        <p className="text-white/80 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">
          {card.description}
        </p>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );
};

export default DashboardCard;