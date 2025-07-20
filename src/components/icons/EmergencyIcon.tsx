const EmergencyIcon = ({ className = "w-8 h-8" }) => (
  <svg 
    className={className} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="emergencyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#fbbf24', stopOpacity: 1}} />
        <stop offset="50%" style={{stopColor: '#f59e0b', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#d97706', stopOpacity: 1}} />
      </linearGradient>
      <filter id="emergency-glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="lightning-glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Lightning Bolt */}
    <path 
      d="M32 4L20 28H28L24 52L44 24H34L32 4Z" 
      fill="url(#emergencyGradient)"
      filter="url(#lightning-glow)"
      stroke="#d97706"
      strokeWidth="1"
    />
    
    {/* Energy Rings */}
    <circle cx="32" cy="32" r="26" fill="none" stroke="url(#emergencyGradient)" strokeWidth="2" opacity="0.3" filter="url(#emergency-glow)"/>
    <circle cx="32" cy="32" r="30" fill="none" stroke="url(#emergencyGradient)" strokeWidth="1" opacity="0.2" filter="url(#emergency-glow)"/>
    
    {/* Spark Effects */}
    <circle cx="18" cy="18" r="1.5" fill="#fbbf24">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="46" cy="20" r="1" fill="#f59e0b">
      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="48" cy="44" r="1.5" fill="#d97706">
      <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="16" cy="46" r="1" fill="#fbbf24">
      <animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

export default EmergencyIcon;