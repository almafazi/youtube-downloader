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
  Toast,
} from '@chakra-ui/react';
import { formats } from '../../utils/helpers';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useState } from 'react';
import axios from 'axios';
import { API, renderTiktokVideo } from '../../utils/API';
import { FaImage, FaPlay, FaVideo } from 'react-icons/fa';

interface Props {
  data: any;
  chooseFormat: (data: any) => void;
}
export default function ConvertBox(props: Props) {
  const { data, chooseFormat } = props;
  
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const sendVideoRequest = async () => {
      setIsLoading(true);
      try {
        const formData = {
          images: data.picker,
          audio: data.metadata?.audio,
          artist: data.metadata?.artist
        };
        const result = await renderTiktokVideo(formData);
        if (result.data?.downloadUrl) {
          window.location.href = result.data?.downloadUrl;
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Toast({
        title: 'Failed',
        description: 'Failed to download tiktok video.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error creating video:', error);
    }
  };

  const handleDownload = () => {
    if(data.status == 'picker') {
      sendVideoRequest();
    } else {
      chooseFormat(data);
    }
  };

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
        {(data.status !== "picker") &&
          <Grid alignItems="center" templateColumns={{ base: '1fr', md: 'auto 1fr' }} mb={5} gap={4} flexDirection={'column'}>
            <Image
              borderRadius="sm"
              src={data.thumbnail_url ?? data.url}
              alt={`Thumbnail`}
              maxWidth={{ base: 'none', md: '400px' }}
              width={{ base: '100%', md: 'auto' }} // Adjust width for mobile
            />
            <Box p="0.5">
              <Heading size="sm" mb="3">{data.metadata?.title}</Heading>
              <Text mb="5" size="sm">{data.metadata?.artist}</Text>
              <Button leftIcon={<DownloadIcon />} 
                loadingText="Downloading..."
                isLoading={isLoading}
                as="a"
  target="_blank"
                href={data.thumbnail_url ?? data.url}
                variant='solid'>
                {data.format == 'MP4' ? 'Download' : 'Download MP3' }
              </Button>
            </Box>
          </Grid>}
          {data.picker && <>
          <Heading as="h3" mt="2" fontSize='xl'>
            Download Gallery
          </Heading>
          <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4} mt={5}>
          {data.picker.map((image: any, index: number) => (
            <Box key={index} position="relative">
              <Image
                src={image.thumb} // Use the actual image URL from data.picker
                alt={`Gallery image ${index + 1}`}
                borderRadius="md"
                width="100%"
                height="200px" // Set a fixed height for uniformity
                objectFit="cover" // Ensure the image covers the container while maintaining aspect ratio
                cursor="pointer"
                onClick={() => {
                  setCurrentIndex(index);
                }}
              />
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  pointerEvents="none" // Prevent interaction with the icon
                  zIndex={1}
                >
                  {image.type === "video" ? 
                    <FaVideo fontSize="2xl" color="white" /> :
                    <FaImage fontSize="2xl" color="white" />
                  }
                </Box>
              <a
                href={image.url} // The URL of the image
                target="_blank" // Open in a new tab
                rel="noopener noreferrer" // Security best practice
              >
                <Button
                  leftIcon={<DownloadIcon />}
                  position="absolute"
                  bottom="5px"
                  left="50%" // Center horizontally
                  transform="translateX(-50%)" // Shift left by half its width to center it
                  variant="solid"
                  colorScheme="blue"
                  width="90%"
                  size="xs" // Set the button size to small
                >
                  Download
                </Button>
              </a>
            </Box>
          ))}

          </Grid></>}
        </Box>
        
        {/* Lightbox for image preview */}
        {data.picker &&<Lightbox
          slides={data.picker.map((image: any) => ({
            src: image.url, // Use the actual image URL for the lightbox
            alt: `Gallery image`, // You can adjust the alt text as needed
            width: 3840, // Adjust based on your image size
            height: 2560, // Adjust based on your image size
          }))}
          index={currentIndex}
          open={currentIndex >= 0}
          close={() => setCurrentIndex(-1)}
        />}
    </Box>
  );
}
