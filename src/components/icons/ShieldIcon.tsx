const ShieldIcon = ({ className = "w-8 h-8" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
        <stop offset="50%" style={{stopColor: '#1d4ed8', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#1e40af', stopOpacity: 1}} />
      </linearGradient>
      <filter id="shield-glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path 
      d="M12 2L4 6V11C4 16.55 7.84 21.74 12 22C16.16 21.74 20 16.55 20 11V6L12 2Z" 
      fill="url(#shieldGradient)"
      filter="url(#shield-glow)"
      stroke="#1e40af"
      strokeWidth="1"
    />
    <path 
      d="M9 12L11 14L15 9.5" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default ShieldIcon;