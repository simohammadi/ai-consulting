import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { processSteps } from "@/content/site"
import { Section } from "@/components/Section"

export function Process() {
  return (
    <Section id="process">
      <Stack gap={{ base: 10, md: 16 }} align="center">
        <Stack gap="4" maxW="2xl" align="center" textAlign="center">
          <Text
            fontSize="sm"
            fontWeight="600"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color="ink.500"
          >
            How we work
          </Text>
          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="700"
            letterSpacing="-0.02em"
            color="ink.50"
          >
            A path from idea to impact
          </Heading>
        </Stack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 6, md: 5 }}>
          {processSteps.map((step, i) => (
            <Stack
              key={step.title}
              gap="4"
              pt="6"
              borderTop="1px solid"
              borderColor="border"
            >
              <Text
                fontSize="sm"
                fontWeight="600"
                color="ink.500"
                fontVariantNumeric="tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
              </Text>
              <Heading as="h3" fontSize="lg" fontWeight="600" color="ink.50">
                {step.title}
              </Heading>
              <Text fontSize="sm" color="ink.300" lineHeight="1.6">
                {step.description}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>
    </Section>
  )
}
