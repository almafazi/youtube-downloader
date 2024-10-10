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
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import Features from './Features';
import FeaturesComingSoon from './FeaturesComingSoon';
import LogoBlack from './Icons/LogoBlack';
import LogoWhite from './Icons/LogoWhite';
import NothingFoundAlert from './NothingFoundAlert';
import PreviewBox from './PreviewBox';
import Search from './Search';
import SelectFormat from './SelectFormat';
import Sidebar, { HistoryItem } from './Sidebar';
import Suggestions from './Suggestions';
import { fetchInfo, getInfos, getSearch, getSuggestions } from './utils/API';
import { getDownloadUrl, isYtUrl } from './utils/helpers';
import { useTranslation } from 'react-i18next';

export default function Main() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [format, setFormat] = useState('MP3');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [input, setInput] = useState('');
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

  const fetchSuggestions2 = async () => {
    setError(false);
    setSearchLoading(true);
    try {
      const { data } = await getSearch(input, pagingInfo?.nextPageToken);
      // setPagingInfo(data.pagingInfo);
      const formattedData = reformatData(data);
      setSuggestions((previousSuggestions) => [
        ...previousSuggestions,
        ...formattedData,
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
    const isYouTubeUrl = isYtUrl(input);
    if (!input) {
      setError(true);
      return;
    }
    if (isYouTubeUrl) {
      setError(false);
      setConvertionLoading(true);
      try {
        // const response = await fetch('/dummy.json');
        // const data = await response.json();
        const formData = {
          downloadMode: format == 'MP3' ? "audio" : "auto",
          url: input
        };
        const { data } = await fetchInfo(formData);
        setYouTubeId(getYouTubeId(input));
        data.thumbnail_url = `https://img.youtube.com/vi/${getYouTubeId(input)}/mqdefault.jpg`;
        data.format = format;
        data.videoId = getYouTubeId(input);
        setCurrentVideo(data);
        setConvertionLoading(false);
      } catch (err) {
        toast({
          title: 'Max. Video Duration is 50 Minutes',
          description:
            'Please choose other video.',
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
      fetchSuggestions2();
    }
  };

  const chooseFormat = async (data: any) => {
    setDownloadUrl('');
    try {
      setDownloadUrl(data.url);
      const downloadInfo = {
        title: data.fileMetaData?.title,
        imageUrl: data.thumbnail_url,
        videoLength: "0",
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
        {pagingInfo?.totalResults === 0 && <NothingFoundAlert />}
        <Suggestions
          data={suggestions}
          chooseFormat={chooseFormat}
          isLoading={isSearchLoading}
        />
        {/* {!!suggestions.length && (
          <Button
            onClick={fetchSuggestions}
            isLoading={isSearchLoading}
            loadingText="Loading more..."
            colorScheme="gray"
            width="100%"
          >
            Load More
          </Button>
        )} */}
        <Features />
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
