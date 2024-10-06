import { Icon, Image } from '@chakra-ui/react';
interface LogoBlackProps {
  width?: string; // Optional width prop
}

const LogoBlack: React.FC<LogoBlackProps> = ({ width }) => {
  return (
    <Image
      src="/logo-light.png"
      alt="Logo"
      width={width || "100%"} // Default width is "300px" if not provided
    />
  );
};
export default LogoBlack;
