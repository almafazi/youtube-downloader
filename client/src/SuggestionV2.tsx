import { ChevronDownIcon, DownloadIcon, TimeIcon } from '@chakra-ui/icons';
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
  formats,
  formatSecondsToMinutesAndSeconds,
} from './utils/helpers';
import { fetchInfo } from './utils/API';
import { useTranslation } from 'react-i18next';

interface Props {
  data: any;
  chooseFormat: (data: any) => void;
}

export default function SuggestionV2(props: Props) {

  const toast = useToast();
  const { t } = useTranslation();

  const {
    chooseFormat,
    data: { snippet, id },
  } = props;

  async function fetchData(format: string, id: string) {
    
    toast({
      title: t('startdownload'),
      description:
        t('startdownloaddesc')+': '+decodeStr(snippet.title),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    try {

        const formData = {
            downloadMode: format === '.mp3' ? "audio" : "auto",
            url: `https://www.youtube.com/watch?v=${id}`
        };
        
        const { data } = await fetchInfo(formData);  // Assuming fetchInfo is a promise-based function
        data.thumbnail_url = snippet.thumbnails.medium.url;
        chooseFormat(data)
        if (data.url) {
          window.location.href = data.url;  // This will navigate to the URL in the same tab
      }
        

    } catch (error) {
        toast({
          title: t('faildownload'),
          description:
            t('faildownloaddesc')+'. '+decodeStr(snippet.title),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });

        return null;  // Return null or handle error accordingly
    }
}

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
          <Menu>
            <MenuButton
              width="100%"
              background={useColorModeValue('gray.300', 'gray.700')}
              as={Button}
              mb={2}
              leftIcon={<DownloadIcon />}
              rightIcon={<ChevronDownIcon />}
              color={useColorModeValue('gray.800', 'white')}
            >
              Download
            </MenuButton>
            <MenuList color={useColorModeValue('gray.800', 'gray.100')}>
              {formats.filter(item => item.format === '.mp4' || item.format === '.mp3').map((format) => (
                <MenuItem
                  key={format.text}
                  onClick={() => fetchData(format.format, id.videoId)}
                >
                  {format.text}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Button
            width="100%"
            background={useColorModeValue('gray.300', 'gray.700')}
            rel="noreferrer"
            href={`https://www.youtube.com/watch?v=${id.videoId}`}
            target="_blank"
            as="a"
            marginInlineStart="0 !important"
          >
            {t('openyoutube')}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
