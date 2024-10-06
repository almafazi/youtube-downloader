import React, { useState } from 'react';
import { Input, Box, Flex, Button, Select } from '@chakra-ui/react';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

interface Props {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormatChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSearch: () => void;
  error: boolean;
  input: string;
  format: string; // Ensure the format prop is included in the Props interface
  isLoading: boolean;
}
const Search = (props: Props) => {
  const { handleChange, handleSearch, handleFormatChange, error, input, isLoading, format } = props;

  const { t } = useTranslation();
  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 || event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box mt="2" mb="2">
      <Flex gridGap="2">
        <Input
          isInvalid={error}
          placeholder={t('searchOrPaste')}
          onChange={handleChange}
          value={input}
          onKeyDown={handleKeydown}
        />
        <Select value={format} onChange={handleFormatChange} width="120px">
          <option value="MP3">MP3</option>
          <option value="MP4">MP4</option>
        </Select>
        <Button
          px={6}
          onClick={handleSearch}
          isLoading={isLoading}
          loadingText="Converting..."
        >
          Download
        </Button>
      </Flex>
    </Box>
  );
};

export default React.memo(Search);
