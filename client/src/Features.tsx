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
import { CheckIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';


function Features() {
  const { t } = useTranslation();
  const features = [
    {
      id: 1,
      title: t('features.story_download.title'),
      text: t('features.story_download.text'),
    },
    {
      id: 2,
      title: t('features.reel_download.title'),
      text: t('features.reel_download.text'),
    },
    {
      id: 3,
      title: t('features.post_download.title'),
      text: t('features.post_download.text'),
    },
    {
      id: 4,
      title: t('features.mp3_conversion.title'),
      text: t('features.mp3_conversion.text'),
    },
    {
      id: 5,
      title: t('features.quick_and_easy.title'),
      text: t('features.quick_and_easy.text'),
    },
    {
      id: 6,
      title: t('features.supports_all_devices.title'),
      text: t('features.supports_all_devices.text'),
    },
    {
      id: 7,
      title: t('features.completely_secure.title'),
      text: t('features.completely_secure.text'),
    }
  ];
  

  return (
    <Box p={4}>
      <Stack spacing={2} as={Container} maxW={'3xl'} textAlign={'center'}>
        <Heading fontSize={'3xl'}>{ t('featureTitle')}</Heading>
        <Text color={'gray.600'} fontSize={'lg'}>
            { t('feature')}        
        </Text>
      </Stack>

      <Container maxW={'6xl'} mt={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={10}>
          {features.map((feature) => (
            <HStack key={feature.id} align={'top'}>
              <Box color={'green.400'} px={2}>
                <Icon as={CheckIcon} />
              </Box>
              <VStack align={'start'}>
                <Text fontWeight={600}>{feature.title}</Text>
                <Text color={'gray.600'}>{feature.text}</Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default Features;
