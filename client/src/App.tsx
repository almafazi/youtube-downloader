import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Navbar from './Navbar';
import Main from './Main';
import Footer from './Footer';
import { I18nextProvider, useTranslation} from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import { useEffect } from 'react';

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark"
  }
});

export const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <I18nextProvider i18n={i18n}>
              <ChakraProvider theme={theme}>
                <Router>
                  <Routes>
                    {/* <Route path="/" element={<Navigate to="/en-ENwRL" />} /> */}

                    {/* Route definition */}
                    <Route path="/pt" element={<><Navbar /><Main /><Footer /></>} />
                    <Route path="/es" element={<><Navbar /><Main /><Footer /></>} />
                    <Route path="/ar" element={<><Navbar /><Main /><Footer /></>} />
                    <Route path="/vi" element={<><Navbar /><Main /><Footer /></>} />
                    <Route path="/idv1" element={<><Navbar /><Main /><Footer /></>} />
                    <Route path="/en-ENwRL" element={<><Navbar /><Main /><Footer /></>} />
                    
                    {/* Custom 404 page */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Router>
              </ChakraProvider>
  </I18nextProvider>
  );
};
