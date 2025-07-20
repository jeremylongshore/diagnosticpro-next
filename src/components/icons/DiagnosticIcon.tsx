const DiagnosticIcon = ({ className = "w-8 h-8" }) => (
  <svg 
    className={className} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="diagnosticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
        <stop offset="50%" style={{stopColor: '#059669', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#047857', stopOpacity: 1}} />
      </linearGradient>
      <filter id="diagnostic-glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Magnifying Glass */}
    <circle cx="24" cy="24" r="12" fill="none" stroke="url(#diagnosticGradient)" strokeWidth="3" filter="url(#diagnostic-glow)"/>
    <circle cx="24" cy="24" r="8" fill="rgba(16, 185, 129, 0.2)"/>
    <path d="M34 34L44 44" stroke="url(#diagnosticGradient)" strokeWidth="4" strokeLinecap="round" filter="url(#diagnostic-glow)"/>
    
    {/* Diagnostic Elements */}
    <circle cx="20" cy="20" r="2" fill="#10b981"/>
    <circle cx="28" cy="22" r="1.5" fill="#059669"/>
    <circle cx="22" cy="28" r="1.5" fill="#047857"/>
    
    {/* Data Points */}
    <rect x="48" y="8" width="12" height="2" rx="1" fill="url(#diagnosticGradient)" opacity="0.8"/>
    <rect x="48" y="12" width="8" height="2" rx="1" fill="url(#diagnosticGradient)" opacity="0.6"/>
    <rect x="48" y="16" width="10" height="2" rx="1" fill="url(#diagnosticGradient)" opacity="0.4"/>
  </svg>
);

export default DiagnosticIcon;