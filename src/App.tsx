import { Box } from "@chakra-ui/react"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Services } from "@/components/Services"
import { Projects } from "@/components/Projects"
import { Process } from "@/components/Process"
import { Faq } from "@/components/Faq"
import { Contact } from "@/components/Contact"
import { Footer } from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <Box bg="bg" color="ink.200" minH="100vh" overflowX="hidden">
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <Process />
      <Faq />
      <Contact />
      <Footer />
      <Toaster />
    </Box>
  )
}

export default App
