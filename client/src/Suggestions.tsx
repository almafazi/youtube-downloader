import { Box, SimpleGrid, Heading, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import Suggestion from './SuggestionV2';
import SuggestionsSkeleton from './SuggestionsSkeleton';
import { decodeStr } from './utils/helpers';
import { useState } from 'react';

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
  const [isOpenYouTube, setIsOpenYouTube] = useState(false);
  const [selectYoutubeId, setSelectYoutubeId] = useState(false);


  const openYouTubeModal = () => setIsOpenYouTube(true);
  const closeYouTubeModal = () => setIsOpenYouTube(false);

  return (
    <>
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
              openYouTubeModal={openYouTubeModal}
              setSelectYoutubeId={setSelectYoutubeId}
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
    <Modal isOpen={isOpenYouTube} onClose={closeYouTubeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody padding="10">
            <iframe
              width="100%"
              height="400px"
              src={`https://www.youtube.com/embed/${selectYoutubeId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
