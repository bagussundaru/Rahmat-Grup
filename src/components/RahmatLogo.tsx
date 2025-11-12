import React from 'react';

interface RahmatLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

const RahmatLogo: React.FC<RahmatLogoProps> = ({ 
  size = 40, 
  showText = true,
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background circle */}
        <circle cx="100" cy="100" r="95" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2"/>
        
        {/* Gradient */}
        <defs>
          <linearGradient id="rGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#60A5FA', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#1E40AF', stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        {/* Letter R */}
        <g transform="translate(50, 40)">
          {/* Vertical line */}
          <rect x="15" y="0" width="15" height="90" fill="white" rx="3"/>
          
          {/* Top bump */}
          <path 
            d="M 30 0 Q 60 0 60 25 Q 60 40 30 45 L 30 45" 
            fill="none" 
            stroke="white" 
            strokeWidth="15" 
            strokeLinecap="round"
          />
          
          {/* Diagonal leg */}
          <line 
            x1="30" 
            y1="45" 
            x2="65" 
            y2="90" 
            stroke="white" 
            strokeWidth="15" 
            strokeLinecap="round"
          />
        </g>
        
        {/* Shine effect */}
        <circle cx="70" cy="70" r="20" fill="white" opacity="0.2"/>
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg text-blue-600">Kasir</span>
          <span className="text-xs text-blue-500">Rahmat Grup</span>
        </div>
      )}
    </div>
  );
};

export default RahmatLogo;
