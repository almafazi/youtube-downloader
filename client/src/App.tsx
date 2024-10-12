import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Navbar from './Navbar';
import Main from './Main';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, useLocation, Routes, Navigate } from 'react-router-dom';
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

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark"
  }
});

export const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
    <ChakraProvider theme={theme}>
      <Router>
        <LanguageSwitcher />
        <Routes>
          {/* <Route path="/" element={<Navigate to="/en-ENwRL" />} /> */}

          {/* Route definition */}
          <Route path="/id" element={<><Navbar /><Main /><Footer /></>} />
          <Route path="/en-ENwRL" element={<><Navbar /><Main /><Footer /></>} />
          
          {/* Custom 404 page */}
          <Route path="/404" element={<NotFound />} />

          {/* Catch-all route to redirect to /404 */}
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
    </ChakraProvider>
  </I18nextProvider>
  );
};
