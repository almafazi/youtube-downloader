import { ChevronDownIcon, DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  Image,
  Grid,
  useColorModeValue,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { formatDownloadLabel, formats } from './utils/helpers';
import { useEffect, useState } from 'react';

interface Props {
  data: any;
  chooseFormat: (data: any) => void;
}
export default function ConvertBox(props: Props) {
  const { data, chooseFormat } = props;
  const [isDownloading, setIsDownloading] = useState(false); // State untuk mengontrol teks tombol

  const handleDownload = () => {
    setIsDownloading(true); // Set state menjadi true untuk menampilkan "Downloading..."
    chooseFormat(data);

    setTimeout(() => {
      setIsDownloading(false);
    }, 10000); // 10 detik
  };

  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = '//hostileconductive.com/53/9b/36/539b36fb48616508ae79b6d45317cdf5.js';
    script.type = 'text/javascript';
    script.async = true;

    // Append script to body
    document.body.appendChild(script);

    // Optional: Clean up script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <Box
      borderRadius="lg"
      transition="all .2s ease-in-out"
      bgColor={useColorModeValue('gray.100', 'gray.600')}
      m="5"
      p="3"
      _hover={{
        background: useColorModeValue('gray.200', 'gray.700'),
      }}
    >
        <Box>
          <Grid alignItems="center" templateColumns={{ base: '1fr', md: 'auto 1fr' }} gap={4} flexDirection={'column'}>
            <Image
              borderRadius="sm"
              src={data.thumbnail_url}
              alt={`Thumbnail of ${data.data?.title}`}
              width={{ base: '100%', md: 'auto' }} // Adjust width for mobile
            />
            <Box p="0.5">
              <Heading size="sm">{data.data?.title}</Heading>
              <Text mb="5" size="sm">{data.data?.author}</Text>
              <Button
                leftIcon={<DownloadIcon />}
                onClick={handleDownload}
                variant='solid'
                isLoading={isDownloading} // Menampilkan spinner saat downloading
                loadingText="Downloading..." // Teks yang ditampilkan saat downloading
              >
                {isDownloading ? "Downloading..." : `Download ${formatDownloadLabel(data.format)}`}
              </Button>
            </Box>
          </Grid>
        </Box>
    </Box>
  );
}
