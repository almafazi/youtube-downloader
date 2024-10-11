import { Box, Stack, Skeleton, SimpleGrid } from '@chakra-ui/react';
export default function SuggestionsSkeleton() {
  return (
    <Box my="5">
      <SimpleGrid
        columns={{ base: 2, md: 3 }} // 2 columns on mobile (base), 3 columns on medium and larger screens (md)
        spacing={3}
      >
        {[...Array(12)].map((_, index) => (
          <Stack key={index}>
            <Skeleton height="178px" />
          </Stack>
        ))}
      </SimpleGrid>
    </Box>
  );
}
