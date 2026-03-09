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
    viewBox="0 0 100 60"
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
      letterSpacing="-4"
    >
      C
    </text>
    {/* Bold italic blue S */}
    <text
      x="42"
      y="45"
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize="48"
      fontWeight="bold"
      fontStyle="italic"
      fill="#005DAA"
      letterSpacing="-4"
    >
      S
    </text>
  </svg>
);

export default CostcoSaverLogo;
