import { Box, Container } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function Article() {
  const { t } = useTranslation();

  return (
    <Box px={8} pb={8}>
      <Container
        maxW="6xl"
        css={{
          'h1, h2, h3': {
            fontWeight: 'bold',
            marginBottom: '1rem',
          },
          h1: {
            fontSize: '2xl',
            textAlign: 'center',
          },
          h2: {
            fontSize: 'xl',
            marginTop: '1.5rem',
          },
          h3: {
            fontSize: 'lg',
            marginTop: '1rem',
            color: 'white',
          },
          p: {
            marginBottom: '1rem',
            lineHeight: '1.8',
            color: "#8e9aae"

          },
          ul: {
            marginBottom: '1rem',
            paddingLeft: '2rem',
          },
          ol: {
            marginBottom: '1rem',
            paddingLeft: '2rem',
          },
          li: {
            marginBottom: '0.5rem',
            color: "#8e9aae"

          },
          strong: {
            fontWeight: 'bold',
            color: '#abb6c4'
          },
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: t('article') }} />
      </Container>
    </Box>
  );
}

export default Article;
