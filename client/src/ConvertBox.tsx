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
} from '@chakra-ui/react';
import { formats } from './utils/helpers';

interface Props {
  data: any;
  chooseFormat: (data: any) => void;
}
export default function ConvertBox(props: Props) {
  const { data, chooseFormat } = props;
  const handleDownload = () => {
    chooseFormat(data);
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
        <Grid alignItems="center" gridAutoFlow="column">
          <Image
            borderRadius="lg"
            src={data.thumbnail_url}
            alt={`Thumbnail of ${data.fileMetaData?.title}`}
          />
          <Box p="0.5">
            <Heading size="sm">{data.fileMetaData?.title}</Heading>
            <Text mb="5" size="sm">{data.fileMetaData?.artist}</Text>
            <Button leftIcon={<DownloadIcon />} onClick={handleDownload} variant='solid'>
                Download {data.format}
            </Button>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}
