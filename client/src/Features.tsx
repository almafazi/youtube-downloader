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
      title: t('features.quick_and_user_friendly.title'),
      text: t('features.quick_and_user_friendly.text'),
    },
    {
      id: 2,
      title: t('features.unlimited_usage.title'),
      text: t('features.unlimited_usage.text'),
    },
    {
      id: 3,
      title: t('features.supports_all_devices.title'),
      text: t('features.supports_all_devices.text'),
    },
    {
      id: 4,
      title: t('features.multiple_format_options.title'),
      text: t('features.multiple_format_options.text'),
    },
    {
      id: 5,
      title: t('features.completely_secure_and_reliable.title'),
      text: t('features.completely_secure_and_reliable.text'),
    },
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
