import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Navbar from './Navbar';
import Main from './Main';
import Footer from './Footer';
import { I18nextProvider} from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import i18n from './i18n';
import NotFound from './NotFound';

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
                  <Routes>
                    {/* <Route path="/" element={<Navigate to="/en-ENwRL" />} /> */}

                    {/* Route definition */}
                    <Route path="/pt" element={<><Navbar /><Main /><Footer /></>} />
                    <Route path="/es" element={<><Navbar /><Main /><Footer /></>} />
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
