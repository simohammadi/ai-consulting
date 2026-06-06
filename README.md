# swat dev — AI Consulting

A single-page marketing & lead-generation site for **swat dev**, an AI consulting firm.
Dark, grayscale, premium aesthetic with an animated flow-field hero inspired by
[antigravity.google](https://antigravity.google/).

## Stack

- [Bun](https://bun.sh) — package manager / runtime
- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript
- [Chakra UI v3](https://chakra-ui.com) — component system (custom dark grayscale theme)
- Canvas flow-field hero animation (no external animation deps)
- [Web3Forms](https://web3forms.com) — serverless lead/email delivery with free spam + rate limiting
- GitHub Actions → GitHub Pages deployment

## Local development

```bash
bun install
bun dev
```

Then open the printed local URL.

## Contact form / email

The contact form posts to Web3Forms. You need a (free) public access key:

1. Go to [web3forms.com](https://web3forms.com) and enter the email address where you
   want to receive leads — they email you an **access key** (a UUID).
2. For local dev, copy `.env.example` to `.env` and set:

   ```
   VITE_WEB3FORMS_KEY=your-access-key
   ```

3. For production, the key is read from the GitHub Actions secret `WEB3FORMS_KEY`
   (see below). The key is a public client-side key and is safe to expose.

Web3Forms handles spam filtering and rate limiting on their side, and a hidden
honeypot field is included client-side as a first line of defense.

## Build

```bash
bun run build      # outputs to dist/
bun run preview    # preview the production build
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with Bun and
publishes `dist/` to GitHub Pages. The site is served at:

```
https://simohammadi.github.io/ai-consulting/
```

The Vite `base` is set to `/ai-consulting/` accordingly.

### Required repo configuration

- **Settings → Pages → Build and deployment → Source: GitHub Actions**
- **Settings → Secrets and variables → Actions → New repository secret:**
  - `WEB3FORMS_KEY` = your Web3Forms access key

## Editing content

All copy (hero, services, projects/case studies, process, FAQs, contact) lives in
[`src/content/site.ts`](src/content/site.ts). Edit that one file to update the site.

The hero animation lives in [`src/components/HeroCanvas.tsx`](src/components/HeroCanvas.tsx).
