import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

function FeaturesComingSoon() {
  const { t } = useTranslation();

  // Extract the comingsoon features from the translation file
  const comingSoonFeatures = [
    'pagination',
    'playlist_downloads',
    'progress_bar',
    'quality_choice',
    'download_history_cache',
    'batch_download',
    'video_preview',
    'edit_video_points',
    'feature_request_form',
    'chrome_extension',
    'electron_app',
  ];

  return (
    <Box p={4}>
      <Stack spacing={2} as={Container} maxW={'3xl'} textAlign={'center'}>
        <Heading fontSize={'3xl'}>Coming Soon</Heading>
      </Stack>

      <Container maxW={'6xl'} mt={10} mb={16}>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 3 }} spacing={5}>
          {comingSoonFeatures.map((featureKey) => (
            <HStack key={featureKey} align={'top'}>
              <Box color={'green.400'} px={2}>
                <Icon as={StarIcon} />
              </Box>
              <VStack align={'start'}>
                <Text fontWeight={600}>{t(`comingsoon.${featureKey}.title`)}</Text>
                <Text fontSize='sm'>{t(`comingsoon.${featureKey}.text`)}</Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default FeaturesComingSoon;
