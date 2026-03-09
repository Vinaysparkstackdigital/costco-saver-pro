interface CostcoSaverLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

// Costco-inspired, copyright-safe wordmark logo
const CostcoSaverLogo = ({ width = 260, height = 60, className = '' }: CostcoSaverLogoProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 260 60"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="CostcoSaver logo"
    role="img"
  >
    {/* Bold italic red C */}
    <text
      x="0"
      y="45"
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize="48"
      fontWeight="bold"
      fontStyle="italic"
      fill="#E31837"
      letterSpacing="-2"
    >
      C
    </text>
    {/* Blue 'ostco' */}
    <text
      x="38"
      y="45"
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize="48"
      fontWeight="bold"
      fontStyle="italic"
      fill="#005DAA"
      letterSpacing="-2"
    >
      ostco
    </text>
    {/* Blue 'Saver' */}
    <text
      x="150"
      y="45"
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize="48"
      fontWeight="bold"
      fontStyle="italic"
      fill="#005DAA"
      letterSpacing="-2"
    >
      Saver
    </text>
    {/* Green dollar sign accent */}
    <text
      x="230"
      y="40"
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize="24"
      fontWeight="bold"
      fill="#10B981"
    >
      $
    </text>
  </svg>
);

export default CostcoSaverLogo;
