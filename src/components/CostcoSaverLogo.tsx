interface CostcoSaverLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CostcoSaverLogo = ({ size = 'md', className = '' }: CostcoSaverLogoProps) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <svg
      viewBox="0 0 120 120"
      className={`${sizeMap[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle Background */}
      <circle cx="60" cy="60" r="56" fill="#F0F7FF" stroke="#2563EB" strokeWidth="2" />

      {/* Inner Circle for definition */}
      <circle cx="60" cy="60" r="52" fill="none" stroke="#E0ECFF" strokeWidth="1" />

      {/* Letter C */}
      <path
        d="M 35 45 Q 35 35 45 35 L 50 35 Q 55 35 55 40 L 55 80 Q 55 85 50 85 L 45 85 Q 35 85 35 75"
        fill="none"
        stroke="#2563EB"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Letter S */}
      <path
        d="M 65 40 Q 65 35 75 35 Q 83 35 83 42 Q 83 48 75 50 Q 65 52 65 58 Q 65 65 75 65 Q 83 65 83 72 Q 83 82 72 85 Q 65 85 65 80"
        fill="none"
        stroke="#2563EB"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dollar Sign Accent - Green */}
      <g transform="translate(60, 105)">
        <circle cx="0" cy="0" r="8" fill="#10B981" opacity="0.9" />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12"
          fontWeight="bold"
          fill="white"
          fontFamily="Arial, sans-serif"
        >
          $
        </text>
      </g>

      {/* Upward Arrow Accent */}
      <g transform="translate(95, 60)">
        <circle cx="0" cy="0" r="8" fill="#10B981" opacity="0.9" />
        <path
          d="M 0 -3 L 0 3 M -2 1.5 L 0 3.5 L 2 1.5"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default CostcoSaverLogo;
