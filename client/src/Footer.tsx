import {
  Box,
  Button,
  Container,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  Input,
  IconButton,
  useColorModeValue,
  Heading,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ListItem,
  UnorderedList,
  useColorMode,
} from '@chakra-ui/react';
import { EmailIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { ReactNode } from 'react';
import { BiMailSend } from 'react-icons/bi';
import GithubIcon from './Icons/GithubIcon';
import HeartIcon from './Icons/HeartIcon';
import InstagramIcon from './Icons/InstagramIcon';
import LinkedinIcon from './Icons/LinkedinIcon';
import LogoBlack from './Icons/LogoBlack';
import LogoWhite from './Icons/LogoWhite';
import ContactForm from './ContactForm';
import PinterestIcon from './Icons/PinterestIcon';
import TwitterIcon from './Icons/TwitterIcon';
import BlogNewsIcon from './Icons/BlogNewsIcon';
import { useTranslation } from 'react-i18next';

const socialMedia = [
  {
    name: 'GitHub',
    url: 'https://github.com/y2mateone',
    icon: <GithubIcon />,
  },
  {
    name: 'Twitter',
    url: 'https://x.com/y2mateOne',
    icon: <TwitterIcon />,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/y2matemp3',
    icon: <InstagramIcon />,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/y2mate-one/',
    icon: <LinkedinIcon />,
  },
  {
    name: 'Pinterest',
    url: 'https://www.pinterest.com/y2mateone/',
    icon: <PinterestIcon />,
  }
];

const handleClick = () => {
  window.location.href = '/blog'; // Navigate to the y2mate.one/blog
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <Button
      bg={useColorModeValue('gray.200', 'gray.700')}
      rounded={'full'}
      fill={useColorModeValue('gray.700', 'white')}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      target="_blank"
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('gray.300', 'gray.600'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {

  const { t } = useTranslation();

  const {
    isOpen: changeLogIsOpen,
    onOpen: changeLogOnOpen,
    onClose: changeLogOnClose,
  } = useDisclosure();

  const {
    isOpen: imprintIsOpen,
    onOpen: imprintOnOpen,
    onClose: imprintOnClose,
  } = useDisclosure();

  const {
    isOpen: contactFormIsOpen,
    onOpen: contactFormOnOpen,
    onClose: contactFormOnClose,
  } = useDisclosure();

  const { colorMode } = useColorMode();
  return (
    <>
      <Box color={useColorModeValue('gray.700', 'gray.200')}>
        <Container
          as={Stack}
          maxW={'full'}
          py={10}
          bg={useColorModeValue('gray.100', 'gray.900')}
        >
          <SimpleGrid
            templateColumns={{ sm: '1fr 1fr', md: '3fr 3fr' }}
            spacing={8}
          >
            <Stack spacing={6} align="flex-start">
              <Box>{colorMode === 'light' ? <LogoBlack width="230px" /> : <LogoWhite width="230px" />}</Box>
              <Text fontSize={'sm'}>
                © {new Date().getFullYear()} Y2mate. All rights reserved
              </Text>
              <Stack direction={'row'} spacing={6}>
                {socialMedia.map((media) => (
                  <SocialButton
                    key={media.name}
                    label={media.name}
                    href={media.url}
                  >
                    {media.icon}
                  </SocialButton>
                ))}
              </Stack>
            </Stack>
            <Stack align={'flex-end'}>
              <ListHeader>{ t('stayuptodate') }</ListHeader>
              <Stack direction={'row'}>
                <Input
                  placeholder={ t('youremail') }
                  bg={useColorModeValue('gray.300', 'gray.700')}
                  color={useColorModeValue('white', 'gray.200')}
                  border={0}
                  _focus={{
                    bg: useColorModeValue('gray.400', 'gray.600'),
                  }}
                />
                <IconButton
                  bg={useColorModeValue('green.400', 'green.600')}
                  color={useColorModeValue('white', 'gray.800')}
                  _hover={{
                    bg: useColorModeValue('green.600', 'green.500'),
                  }}
                  aria-label="Subscribe"
                  icon={<BiMailSend />}
                />
              </Stack>
              <Box>
                <Button onClick={handleClick} mr="2" mt="6">
                <BlogNewsIcon mr="2" /> Blog
                </Button>
                <Button onClick={contactFormOnOpen} mr="2" mt="6">
                { t('contact') }
                </Button>
                <Button onClick={imprintOnOpen} mt="6">
                  Info
                </Button>
              </Box>
            </Stack>
          </SimpleGrid>
        </Container>
        <Container
          py="3"
          bg={useColorModeValue('gray.200', 'gray.900')}
          maxW="full"
        >
          <Box>
            <Flex alignItems="center" flexDirection="column">
              <Text>
                Made by{' '}
                <Link href="https://y2mate.one" target="_blank">
                  Y2Mate mp3
                </Link>
              </Text>
              <HeartIcon
                color="red.400"
                transitionDuration="0.3s"
                _hover={{ transform: 'rotate(30deg)' }}
              />
            </Flex>
          </Box>
        </Container>
      </Box>


      <Modal onClose={contactFormOnClose} size="xl" isOpen={contactFormIsOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{ t('contact') }</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ContactForm handleClose={contactFormOnClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal onClose={imprintOnClose} size="xl" isOpen={imprintIsOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Imprint</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading size="sm" mb="2">
              Y2Mate.one
            </Heading>
            <Text>Y2Mate MP3</Text>
            <Flex alignItems="center" gridGap={2}>
              <EmailIcon />{' '}
              <Link href="mailto:y2mateone@gmail.com">
              y2mateone@gmail.com
              </Link>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={imprintOnClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
