import React from 'react';
import { MapPin, Users, ZoomIn, ZoomOut, Navigation } from 'lucide-react';

interface Labour {
  id: number;
  name: string;
  phone: string;
  distance: number;
  latitude: number;
  longitude: number;
}

interface LabourMapProps {
  latitude: number;
  longitude: number;
  radius: number;
  labours: Labour[];
  onRadiusChange: (radius: number) => void;
  className?: string;
}

const LabourMap: React.FC<LabourMapProps> = ({
  latitude,
  longitude,
  radius,
  labours,
  onRadiusChange,
  className = ''
}) => {
  const increaseRadius = () => {
    const newRadius = Math.min(radius + 5, 50);
    onRadiusChange(newRadius);
  };

  const decreaseRadius = () => {
    const newRadius = Math.max(radius - 5, 1);
    onRadiusChange(newRadius);
  };

  // Calculate relative positions for visualization
  const centerX = 200;
  const centerY = 200;
  const scale = 2; // km to pixels

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div className="w-full h-96 rounded-lg border border-gray-300 bg-gray-100 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#9CA3AF" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Center Point (Job Location) */}
        <div 
          className="absolute w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
          style={{
            left: centerX - 12,
            top: centerY - 12,
            zIndex: 10
          }}
        >
          <MapPin className="h-3 w-3 text-white" />
        </div>

        {/* Radius Circle */}
        <div 
          className="absolute border-2 border-blue-500 rounded-full opacity-30"
          style={{
            left: centerX - (radius * scale),
            top: centerY - (radius * scale),
            width: radius * scale * 2,
            height: radius * scale * 2,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
          }}
        />

        {/* Labour Markers */}
        {labours.map((labour, index) => {
          // Calculate relative position (simplified for demo)
          const angle = (index * 360) / Math.max(labours.length, 1);
          const distance = Math.min(labour.distance * scale, radius * scale * 0.8);
          const x = centerX + Math.cos(angle * Math.PI / 180) * distance;
          const y = centerY + Math.sin(angle * Math.PI / 180) * distance;

          return (
            <div
              key={labour.id}
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"
              style={{
                left: x - 8,
                top: y - 8,
                zIndex: 5
              }}
              title={`${labour.name} - ${labour.distance}km`}
            />
          );
        })}

        {/* Coordinates Display */}
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded px-2 py-1 text-xs text-gray-600">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </div>
      </div>
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
        <button
          onClick={increaseRadius}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          title="Increase radius"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={decreaseRadius}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          title="Decrease radius"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Job Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Available Labours</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
            <span>Search Radius</span>
          </div>
        </div>
      </div>

      {/* Labour Count Display */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-500" />
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {labours.length} Labours Found
            </div>
            <div className="text-sm text-gray-600">
              Within {radius}km radius
            </div>
          </div>
        </div>
      </div>

      {/* Labour List */}
      {labours.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <h4 className="font-semibold text-gray-900 mb-2">Nearby Labours</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {labours.map(labour => (
              <div key={labour.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{labour.name}</div>
                  <div className="text-gray-600">{labour.phone}</div>
                </div>
                <div className="text-blue-600 font-medium">
                  {labour.distance}km
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Navigation className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Uber-like Labour Matching</p>
            <p className="mt-1">
              This map shows available labours in your area. The blue circle represents your search radius. 
              If no labours are found, the radius will automatically expand to find more workers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourMap;
