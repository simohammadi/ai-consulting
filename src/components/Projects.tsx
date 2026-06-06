import {
  Badge,
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
} from "@chakra-ui/react"
import { projects } from "@/content/site"
import { Section } from "@/components/Section"

export function Projects() {
  return (
    <Section id="work">
      <Stack gap={{ base: 10, md: 16 }} align="center">
        <Stack gap="4" maxW="2xl" align="center" textAlign="center">
          <Text
            fontSize="sm"
            fontWeight="600"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color="ink.500"
          >
            Selected work
          </Text>
          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="700"
            letterSpacing="-0.02em"
            color="ink.50"
          >
            Systems shipped to production
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="ink.300">
            A sample of recent engagements. Client names are anonymized under
            NDA.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 5 }}>
          {projects.map((project) => (
            <Box
              key={project.title}
              p={{ base: 6, md: 8 }}
              rounded="2xl"
              border="1px solid"
              borderColor="border"
              bg="rgba(255,255,255,0.015)"
              transition="all 0.25s ease"
              _hover={{
                borderColor: "ink.600",
                bg: "rgba(255,255,255,0.03)",
              }}
            >
              <Stack gap="5" h="full">
                <Flex justify="space-between" align="flex-start" gap="4">
                  <Stack gap="1">
                    <Badge
                      alignSelf="flex-start"
                      bg="rgba(255,255,255,0.06)"
                      color="ink.200"
                      rounded="full"
                      px="2.5"
                      py="0.5"
                      fontSize="xs"
                    >
                      {project.category}
                    </Badge>
                    <Text fontSize="sm" color="ink.500" pt="1">
                      {project.client}
                    </Text>
                  </Stack>
                  <Stack gap="0" textAlign="right" flexShrink="0">
                    <Text
                      fontSize={{ base: "2xl", md: "3xl" }}
                      fontWeight="700"
                      color="ink.50"
                      letterSpacing="-0.02em"
                      lineHeight="1"
                    >
                      {project.metric}
                    </Text>
                    <Text fontSize="xs" color="ink.400" maxW="160px">
                      {project.metricLabel}
                    </Text>
                  </Stack>
                </Flex>

                <Heading
                  as="h3"
                  fontSize="xl"
                  fontWeight="600"
                  color="ink.50"
                  letterSpacing="-0.01em"
                >
                  {project.title}
                </Heading>

                <Text fontSize="sm" color="ink.300" lineHeight="1.6" flex="1">
                  {project.description}
                </Text>

                <Wrap gap="2">
                  {project.tags.map((tag) => (
                    <Text
                      key={tag}
                      fontSize="xs"
                      color="ink.400"
                      px="2.5"
                      py="1"
                      rounded="md"
                      border="1px solid"
                      borderColor="border"
                    >
                      {tag}
                    </Text>
                  ))}
                </Wrap>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Section>
  )
}
