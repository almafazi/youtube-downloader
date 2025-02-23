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
  <Flex 
    gridGap="2" 
    direction={['row', 'row']} // Column layout on mobile, row layout on desktop
  >
    <Input
      isInvalid={error}
      placeholder={t('searchOrPaste')}
      onChange={handleChange}
      value={input}
      onKeyDown={handleKeydown}
    />
    
    {/* Wrap Select and Button in a Flex container */}
    {/* <Flex 
      width={['100%', 'auto']}
      justify={['space-between', 'space-between']} // Justify space between on mobile, default for desktop
      mt={['2', '0']} // Add margin top only on mobile
      gridGap={['2', '2']} // Add space between items on mobile, no gap on desktop
    > */}
      {/* <Select 
        value={format} 
        onChange={handleFormatChange} 
        width={['65%', '200px']} // 48% width on mobile (to ensure both fit), 120px on desktop
      >
        <option value="MP4">MP4 No Watermark</option>
        <option value="MP3">MP3</option>
      </Select> */}
      
      <Button
        px={6}
        onClick={handleSearch}
        isLoading={isLoading}
        loadingText="Converting..."
        width={['48%', 'auto']} // 48% width on mobile, auto width on desktop
      >
        Download
      </Button>
    </Flex>
  {/* </Flex> */}
</Box>

  );
};

export default React.memo(Search);
