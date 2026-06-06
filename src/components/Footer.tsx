import { Box, chakra, Container, Flex, HStack, Text } from "@chakra-ui/react"
import { brand, nav } from "@/content/site"

export function Footer() {
  return (
    <Box as="footer" borderTop="1px solid" borderColor="border" py="12">
      <Container maxW="6xl" px={{ base: 5, md: 8 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap="6"
        >
          <Box>
            <Text fontWeight="700" fontSize="lg" color="ink.50">
              {brand.name}
              <Text as="span" color="ink.500">
                .
              </Text>
            </Text>
            <Text fontSize="sm" color="ink.500" maxW="sm" mt="1">
              {brand.tagline}
            </Text>
          </Box>

          <HStack gap="6" flexWrap="wrap">
            {nav.map((link) => (
              <chakra.a
                key={link.href}
                href={link.href}
                fontSize="sm"
                color="ink.400"
                _hover={{ color: "ink.100" }}
              >
                {link.label}
              </chakra.a>
            ))}
            <chakra.a
              href={`mailto:${brand.email}`}
              fontSize="sm"
              color="ink.400"
              _hover={{ color: "ink.100" }}
            >
              {brand.email}
            </chakra.a>
          </HStack>
        </Flex>

        <Text fontSize="xs" color="ink.600" mt="10">
          © {new Date().getFullYear()} {brand.name}. All rights reserved.
        </Text>
      </Container>
    </Box>
  )
}
