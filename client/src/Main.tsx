import {
  Container,
  Box,
  Heading,
  VisuallyHidden,
  useColorMode,
  Button,
  useToast,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Text,
  useDisclosure,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import Features from './Features';
import FeaturesComingSoon from './FeaturesComingSoon';
import LogoBlack from './Icons/LogoBlack';
import LogoWhite from './Icons/LogoWhite';
import NothingFoundAlert from './NothingFoundAlert';
import PreviewBox from './PreviewBox';
import SelectFormat from './SelectFormat';
import Sidebar, { HistoryItem } from './Sidebar';
import Suggestions from './Suggestions';
import { fetchInfo, fetchInfoYoutube, getInfos, getSearch, getSuggestions } from './utils/API';
import { getDownloadUrl, isYtUrl } from './utils/helpers';
import { useTranslation } from 'react-i18next';
import Article from './Article';
import Search from './Search';

export default function Main() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [format, setFormat] = useState('MP3-320');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [input, setInput] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [urlFromSearch, setUrlFromSearch] = useState('');
  const [isConvertionLoading, setConvertionLoading] = useState(false);
  const [isSearchLoading, setSearchLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [pagingInfo, setPagingInfo] = useState<any>(null);
  const [error, setError] = useState(false);
  const downloadBtnRef = useRef<HTMLAnchorElement>(null);
  const [downloads, setDownloads] = useState<HistoryItem[]>([]);
  const [youtubeId, setYouTubeId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useTranslation();
  useEffect(() => {
    const storedDownloads = localStorage.getItem('downloads');
    if (storedDownloads && JSON.parse(storedDownloads)?.length > 0) {
      setDownloads(JSON.parse(storedDownloads));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('downloads', JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    if (downloadUrl.length && downloadBtnRef?.current) {
      setConvertionLoading(false);
      //window.open(downloadUrl);

      //downloadBtnRef.current.click();
    }
  }, [downloadUrl]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  function getYouTubeId(url: string) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const reset = () => {
    setError(false);
    setInput('');
    setSearchLoading(false);
    setConvertionLoading(false);
  }

  const reformatData = (data:any) => {
      return data.map((item:any)=> ({
          id: {
              videoId: item.id
          },
          snippet: {
              title: item.title,
              description: item.channelTitle,
              publishedAt: item.length.simpleText,
              thumbnails: {
                  medium: {
                      url: item.thumbnail.thumbnails[0].url
                  }
              }
          }
      }));
  };

  const fetchSuggestions2 = async (loadmore = false) => {
    setError(false);
    setSearchLoading(true);
    try {
      const { data } = await getSearch(input, pagingInfo?.nextPage, loadmore);
      setPagingInfo(data);
      
      const formattedData = reformatData(data.items);
      setSuggestions((previousSuggestions) => [
        ...previousSuggestions,
        ...formattedData,
      ]);
      
      setSearchLoading(false);
    } catch (err) {
      setError(true);
      // if (err && err.status === 403) {
      toast({
        title: t('failsearch'),
        description:
          t('failsearchdesc'),
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      // }
      setTimeout(() => {
        reset();
      }, 2000);
      console.error(err);
    }
  };

  const fetchSuggestions = async () => {
    setError(false);
    setSearchLoading(true);
    try {
      const { data } = await getSuggestions(input, pagingInfo?.nextPageToken);
      setPagingInfo(data.pagingInfo);
      setSuggestions((previousSuggestions) => [
        ...previousSuggestions,
        ...data.data,
      ]);
      setSearchLoading(false);
    } catch (err) {
      setError(true);
      // if (err && err.status === 403) {
      toast({
        title: 'YouTube Search Limit exceeded',
        description:
          'You can search again tomorrow. Just paste the URL into the searchfield. This will still works. The YouTube-API allows only a few search requests.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      // }
      setTimeout(() => {
        reset();
      }, 2000);
      console.error(err);
    }
  };

  const selectFormatAndDownload = (format: string) => {
    setFormat(format);
    if(urlFromSearch) {
      setInput(urlFromSearch)
    }
    handleSearch((urlFromSearch ? urlFromSearch : input), format);
    onClose();
  };

  const doSearch = () => {
    if(isYtUrl(input)) {
      onOpen()
    } else {
      handleSearch(input)
    }
  };


  const handleSearch = async (input:string, format: string = 'MP3-320') => {
    setUrlFromSearch('');
    setSuggestions([]);
    setCurrentVideo(null);
    setPagingInfo([]);
    const isYouTubeUrl = isYtUrl(input);
    if (!input) {
      setError(true);
      return;
    }
    if (isYouTubeUrl) {
      setSearchKey('');
      setError(false);
      setConvertionLoading(true);
      try {
        // const response = await fetch('/dummy.json');
        // const data = await response.json();
        const formData = {
          id: getYouTubeId(input)
        };
        const { data } = await fetchInfoYoutube(formData);
        setYouTubeId(getYouTubeId(input));
        data.thumbnail_url = `https://img.youtube.com/vi/${getYouTubeId(input)}/mqdefault.jpg`;
        data.format = format;
        data.videoId = getYouTubeId(input);
        setCurrentVideo(data);
        setConvertionLoading(false);
      } catch (err) {
        toast({
          title: t('faildownload'),
          description:
          t('faildownloaddesc'),
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        setError(true);
        setConvertionLoading(false);
      }
    } else {
      setError(true);
      setConvertionLoading(false);
      //fetchSuggestions();
      setSearchKey(input)
      fetchSuggestions2();
    }
  };

  const chooseFormat = async (data: any) => {
    setDownloadUrl('');
    try {
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

        console.log('downloadlink', downloadLink)
        // Set the download URL
        setDownloadUrl(downloadLink);

        // Prepare download info
        const downloadInfo = {
            title: data.data.title,
            imageUrl: data.thumbnail_url,
            videoLength: data.data.duration || "0",
            format: data.format,
            date: new Date(),
        };

        // Add to downloads
        setDownloads((prevState) => [...prevState, downloadInfo]);
    } catch (err) {
        setError(true);
    }
};

  const handleDeleteHistory = () => {
    localStorage.removeItem('downloads');
    setDownloads([]);
  };

  return (
    <>
      <Sidebar
        historyData={downloads}
        handleDeleteHistory={handleDeleteHistory}
      />
      <Container maxW="container.md">
        <Box textAlign="center" fontSize="xl">
          <Flex justifyContent="center" alignItems="center" mt="8">
              {colorMode === 'light' ? <LogoBlack width='85%' /> : <LogoWhite width='85%' />}
          </Flex>
          <Heading as="h1" size="md" mt="8" mb="7"> 
            {t('h1')}
          </Heading> 
          <Search
            handleChange={handleChange}
            error={error}
            input={input}
            doSearch={doSearch}
            isLoading={
              (isConvertionLoading && !isSearchLoading) ||
              (!isConvertionLoading && isSearchLoading)
            }
          />
          <PreviewBox
            data={currentVideo}
            chooseFormat={chooseFormat}
            isLoading={isConvertionLoading}
          />
        </Box>

        <Box textAlign="center" fontSize="xl" mt="8">

        <SimpleGrid
  columns={{ base: 2, md: 2 }} // 2 columns on small screens, 4 on medium and up
  spacing="4" // Adjust spacing between buttons
  justifyContent="center"
  alignItems="center"
  mt="8"
>
  <Button
    as="a"
    href="https://tiktok.y2mate.one"
    title='Y2Mate Tiktok Downloader'
    leftIcon={<Icon as={FaTiktok} />}
    colorScheme="blue"
    variant="outline"
    size="sm"
  >
    Tiktok Downloader
  </Button>
  <Button
    as="a"
    href="https://instagram.y2mate.one"
    title='Y2Mate Instagram Downloader'
    leftIcon={<Icon as={FaInstagram} />}
    colorScheme="blue"
    variant="outline"
    size="sm"
  >
    IG Downloader
  </Button>
  {/* <Button
    as="a"
    href="https://tiktok.y2mate.one"
    target="_blank"
    rel="noopener noreferrer"
    leftIcon={<Icon as={FaFacebook} />}
    colorScheme="blue"
    variant="outline"
    size="sm"
  >
    FB Downloader
  </Button>
  <Button
    as="a"
    href="https://tiktok.y2mate.one"
    target="_blank"
    rel="noopener noreferrer"
    leftIcon={<Icon as={FaTwitter} />}
    colorScheme="blue"
    variant="outline"
    size="sm"
  >
    X Downloader
  </Button> */}
</SimpleGrid>

        </Box>
        {pagingInfo?.items?.length === 0 && <NothingFoundAlert />}
        <Suggestions
          data={suggestions}
          setUrlFromSearch={setUrlFromSearch}
          onOpen={onOpen}
          chooseFormat={chooseFormat}
          isLoading={isSearchLoading}
          input={searchKey}
        />
        {!!suggestions.length && (
          <Button
            onClick={() => {
                fetchSuggestions2(true)
              }
            }
            isLoading={isSearchLoading}
            loadingText="Loading more..."
            colorScheme="gray"
            width="100%"
          >
            Load More
          </Button>
        )}
        <Features />
        <Article />
        <FeaturesComingSoon />
      </Container>
      <VisuallyHidden>
        <a href={downloadUrl} download ref={downloadBtnRef}>
          {downloadUrl}
        </a>
      </VisuallyHidden>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Download Format</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* MP3 Download Card */}
              <Box borderWidth="1px" borderRadius="lg" padding="4">
                <Text fontSize="lg" fontWeight="bold" mb="2">
                  Download MP3
                </Text>
                <VStack align="start" spacing={3}>
                  <Button mt="1" variant="solid" colorScheme='teal' width={"100%"} onClick={() => selectFormatAndDownload('MP3-320')}>
                    MP3 - 320 kbps
                  </Button>
                  <Button my="1" variant="solid" colorScheme='teal' width={"100%"} onClick={() => selectFormatAndDownload('MP3-128')}>
                    MP3 - 128 kbps
                  </Button>
                </VStack>
              </Box>

              {/* Video Download Card */}
              <Box borderWidth="1px" borderRadius="lg" padding="4">
                <Text fontSize="lg" fontWeight="bold" mb="2">
                  Download Video MP4
                </Text>
                <VStack align="start" spacing={3}>
                  <Button mt="1" variant="solid" colorScheme='teal' width={"100%"} onClick={() => selectFormatAndDownload('MP4-1080')}>
                    1080p (.mp4)
                  </Button>
                  <Button mt="1" variant="solid" colorScheme='teal' width={"100%"} onClick={() => selectFormatAndDownload('MP4-720')}>
                    720p (.mp4)
                  </Button>
                  <Button mt="1" variant="solid" colorScheme='teal' width={"100%"} onClick={() => selectFormatAndDownload('MP4-360')}>
                    360p (.mp4)
                  </Button>
                  <Button mt="1" variant="solid" colorScheme='teal' width={"100%"} onClick={() => selectFormatAndDownload('MP4-240')}>
                    240p (.mp4)
                  </Button>
                  <Button my="1" variant="solid" colorScheme='teal' width={"100%"} onClick={() => selectFormatAndDownload('MP4-144')}>
                    144p (.mp4)
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
