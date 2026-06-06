// Lead submission via Web3Forms (https://web3forms.com).
// The access key is a *public* key intended to live in client code.
// Web3Forms provides spam filtering + rate limiting on their side for free.

const ENDPOINT = "https://api.web3forms.com/submit"

export const WEB3FORMS_KEY: string | undefined = import.meta.env
  .VITE_WEB3FORMS_KEY

export interface LeadPayload {
  name: string
  email: string
  company?: string
  message: string
  /** Honeypot field — must stay empty for genuine submissions. */
  botcheck?: string
}

export type LeadResult =
  | { ok: true }
  | { ok: false; error: string }

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  if (!WEB3FORMS_KEY) {
    return {
      ok: false,
      error:
        "Email service not configured. Set VITE_WEB3FORMS_KEY to enable the form.",
    }
  }

  // Honeypot tripped — pretend success, drop silently.
  if (payload.botcheck) {
    return { ok: true }
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `New lead from swat dev — ${payload.name}`,
        from_name: "swat dev website",
        name: payload.name,
        email: payload.email,
        company: payload.company || "—",
        message: payload.message,
      }),
    })

    const data: { success: boolean; message?: string } = await res.json()

    if (data.success) {
      return { ok: true }
    }
    return {
      ok: false,
      error: data.message || "Something went wrong. Please try again.",
    }
  } catch {
    return {
      ok: false,
      error: "Network error. Please check your connection and try again.",
    }
  }
}
