import { Box, SimpleGrid, Heading } from '@chakra-ui/react';
import Suggestion from './SuggestionV2';
import SuggestionsSkeleton from './SuggestionsSkeleton';
import { decodeStr } from './utils/helpers';

interface Props {
  data: any[];
  isLoading: boolean;
  input: string,
  onOpen: () => void,
  setUrlFromSearch: (url: string) => void,
  chooseFormat: (data: any) => void;
}

export default function Suggestions(props: Props) {
  const { data, isLoading, chooseFormat, setUrlFromSearch, onOpen, input } = props;

  return (
    <Box>
      {!!data.length && (
        <Box mt="10" mb="5">
          <Heading as="h4" size={'lg'} textAlign="center">{decodeStr(input)}</Heading>
        </Box>
      )}
      {isLoading && <SuggestionsSkeleton />}
      {!isLoading && (
        <SimpleGrid
        gridTemplateColumns={{
          base: "repeat(2, 1fr)", // For mobile (base) - 2 columns
          md: "repeat(3, 1fr)",   // For medium screens (PC) - 3 columns
        }}
        spacing={3}
        my="5"
      >
        {data.map((suggestion) => {
          return (
            <Suggestion
              data={suggestion}
              key={suggestion.id.videoId}
              chooseFormat={chooseFormat}
              setUrlFromSearch={setUrlFromSearch}
              onOpen={onOpen}
            />
          );
        })}
      </SimpleGrid>
      )}
    </Box>
  );
}
