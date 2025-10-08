import React from 'react';
import { Building2 } from 'lucide-react';

const Logo = ({ size = 'default', showText = true }) => {
  const sizes = {
    small: { icon: 'w-6 h-6', text: 'text-lg', container: 'gap-2' },
    default: { icon: 'w-8 h-8', text: 'text-2xl', container: 'gap-3' },
    large: { icon: 'w-12 h-12', text: 'text-4xl', container: 'gap-4' }
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <div className={`flex items-center ${currentSize.container}`}>
      {/* Placeholder logo - Replace the src with your actual logo */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg opacity-20 blur-sm"></div>
        <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2 shadow-lg">
          <Building2 className={`${currentSize.icon} text-white`} />
        </div>
      </div>
      {showText && (
        <div>
          <h1 className={`${currentSize.text} font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent`}>
            VillaMart
          </h1>
        </div>
      )}
    </div>
  );
};

export default Logo;
