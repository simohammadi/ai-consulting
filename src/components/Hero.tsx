import { Box, Button, Container, HStack, Stack, Text } from "@chakra-ui/react"
import HeroCanvas from "@/components/HeroCanvas"
import { hero, stats } from "@/content/site"

export function Hero() {
  return (
    <Box
      as="section"
      id="top"
      position="relative"
      minH="100vh"
      display="flex"
      alignItems={{ base: "flex-start", md: "center" }}
      pt={{ base: "104px", md: "0" }}
      overflow="hidden"
    >
      {/* Flow-field animation backdrop */}
      <HeroCanvas style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* Fade the animation into the page below */}
      <Box
        position="absolute"
        inset="0"
        zIndex="1"
        pointerEvents="none"
        bgGradient="to-b"
        gradientFrom="transparent"
        gradientVia="transparent"
        gradientTo="#070708"
      />

      <Container
        maxW="6xl"
        mx="auto"
        px={{ base: 5, md: 8 }}
        position="relative"
        zIndex="2"
      >
        <Stack gap={{ base: 8, md: 10 }} maxW="4xl">
          <HStack
            gap="2"
            alignSelf="flex-start"
            px="3"
            py="1.5"
            rounded="full"
            border="1px solid"
            borderColor="border"
            bg="rgba(255,255,255,0.02)"
          >
            <Box w="6px" h="6px" rounded="full" bg="ink.200" />
            <Text fontSize="sm" color="ink.300" letterSpacing="0.01em">
              {hero.eyebrow}
            </Text>
          </HStack>

          <Stack gap="0">
            {hero.titleLines.map((line, i) => (
              <Text
                key={i}
                as="span"
                fontSize={{ base: "5xl", md: "7xl", lg: "8xl" }}
                fontWeight="700"
                lineHeight="1.05"
                letterSpacing="-0.03em"
                color={i === hero.titleLines.length - 1 ? "ink.400" : "ink.50"}
              >
                {line}
              </Text>
            ))}
          </Stack>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="ink.300"
            maxW="2xl"
            lineHeight="1.6"
          >
            {hero.subtitle}
          </Text>

          <HStack gap="4" flexWrap="wrap">
            <Button
              asChild
              size="lg"
              bg="ink.50"
              color="ink.950"
              fontWeight="600"
              rounded="full"
              px="8"
              _hover={{ bg: "white" }}
            >
              <a href="#contact">{hero.primaryCta}</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              borderColor="border"
              color="ink.100"
              fontWeight="500"
              rounded="full"
              px="8"
              _hover={{ bg: "rgba(255,255,255,0.04)", borderColor: "ink.500" }}
            >
              <a href="#work">{hero.secondaryCta}</a>
            </Button>
          </HStack>

          <HStack
            gap={{ base: 6, md: 12 }}
            pt={{ base: 4, md: 8 }}
            flexWrap="wrap"
          >
            {stats.map((stat) => (
              <Stack key={stat.label} gap="0">
                <Text
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="700"
                  color="ink.50"
                  letterSpacing="-0.02em"
                >
                  {stat.value}
                </Text>
                <Text fontSize="sm" color="ink.400">
                  {stat.label}
                </Text>
              </Stack>
            ))}
          </HStack>
        </Stack>
      </Container>
    </Box>
  )
}
