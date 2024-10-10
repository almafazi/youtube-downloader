import { Box, SimpleGrid, Heading } from '@chakra-ui/react';
import Suggestion from './SuggestionV2';
import SuggestionsSkeleton from './SuggestionsSkeleton';

interface Props {
  data: any[];
  isLoading: boolean;
  chooseFormat: (format: string, videoId: string) => void;
}
export default function Suggestions(props: Props) {
  const { data, isLoading, chooseFormat } = props;

  return (
    <Box>
      {!!data.length && (
        <Box mt="10" mb="5">
          <Heading as="h4" size={'lg'} textAlign="center">Search Results</Heading>
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
            />
          );
        })}
      </SimpleGrid>
      )}
    </Box>
  );
}
