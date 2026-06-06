import { useEffect, useState } from "react"
import { Box, Button, chakra, Container, Flex, HStack } from "@chakra-ui/react"
import { brand, nav } from "@/content/site"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="100"
      transition="all 0.3s ease"
      bg={scrolled ? "rgba(7,7,8,0.72)" : "transparent"}
      backdropFilter={scrolled ? "blur(12px)" : "none"}
      borderBottom="1px solid"
      borderColor={scrolled ? "border" : "transparent"}
    >
      <Container maxW="6xl" px={{ base: 5, md: 8 }}>
        <Flex h="64px" align="center" justify="space-between">
          <chakra.a
            href="#top"
            fontWeight="700"
            fontSize="lg"
            letterSpacing="-0.02em"
            color="ink.50"
          >
            {brand.name}
            <chakra.span color="ink.500">.</chakra.span>
          </chakra.a>

          <HStack gap="8" display={{ base: "none", md: "flex" }}>
            {nav.map((link) => (
              <chakra.a
                key={link.href}
                href={link.href}
                fontSize="sm"
                color="ink.300"
                transition="color 0.2s"
                _hover={{ color: "ink.50" }}
              >
                {link.label}
              </chakra.a>
            ))}
          </HStack>

          <Button
            asChild
            size="sm"
            px="6"
            bg="ink.50"
            color="ink.950"
            fontWeight="600"
            rounded="full"
            _hover={{ bg: "white" }}
          >
            <a href="#contact">Get in touch</a>
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}
