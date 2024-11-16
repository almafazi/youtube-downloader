import {DownloadIcon, ViewIcon } from '@chakra-ui/icons';
import {
  Flex,
  Box,
  Image,
  useColorModeValue,
  Tooltip,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Button,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Badge,
  Text,
  CardHeader,
  Card,
  CardBody,
  CardFooter,
  Heading,
  ButtonGroup,
  useToast,
} from '@chakra-ui/react';
import {
  decodeStr,
} from './utils/helpers';
import { fetchInfo } from './utils/API';
import { useTranslation } from 'react-i18next';

interface Props {
  data: any;
  chooseFormat: (data: any) => void;
  setUrlFromSearch: (url: string) => void,
  onOpen: () => void,
  openYouTubeModal: any,
  setSelectYoutubeId: any
}

export default function SuggestionV2(props: Props) {

  const toast = useToast();
  const { t } = useTranslation();

  const {
    chooseFormat,
    setUrlFromSearch,
    onOpen,
    openYouTubeModal,
    setSelectYoutubeId,
    data: { snippet, id },
  } = props;

  return (
    <Card
      borderRadius="lg"
      borderStyle="solid"
      borderWidth="2px"
      borderColor={useColorModeValue('gray.100', 'gray.600')}
    >
      <CardHeader>
        <Heading marginBottom="1" size="sm">
          {decodeStr(snippet.title)}
        </Heading>
        <Text fontSize="small" wordBreak="break-word" lineHeight="tight">
          {snippet.description}
        </Text>
      </CardHeader>
      <Divider color="gray.600" opacity={useColorModeValue('1', '0.6')} />
      <CardBody>
        <Box marginBottom="4">
          <Flex>
            {/* <Badge>
              Length: {formatSecondsToMinutesAndSeconds(snippet.lengthSeconds)}
            </Badge> */}
            <Badge textTransform="none">
              {t('duration')}: {snippet.publishedAt}
            </Badge>
          </Flex>
        </Box>
        <Image
          src={snippet.thumbnails.medium.url}
          alt={`Picture of ${snippet.title}`}
          title={`Picture of ${snippet.title}`}
          borderRadius="lg"
        />
      </CardBody>
      <CardFooter
        backgroundColor={useColorModeValue('gray.100', 'gray.600')}
        borderBottomRadius="lg"
      >
        <ButtonGroup
          gap="1"
          flexWrap="wrap"
          justifyContent="center"
          width="100%"
        >
          <Button
              onClick={() => {
                setUrlFromSearch(`https://www.youtube.com/watch?v=${id.videoId}`)
                onOpen()
              }}
              loadingText="Converting..."
              width={'100%'}
              mb={2}
              background={useColorModeValue('gray.300', 'gray.700')}
              leftIcon={<DownloadIcon />}
            >
              Download
            </Button>
            <Button
              width="100%"
              onClick={() => {
                setSelectYoutubeId(id.videoId);
                openYouTubeModal();
              }}
              background={useColorModeValue('gray.300', 'gray.700')}
              marginInlineStart="0 !important"
            >
              <ViewIcon me={2} /> {t('openyoutube')}
            </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
