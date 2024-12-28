import {
  Container,
  Box,
  Heading,
  VisuallyHidden,
  useColorMode,
  Button,
  useToast,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';

import { useEffect, useRef, useState } from 'react';
import Features from '../../Features';
import FeaturesComingSoon from '../../FeaturesComingSoon';
import LogoBlack from '../../Icons/LogoBlack';
import LogoWhite from '../../Icons/LogoWhite';
import NothingFoundAlert from '../../NothingFoundAlert';
import PreviewBox from './PreviewBox';
import Search from './Search';
import SelectFormat from '../../SelectFormat';
import Sidebar, { HistoryItem } from '../../Sidebar';
import Suggestions from '../../Suggestions';
import { fetchInfo, getInfos, getSearch, getSuggestions } from '../../utils/API';
import { getDownloadUrl, isTikTokUrl, isYtUrl } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';
import Article from '../../Article';
import { useSearchParams } from 'react-router-dom';

export default function Main() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [format, setFormat] = useState('MP4');
  const [downloadUrl, setDownloadUrl] = useState('');

  const [searchParams] = useSearchParams();
  const defaultUrl = searchParams.get('url') || '';
  const [input, setInput] = useState(defaultUrl);
  const [isConvertionLoading, setConvertionLoading] = useState(false);
  const [isSearchLoading, setSearchLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [pagingInfo, setPagingInfo] = useState<any>(null);
  const [error, setError] = useState(false);
  const downloadBtnRef = useRef<HTMLAnchorElement>(null);
  const [downloads, setDownloads] = useState<HistoryItem[]>([]);
  const [youtubeId, setYouTubeId] = useState<string | null>(null);

  const { t } = useTranslation();
  useEffect(() => {
    const storedDownloads = localStorage.getItem('downloads');
    if (storedDownloads && JSON.parse(storedDownloads)?.length > 0) {
      setDownloads(JSON.parse(storedDownloads));
    }
  }, []);

  useEffect(() => {
    if (defaultUrl) {
      handleSearch();    
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('downloads', JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    if (downloadUrl.length && downloadBtnRef?.current) {
      setConvertionLoading(false);
      downloadBtnRef.current.click();
    }
  }, [downloadUrl]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(event.target.value);
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


  const handleSearch = async () => {
    setSuggestions([]);
    setCurrentVideo(null);
    setPagingInfo([]);
    const isTiktokUrlTrue = isTikTokUrl(input);
    if (!input) {
      setError(true);
      return;
    }
    if (isTiktokUrlTrue) {
      setError(false);
      setConvertionLoading(true);
      try {
        // const response = await fetch('/dummy.json');
        // const data = await response.json();
        const formData = {
          tiktokFullAudio: true,
          downloadMode: format == 'MP3' ? "audio" : "auto",
          tiktokH265: true,
          videoQuality: 'max',
          url: input
        };
        const { data } = await fetchInfo(formData);
        data.thumbnail_url = data.metadata?.cover;
        data.picker = data.picker;
        data.format = format;
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
      toast({
        title: t('wrongurl', 'URL is not Tiktok'),
        description:
          t('wrongurl', 'Failed to download, URL is not Tiktok'),
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setError(true);
      setConvertionLoading(false);
    }
  };

  const chooseFormat = async (data: any) => {
    setDownloadUrl('');
    try {
      console.log(data)
      setDownloadUrl(data.url);
      const downloadInfo = {
        title: data.metadata?.title,
        imageUrl: data.thumbnail_url,
        videoLength: data.duration,
        format,
        date: new Date(),
      };
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
            handleFormatChange={handleFormatChange}
            handleChange={handleChange}
            handleSearch={handleSearch}
            error={error}
            input={input}
            format={format}
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
            href="https://mp3.y2mate.one"
            target="_blank"
            title='Y2Mate Youtube Downloader'
            leftIcon={<Icon as={FaYoutube} />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            fontSize={13}
          >
            Youtube Downloader
          </Button>
          <Button
            as="a"
            href="https://instagram.y2mate.one"
            target="_blank"
            title='Y2Mate Instagram Downloader'
            leftIcon={<Icon as={FaInstagram} />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            fontSize={13}
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
            fontSize={13}
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
            fontSize={13}
          >
            X Downloader
          </Button> */}
        </SimpleGrid>

        </Box>
        {pagingInfo?.items?.length === 0 && <NothingFoundAlert />}
        <Suggestions
          data={suggestions}
          chooseFormat={chooseFormat}
          isLoading={isSearchLoading}
          input={input}
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
    </>
  );
}
