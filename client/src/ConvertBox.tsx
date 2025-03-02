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
import { useState } from 'react';

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

  const getDownloadUrl = (data: any): string => {
    let downloadLink = '';

    // Check if the format is an audio format (MP3)
    if (data.format.startsWith('MP3-')) {
        const quality = data.format.split('-')[1]; // Extract quality (128, 192, 320)
        const audioDownload = data.download_url.audio.find(
            (audio: any) => audio.quality === quality
        );
        
        if (audioDownload) {
            downloadLink = audioDownload.url;
        }
    } 
    // Check if the format is a video format (MP4)
    else if (data.format.startsWith('MP4-')) {
        const quality = data.format.split('-')[1]; // Extract quality (320, 480, 720, 1080)
        const videoDownload = data.download_url.video.find(
            (video: any) => video.quality === quality
        );
        
        if (videoDownload) {
            downloadLink = videoDownload.url;
        }
    }

    return downloadLink;
  }
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
                as={'a'}
                leftIcon={<DownloadIcon />}
                onClick={handleDownload}
                variant='solid'
                href={getDownloadUrl(data)}
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
