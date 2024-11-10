import React from 'react';
import { Input, Box, Flex, Button,} from '@chakra-ui/react';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

interface Props {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  input: string;
  isLoading: boolean;
  doSearch: () => void
}

const Search = (props: Props) => {
  const { handleChange, error, input, isLoading, doSearch } = props;
  const { t } = useTranslation();

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 || event.key === 'Enter') {
      doSearch();
    }
  };

  return (
    <Box mt="2" mb="2">
      <Flex gridGap="2" direction={['column', 'row']}>
        <Input
          isInvalid={error}
          placeholder={t('searchOrPaste')}
          onChange={handleChange}
          value={input}
          onKeyDown={handleKeydown}
        />
        
        <Button
          px={6}
          onClick={doSearch}
          isLoading={isLoading}
          loadingText="Converting..."
          width={['100%', 'auto']}
        >
          Download
        </Button>
      </Flex>

    </Box>
  );
};

export default React.memo(Search);
