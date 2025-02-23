import { DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  Image,
  Grid,
  useColorModeValue,
  Text,
  Button,
  Progress,
  Spinner,
  Toast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface Props {
  data: any;
  chooseFormat: (data: any) => void;
}

export default function ConvertBox(props: Props) {
  const { data, chooseFormat } = props;

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false); // Loading state (waiting for server)
  const [isDownloading, setIsDownloading] = useState(false); // Downloading state (streaming file)
  const [activeUrl, setActiveUrl] = useState<string | null>(null); // Track which URL is being downloaded
  const [bytesDownloaded, setBytesDownloaded] = useState(0); // Track total bytes downloaded

  // Utility function to format bytes into KB, MB, or GB
  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    } else if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${bytes} B`;
    }
  };

  // Utility function to extract filename and extension from URL or Content-Disposition header
  // Utility function to extract filename and extension from Content-Disposition header
  const getFilenameFromContentDisposition = (contentDisposition: string) => {
    // Extract the filename from the header
    let filename = '';

    // Check for the `filename*` field (UTF-8 encoded)
    const filenameStarMatch = contentDisposition.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
    if (filenameStarMatch && filenameStarMatch[1]) {
      filename = decodeURIComponent(filenameStarMatch[1]); // Decode URL-encoded characters
    } else {
      // Fallback to the `filename` field
      const filenameMatch = contentDisposition.match(/filename="([^"]+)"/i);
      if (filenameMatch && filenameMatch[1]) {
        filename = decodeURIComponent(filenameMatch[1]); // Decode URL-encoded characters
      }
    }

    // Extract the extension from the filename
    const extension = filename.split('.').pop() || ''; // Get the last part after the last dot

    return { filename, extension };
  };


  const handleDownload = async (url: string) => {
    if (isDownloading || isLoading) {
      return;
    }
    setIsLoading(true); // Start loading state (waiting for server)
    setActiveUrl(url); // Set the active URL being downloaded
    setBytesDownloaded(0); // Reset bytes downloaded
    data.download_url = url;
    chooseFormat(data);
    try {
      // Fetch the URL
      const response = await fetch(url);
  
      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
  
      // Extract filename and extension from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'media-file'; // Default filename
      let extension = ''; // Default extension
  
      if (contentDisposition) {
        const { filename: extractedFilename, extension: extractedExtension } =
          getFilenameFromContentDisposition(contentDisposition);
        filename = extractedFilename;
        extension = extractedExtension;
      }
  
      // Start downloading state
      setIsLoading(false);
      setIsDownloading(true);
  
      // Convert the response to a ReadableStream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get reader from response body');
      }
  
      // Create a Blob to store the downloaded chunks
      const chunks: Uint8Array[] = [];
      let receivedLength = 0; // Track total bytes received
  
      while (true) {
        const { done, value } = await reader.read();
  
        if (done) {
          break; // Download complete
        }
  
        // Add the received chunk to the chunks array
        chunks.push(value);
        receivedLength += value.length;
  
        // Update the total bytes downloaded
        setBytesDownloaded(receivedLength);
      }
  
      // Combine all chunks into a single Blob
      const blob = new Blob(chunks);
  
      // Create a temporary URL for the Blob
      const blobUrl = URL.createObjectURL(blob);
  
      // Trigger the download using a hidden <a> tag
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename; // Use the extracted filename
      document.body.appendChild(link);
      link.click();
  
      // Clean up the temporary URL
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
  
      // Reset states after download
      setIsDownloading(false);
      setActiveUrl(null);
    } catch (error) {

      Toast({
        title: 'Failed',
        description: 'Failed to download file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Download failed:', error);
      setIsLoading(false); // Stop loading state on error
      setIsDownloading(false);
      setActiveUrl(null);
    }
  };
  

  function typedEntries<T>(obj: { [key: string]: T }): [string, T][] {
    return Object.entries(obj);
  }

//   const sendVideoRequest = async () => {
//     setIsLoading(true);
//     try {
//       const formData = {
//         images: data.picker,
//         audio: data.metadata?.audio,
//         artist: data.metadata?.artist
//       };
//       const result = await renderTiktokVideo(formData);
//       if (result.data?.downloadUrl) {
//         window.location.href = result.data?.downloadUrl;
//     }

//     setIsLoading(false);
//   } catch (error) {
//     setIsLoading(false);
//     Toast({
//       title: 'Failed',
//       description: 'Failed to download tiktok video.',
//       status: 'error',
//       duration: 3000,
//       isClosable: true,
//     });
//     console.error('Error creating video:', error);
//   }
// };

// const handleDownload = () => {
//   if(data.status == 'picker') {
//     sendVideoRequest();
//   } else {
 //   chooseFormat(data);
//   }
// };

const truncateDescription = (text: string, maxLength: number = 100) => {
  if (!text) return '';

  if (text.length <= maxLength) {
    return text;
  }

  // Trim to max characters and add ellipsis
  return `${text.slice(0, maxLength).trim()}...`;
};

  return (
    <Box
      borderRadius="lg"
      transition="all .2s ease-in-out"
      bgColor={useColorModeValue('gray.100', 'gray.600')}
      m="5"
      py="8"
      px={4}
      _hover={{
        background: useColorModeValue('gray.200', 'gray.700'),
      }}
    >
      <Box>
      <VStack 
  align="center"  // Center align the items horizontally
  spacing={4}     // Consistent spacing between items
  width="100%"    // Ensure full width
>          <Image
            borderRadius="sm"
            src={data.thumbnail_url}
            objectFit="contain"
            alt={`Thumbnail of ${data.title}`}
            maxHeight={"250px"}
            width={{ base: '100%', md: 'auto' }} // Adjust width for mobile
          />
          <Box p="0.5">
            <Heading size="sm" mb="3">{data.artist}</Heading>
            <Text mb="5" size="sm">{truncateDescription(data.description)}</Text>
            {data.status === 'picker' ? (
              // If data.status is "picker", show only the slideshow download button
              <Box mb="4">
                <Button
                  as={'a'}
                  target="_blank"
                  isDisabled={isDownloading || isLoading} // Disable when downloading
                  leftIcon={
                    isLoading && activeUrl === data.download_slideshow_link ? (
                      <Spinner size="sm" />
                    ) : (
                      <DownloadIcon />
                    )
                  }
                  isLoading={
                    (isLoading || isDownloading) && activeUrl === data.download_slideshow_link
                  }
                  loadingText={
                    isLoading && activeUrl === data.download_slideshow_link
                      ? 'Converting to Video...'
                      : `Downloading... ${formatBytes(bytesDownloaded)}`
                  }
                  onClick={() => handleDownload(data.download_slideshow_link)}
                  width="100%"
                  variant="solid"
                  mt="1"
                  mb="3"
                >
                  {isLoading && activeUrl === data.download_slideshow_link
                    ? 'Converting to Video...'
                    : isDownloading && activeUrl === data.download_slideshow_link
                    ? `Downloading... ${formatBytes(bytesDownloaded)}`
                    : 'Download Slideshow'}
                </Button>
                {isDownloading && activeUrl === data.download_slideshow_link && (
                  <Progress
                    mt="2"
                    size="sm"
                    colorScheme="blue"
                    isIndeterminate // Show indeterminate progress bar
                  />
                )}
                {/* New MP3 Download Button */}
                <Button
                  as={'a'}
                  target="_blank"
                  leftIcon={
                    isLoading && activeUrl === data.download_link.mp3 ? (
                      <Spinner size="sm" />
                    ) : (
                      <DownloadIcon />
                    )
                  }
                  isLoading={
                    (isLoading || isDownloading) && activeUrl === data.download_link.mp3
                  }
                  isDisabled={isDownloading || isLoading}
                  loadingText={
                    isLoading && activeUrl === data.download_link.mp3
                      ? 'Preparing MP3...'
                      : `Downloading... ${formatBytes(bytesDownloaded)}`
                  }
                  onClick={() => handleDownload(data.download_link.mp3)}
                  width="100%"
                  variant="solid"
                  mt="1"
                >
                  {isLoading && activeUrl === data.download_link.mp3
                    ? 'Preparing MP3...'
                    : isDownloading && activeUrl === data.download_link.mp3
                    ? `Downloading... ${formatBytes(bytesDownloaded)}`
                    : 'Download MP3'}
                </Button>
                {isDownloading && activeUrl === data.download_link.mp3 && (
                  <Progress
                    mt="2"
                    size="sm"
                    colorScheme="green"
                    isIndeterminate // Show indeterminate progress bar
                  />
                )}
              </Box>
              
            ) : (
              // Otherwise, show all download links
              typedEntries<string>(data.download_link).map(([key, url]) => (
                <Box key={key} mb="4">
                  <Button
                    justifyContent="flex-start" // Optional: ensures text alignment within the button

                    as={'a'}
                    isDisabled={isDownloading || isLoading} // Disable when downloading
                    target="_blank"
                    leftIcon={
                      isLoading && activeUrl === url ? (
                        <Spinner size="sm" />
                      ) : (
                        <DownloadIcon />
                      )
                    }
                    isLoading={(isLoading || isDownloading) && activeUrl === url}
                    loadingText={
                      isLoading && activeUrl === url
                        ? 'Connecting to server...'
                        : `Downloading... ${formatBytes(bytesDownloaded)}`
                    }
                    onClick={() => handleDownload(url)}
                    width="100%"
                    variant="solid"
                    mt="1"
                  >
                    {isLoading && activeUrl === url
                      ? 'Connecting to server...'
                      : isDownloading && activeUrl === url
                      ? `Downloading... ${formatBytes(bytesDownloaded)}`
                      : `Download ${key.replace(/_/g, ' ')}`}
                  </Button>
                  {isDownloading && activeUrl === url && (
                    <Progress
                      mt="2"
                      size="sm"
                      colorScheme="blue"
                      isIndeterminate // Show indeterminate progress bar
                    />
                  )}
                </Box>
              ))
            )}
          </Box>
        </VStack>
        {data.status == "picker" && (
          <>
            <Heading as="h3" mt="8" fontSize="xl">
              Download Gallery
            </Heading>
            <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4} mt={5}>
              {data.photos.map((image: any, index: number) => (
                <Box key={index} position="relative">
                  <Image
                    src={image.url} // Use the actual image URL from data.picker
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
            </Grid>
          </>
        )}
      </Box>

      {/* Lightbox for image preview */}
      {data.status == "picker" && (
        <Lightbox
          slides={data.photos.map((image: any) => ({
            src: image.url, // Use the actual image URL for the lightbox
            alt: `Gallery image`, // You can adjust the alt text as needed
            width: 3840, // Adjust based on your image size
            height: 2560, // Adjust based on your image size
          }))}
          index={currentIndex}
          open={currentIndex >= 0}
          close={() => setCurrentIndex(-1)}
        />
      )}
    </Box>
  );
}
