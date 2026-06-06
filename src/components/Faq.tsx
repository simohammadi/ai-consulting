import { useState } from "react"
import { Box, Collapsible, Flex, Heading, Stack, Text } from "@chakra-ui/react"
import { faqs } from "@/content/site"
import { Section } from "@/components/Section"

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="faq" maxW="4xl">
      <Stack gap={{ base: 10, md: 14 }}>
        <Heading
          as="h2"
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="700"
          letterSpacing="-0.02em"
          color="ink.50"
          textAlign="center"
        >
          Frequently asked
        </Heading>

        <Stack gap="0">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <Box
                key={faq.question}
                borderTop="1px solid"
                borderColor="border"
                borderBottom={i === faqs.length - 1 ? "1px solid" : undefined}
                borderBottomColor="border"
              >
                <Collapsible.Root
                  open={isOpen}
                  onOpenChange={() => setOpen(isOpen ? null : i)}
                >
                  <Collapsible.Trigger
                    width="full"
                    cursor="pointer"
                    textAlign="left"
                    py="5"
                    bg="transparent"
                    border="none"
                  >
                    <Flex justify="space-between" align="center" gap="6">
                      <Text
                        fontSize={{ base: "md", md: "lg" }}
                        fontWeight="500"
                        color="ink.100"
                      >
                        {faq.question}
                      </Text>
                      <Box
                        as="span"
                        color="ink.400"
                        fontSize="2xl"
                        lineHeight="1"
                        transform={isOpen ? "rotate(45deg)" : "rotate(0deg)"}
                        transition="transform 0.2s ease"
                        flexShrink="0"
                      >
                        +
                      </Box>
                    </Flex>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      color="ink.400"
                      lineHeight="1.7"
                      pb="5"
                      pr={{ base: 0, md: 12 }}
                    >
                      {faq.answer}
                    </Text>
                  </Collapsible.Content>
                </Collapsible.Root>
              </Box>
            )
          })}
        </Stack>
      </Stack>
    </Section>
  )
}
