import { Box, Container } from "@chakra-ui/react"
import type { ReactNode } from "react"

interface SectionProps {
  id?: string
  children: ReactNode
  maxW?: string
}

export function Section({ id, children, maxW = "6xl" }: SectionProps) {
  return (
    <Box
      as="section"
      id={id}
      scrollMarginTop="80px"
      py={{ base: 16, md: 28 }}
      position="relative"
    >
      <Container maxW={maxW} mx="auto" px={{ base: 5, md: 8 }}>
        {children}
      </Container>
    </Box>
  )
}
