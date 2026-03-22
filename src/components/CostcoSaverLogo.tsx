interface CostcoSaverLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const red = "#E31837";
const blue = "#005DAA";

const CostcoSaverLogo = ({ width = 260, height = 60, className = '' }: CostcoSaverLogoProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 96 64"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="CostcoSaver logo"
    role="img"
  >
    <text
      x="-2"
      y="54"
      fill={red}
      fontFamily="'Avenir Next', 'Helvetica Neue', Arial, sans-serif"
      fontSize="60"
      fontStyle="italic"
      fontWeight="800"
      letterSpacing="-6"
    >
      C
    </text>
    <text
      x="41"
      y="54"
      fill={blue}
      fontFamily="'Avenir Next', 'Helvetica Neue', Arial, sans-serif"
      fontSize="60"
      fontStyle="italic"
      fontWeight="800"
      letterSpacing="-6"
    >
      S
    </text>
  </svg>
);

export default CostcoSaverLogo;
