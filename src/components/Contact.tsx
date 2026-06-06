import { useState } from "react"
import {
  Button,
  chakra,
  Field,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"
import { submitLead } from "@/lib/web3forms"
import { brand, contact } from "@/content/site"
import { Section } from "@/components/Section"

interface FormState {
  name: string
  email: string
  company: string
  message: string
  botcheck: string
}

const EMPTY: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
  botcheck: "",
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
    }

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = "Please enter your name."
    if (!form.email.trim()) next.email = "Please enter your email."
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email."
    if (!form.message.trim())
      next.message = "Tell us a little about your project."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    const result = await submitLead(form)
    setSubmitting(false)

    if (result.ok) {
      toaster.create({
        title: "Thanks — message sent.",
        description: "We'll get back to you within one business day.",
        type: "success",
      })
      setForm(EMPTY)
      setErrors({})
    } else {
      toaster.create({
        title: "Couldn't send your message",
        description: result.error,
        type: "error",
      })
    }
  }

  return (
    <Section id="contact" maxW="4xl">
      <Stack gap={{ base: 8, md: 12 }} align="center" textAlign="center">
        <Stack gap="4" maxW="2xl">
          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="700"
            lineHeight="1.15"
            letterSpacing="-0.02em"
            color="ink.50"
          >
            {contact.heading}
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="ink.300">
            {contact.subheading}
          </Text>
        </Stack>

        <chakra.form
          onSubmit={onSubmit}
          w="full"
          maxW="2xl"
          bg="rgba(255,255,255,0.02)"
          border="1px solid"
          borderColor="border"
          rounded="2xl"
          p={{ base: 6, md: 10 }}
          textAlign="left"
          backdropFilter="blur(8px)"
        >
          <Stack gap="5">
            <Flex direction={{ base: "column", md: "row" }} gap="5">
              <Field.Root invalid={!!errors.name} flex="1">
                <Field.Label color="ink.200">Name</Field.Label>
                <Input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Jane Doe"
                  variant="subtle"
                  size="lg"
                  px="4"
                  h="12"
                  rounded="xl"
                  bg="bg.panel"
                  borderColor="border"
                  _placeholder={{ color: "ink.500" }}
                />
                <Field.ErrorText>{errors.name}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.email} flex="1">
                <Field.Label color="ink.200">Email</Field.Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="jane@company.com"
                  variant="subtle"
                  size="lg"
                  px="4"
                  h="12"
                  rounded="xl"
                  bg="bg.panel"
                  borderColor="border"
                  _placeholder={{ color: "ink.500" }}
                />
                <Field.ErrorText>{errors.email}</Field.ErrorText>
              </Field.Root>
            </Flex>

            <Field.Root>
              <Field.Label color="ink.200">
                Company{" "}
                <Text as="span" color="ink.500" fontWeight="400">
                  (optional)
                </Text>
              </Field.Label>
              <Input
                value={form.company}
                onChange={set("company")}
                placeholder="Acme Inc."
                variant="subtle"
                size="lg"
                px="4"
                h="12"
                rounded="xl"
                bg="bg.panel"
                borderColor="border"
                _placeholder={{ color: "ink.500" }}
              />
            </Field.Root>

            <Field.Root invalid={!!errors.message}>
              <Field.Label color="ink.200">What are you building?</Field.Label>
              <Textarea
                value={form.message}
                onChange={set("message")}
                placeholder="A few lines on your goal, timeline, and stack…"
                rows={4}
                variant="subtle"
                p="4"
                rounded="xl"
                bg="bg.panel"
                borderColor="border"
                _placeholder={{ color: "ink.500" }}
              />
              <Field.ErrorText>{errors.message}</Field.ErrorText>
            </Field.Root>

            {/* Honeypot — hidden from humans, catches bots */}
            <Input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.botcheck}
              onChange={set("botcheck")}
              aria-hidden="true"
              position="absolute"
              left="-9999px"
              w="1px"
              h="1px"
            />

            <Button
              type="submit"
              loading={submitting}
              loadingText="Sending…"
              size="lg"
              px="10"
              bg="ink.50"
              color="ink.950"
              fontWeight="600"
              rounded="full"
              _hover={{ bg: "white" }}
            >
              {contact.buttonLabel}
            </Button>

            <Text fontSize="sm" color="ink.500" textAlign="center">
              Prefer email? Reach us at{" "}
              <chakra.a
                href={`mailto:${brand.email}`}
                color="ink.200"
                textDecoration="underline"
                textUnderlineOffset="3px"
              >
                {brand.email}
              </chakra.a>
            </Text>
          </Stack>
        </chakra.form>
      </Stack>
    </Section>
  )
}
