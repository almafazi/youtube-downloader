import {
  Box,
  Flex,
  HStack,
  Link,
  useColorModeValue,
  Heading,
  useColorMode,
  Button,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import LogoBlackNoSlogan from './Icons/LogoBlackNoSlogan';
import LogoWhiteNoSlogan from './Icons/LogoWhiteNoSlogan';
import { isLocalHost } from './utils/helpers';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {Helmet} from "react-helmet";

// const Links = ['Dashboard', 'Projects', 'Team'];

// const NavLink = ({ children }: { children: ReactNode }) => (
//   <Link
//     px={2}
//     py={1}
//     rounded={'md'}
//     _hover={{
//       textDecoration: 'none',
//       bg: useColorModeValue('gray.200', 'gray.700'),
//     }}
//     href={'#'}
//   >
//     {children}
//   </Link>
// );

export default function Navbar() {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const { i18n } = useTranslation();
  const navigate = useNavigate(); // For programmatic navigation
  const { t } = useTranslation();

  const changeLanguage = (lang:string) => {
    i18n.changeLanguage(lang); // Change the language in i18n
    if (lang === 'id') {
      navigate('/id'); // Redirect to /id for Indonesian
    } else {
      navigate('/'); // Redirect to / for English
    }
  };
  return (
    <>
      <Helmet>
        <title>{t('title')}</title>
        <meta
          property="og:title"
          content={t('title')}
        />
        <meta
          property="og:description"
          content={t('description')}
        />
        <meta name="description" content={t('description')} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('title')} />
        <meta name="twitter:description" content={t('description')} />
        <link rel="canonical" href={`https://y2mate.one${t('langCode')}`} />
      </Helmet>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          {/* <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          /> */}
          <HStack spacing={8} alignItems={'center'}>
            <Heading size="lg">
              <Link
                href={`${
                  isLocalHost
                    ? 'http://localhost:3000'
                    : 'https://y2mate.one'
                }`}
                _hover={{ textDecoration: 'none', color: 'gray.500' }}
              >
                {colorMode === 'light' ? (
                  <LogoBlackNoSlogan />
                ) : (
                  <LogoWhiteNoSlogan />
                )}
              </Link>
            </Heading>
            {/* <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack> */}
          </HStack>
          
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {i18n.language === 'id' ? 'Indonesia' : 'English'}
              </MenuButton>
              <MenuList>
                <MenuItem 
                  onClick={() => changeLanguage('id')}
                  bg={i18n.language === 'id' ? 'gray.600' : 'inherit'} // Highlight if selected
                  color={i18n.language === 'id' ? 'white' : 'inherit'}
                >
                  Indonesia
                </MenuItem>
                <MenuItem 
                  onClick={() => changeLanguage('en')}
                  bg={i18n.language === 'en' ? 'gray.600' : 'inherit'} // Highlight if selected
                  color={i18n.language === 'en' ? 'white' : 'inherit'}
                >
                  English
                </MenuItem>
              </MenuList>
            </Menu>
            <ColorModeSwitcher />
          </Flex>
        </Flex>

        {/* {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null} */}
      </Box>
    </>
  );
}
