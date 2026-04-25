# Binary Timber Holdings — Website Build Instructions

## Project Overview

Build a single-page marketing website for **Binary Timber Holdings, LLC**, a tech holding company with two divisions:
1. **AI Software Development** — custom AI solutions and intelligent automation
2. **Custom CNC Manufacturing** — precision machining and bespoke fabrication

The site is a public presence — no e-commerce, no merchandise, no user accounts. Just an elegant marketing page with a working contact form.

## Deployment Target

- **Hosting:** Vercel (via GitHub integration)
- **Repo:** New standalone GitHub repo named `binary-timber-site`
- **Framework:** Static HTML/CSS/JS — no build step required (Vercel auto-detects and serves)
- **Domain:** Will be connected post-deploy (placeholder for now)

## Aesthetic Direction

**Concept:** "Digital meets craft" — the company name itself signals the duality (binary = digital, timber = physical/handmade).

- **Color palette:**
  - Cream/paper background (`#f4ede0`, `#faf6ec`)
  - Deep ink for text (`#1a1612`)
  - Warm wood tones as primary accent (`#8b5a2b`, `#5c3a1a`)
  - Terminal green for digital accent (`#2d8659`, `#4ade80`)
  - Burnt orange accent (`#c8553d`) used sparingly
- **Typography:**
  - Display/body: **Fraunces** (serif, elegant, slightly editorial)
  - Mono/UI: **JetBrains Mono** (developer-feel, used for labels, nav, code blocks)
- **Texture:** Subtle SVG noise grain overlay on everything for tactile feel
- **Motion:** Scroll-triggered reveals, blinking terminal cursor on hero, hover transforms on cards

## Reference Implementation

A working single-file prototype exists. Use it as the design source of truth. The user will provide it as `prototype.html` (or similar) — read it carefully and preserve the visual identity exactly.

## What to Build

### File Structure

Refactor the single HTML file into a clean, maintainable project:

```
binary-timber-site/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── public/
│   ├── favicon.ico
│   └── og-image.png      (placeholder — user will replace)
├── README.md
├── .gitignore
└── vercel.json           (only if needed)
```

### Sections (preserve from prototype)

1. **Fixed nav** — logo mark + 3 links (About, Projects, Contact)
2. **Hero** — headline "Where code meets craft", supporting copy, meta stats, layered visual cards (code snippet card + wood-grain card + binary text)
3. **About** — two-column: narrative copy on left, two division cards on right
4. **Projects** — 2x2 grid of project cards, tagged by division (AI vs CNC)
5. **Contact** — dark section with copy + working contact form
6. **Footer** — copyright + tagline

### Required Improvements Over Prototype

#### 1. Working Contact Form

The prototype form is client-side only (just shows a confirmation). Wire up a real form handler. Use **one of these** (pick whichever is simpler to set up):

- **Web3Forms** (https://web3forms.com) — free, no signup needed beyond access key
- **Formspree** (https://formspree.io) — free tier, requires account

Implementation requirements:
- Form posts to the chosen service's endpoint
- Show real success state on submission
- Show error state if submission fails
- Honeypot field for spam prevention
- Add a `_replyto` or equivalent so replies go to the submitter
- Read the access key / endpoint from a `.env` placeholder OR inline with a clear `// REPLACE_ME` comment so the user can swap it in

Leave a clear `TODO` comment in the README explaining how to set up the form key.

#### 2. SEO + Meta Tags

Add to `<head>`:
- `<title>` — "Binary Timber Holdings — Where Code Meets Craft"
- Meta description (~155 chars)
- Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- Twitter Card tags
- `<link rel="canonical">`
- `<link rel="icon">` pointing to favicon
- Viewport (already in prototype)
- A simple JSON-LD `Organization` schema block

Use `binarytimber.com` as the placeholder canonical URL with a `// TODO: confirm domain` comment.

#### 3. Favicon

Generate a simple favicon based on the "BT" logo mark (black square, white "BT" text, with a diagonal terminal-green accent matching the prototype's `.logo-mark`). 

- Provide as `favicon.ico` (16x16, 32x32 multi-res)
- Also provide `favicon.svg` for modern browsers
- Also provide `apple-touch-icon.png` (180x180)

If generating real `.ico` binaries is impractical, create the SVG version and document in the README how the user can convert it (e.g., realfavicongenerator.net).

#### 4. Accessibility

- All interactive elements keyboard-navigable
- Focus states visible (don't rely on default browser outlines — design them to fit aesthetic)
- `aria-label` on the logo link, nav, form
- Form fields properly associated with labels (already done in prototype, verify)
- Color contrast meets WCAG AA — verify the `#3d342a` body text on `#f4ede0` background passes
- `prefers-reduced-motion` media query that disables scroll reveals and the cursor blink for users who request it
- Semantic HTML: `<main>`, `<section>` with `aria-labelledby`, `<nav>`

#### 5. Performance

- Preload Fraunces and JetBrains Mono with `<link rel="preload">`
- `font-display: swap` (already handled by Google Fonts URL)
- Inline critical CSS for above-the-fold content if straightforward, otherwise leave external
- No JS dependencies — vanilla JS only

#### 6. README

Include:
- One-line project description
- Local dev instructions (just open `index.html` or use a simple static server like `npx serve`)
- Deployment instructions (push to GitHub, import to Vercel)
- How to update the contact form key
- How to swap in a real OG image
- File structure overview

#### 7. `.gitignore`

Standard web project ignores: `.DS_Store`, `node_modules/` (in case anything's added later), `.env`, `.vscode/`, `*.log`.

### What NOT to Change

- **Don't redesign anything.** Keep the visual identity, layout, copy, color palette, typography, and animation choices from the prototype as-is.
- **Don't add a build system** (no Vite, no Webpack, no React, no Tailwind). Plain HTML/CSS/JS only — Vercel will serve it directly.
- **Don't add analytics** unless explicitly asked — user hasn't requested it.
- **Don't invent project content.** The prototype's 4 project cards have generic placeholder copy — leave them as-is with a `// TODO: replace with real projects` comment in the HTML.

## Deployment Steps (for the user, document in README)

1. Create a new GitHub repo: `binary-timber-site`
2. `git init`, commit, push
3. In Vercel dashboard: "Add New Project" → import the repo
4. Vercel auto-detects static site → click Deploy
5. Once deployed, connect custom domain in Project Settings → Domains
6. Set up the contact form: sign up for Web3Forms or Formspree, get the access key, replace the `REPLACE_ME` placeholder in `js/main.js` (or wherever the form handler lives), commit, push — Vercel auto-deploys

## Acceptance Criteria

- [ ] Site renders identically to the prototype (visual parity)
- [ ] Code is split into logical files (`index.html`, `css/styles.css`, `js/main.js`)
- [ ] Contact form actually sends submissions (with placeholder key documented)
- [ ] All meta tags / SEO present
- [ ] Favicon in place (SVG minimum, ICO if feasible)
- [ ] Passes basic accessibility checks (keyboard nav, focus states, reduced motion)
- [ ] README has clear setup + deploy instructions
- [ ] No console errors when loading the page
- [ ] Works in Chrome, Safari, Firefox
- [ ] Mobile responsive (already in prototype — verify after refactor)

## Questions to Ask Before Starting

If anything below is unclear, ask the user before building:

1. Form handler preference — Web3Forms or Formspree?
2. Real contact email to receive submissions
3. Confirm the domain (`binarytimber.com`?)
4. Any real project content ready, or keep placeholders for now?
