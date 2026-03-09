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
      viewBox="0 0 100 100"
      className={`${sizeMap[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#E8F3FF" stroke="#2563EB" strokeWidth="2" />

      {/* Warehouse building shape - represents Costco warehouse */}
      <path
        d="M 30 65 L 30 35 L 50 25 L 70 35 L 70 65"
        fill="#D4A574"
        stroke="#B8860B"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Roof accents */}
      <line x1="40" y1="45" x2="60" y2="45" stroke="#B8860B" strokeWidth="1.5" />
      <line x1="42" y1="52" x2="58" y2="52" stroke="#B8860B" strokeWidth="1.5" />

      {/* Door/entrance */}
      <rect x="45" y="55" width="10" height="12" fill="#8B6914" rx="1" />

      {/* Dollar sign - represents savings/refunds */}
      <g transform="translate(75, 30)">
        {/* Circle background for dollar sign */}
        <circle cx="0" cy="0" r="10" fill="#10B981" />

        {/* Dollar sign */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="14"
          fontWeight="bold"
          fill="white"
          fontFamily="Arial, sans-serif"
        >
          $
        </text>
      </g>

      {/* Upward arrow - represents growth/savings increase */}
      <g transform="translate(75, 30)\">
        <path
          d="M 0 -5 L 0 3 M -2.5 1 L 0 3 L 2.5 1"
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
