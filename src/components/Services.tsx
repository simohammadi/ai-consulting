import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { services } from "@/content/site"
import { Section } from "@/components/Section"

export function Services() {
  return (
    <Section id="services">
      <Stack gap={{ base: 10, md: 16 }} align="center">
        <Stack gap="4" maxW="2xl" align="center" textAlign="center">
          <Text
            fontSize="sm"
            fontWeight="600"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color="ink.500"
          >
            What we do
          </Text>
          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="700"
            lineHeight="1.15"
            letterSpacing="-0.02em"
            color="ink.50"
          >
            Full-stack AI, from strategy to production
          </Heading>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 4, md: 5 }}>
          {services.map((service) => (
            <Box
              key={service.title}
              p={{ base: 6, md: 8 }}
              rounded="2xl"
              border="1px solid"
              borderColor="border"
              bg="rgba(255,255,255,0.015)"
              transition="all 0.25s ease"
              _hover={{
                borderColor: "ink.600",
                bg: "rgba(255,255,255,0.03)",
                transform: "translateY(-2px)",
              }}
            >
              <Stack gap="4" h="full">
                <Heading
                  as="h3"
                  fontSize="xl"
                  fontWeight="600"
                  color="ink.50"
                  letterSpacing="-0.01em"
                >
                  {service.title}
                </Heading>
                <Text fontSize="sm" color="ink.300" lineHeight="1.6">
                  {service.description}
                </Text>
                <Stack gap="2" pt="2">
                  {service.bullets.map((bullet) => (
                    <Box
                      key={bullet}
                      display="flex"
                      alignItems="flex-start"
                      gap="2.5"
                    >
                      <Box
                        mt="7px"
                        w="5px"
                        h="5px"
                        rounded="full"
                        bg="ink.500"
                        flexShrink="0"
                      />
                      <Text fontSize="sm" color="ink.400">
                        {bullet}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Section>
  )
}
