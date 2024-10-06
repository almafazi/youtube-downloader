import { ChakraProvider, Switch, theme } from '@chakra-ui/react';
import Navbar from './Navbar';
import Main from './Main';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, useLocation, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import i18n from './i18n';
import NotFound from './NotFound';

const LanguageSwitcher = () => {
  const location = useLocation(); // Now inside Router, so it works correctly

  useEffect(() => {
    // Update the language based on the current path
    if (location.pathname === '/id') {
      i18n.changeLanguage('id');
    } else {
      i18n.changeLanguage('en');
    }
  }, [location.pathname]);

  return null; // No need to render anything
};
export const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
    <ChakraProvider theme={theme}>
      <Router>
        <LanguageSwitcher />
        <Routes>
          {/* Route definition */}
          <Route path="/id" element={<><Navbar /><Main /><Footer /></>} />
          <Route path="/" element={<><Navbar /><Main /><Footer /></>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ChakraProvider>
  </I18nextProvider>
  );
};
