# Binary Timber Holdings — Website

Static marketing site for Binary Timber Holdings, LLC. Deployed on Vercel.

## Local development

No build step required — just open `index.html` in a browser, or use a simple static server:

```bash
npx serve .
```

## Deploy to Vercel

1. Create a new GitHub repo named `binary-timber-site`
2. Push this directory to it:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USER/binary-timber-site.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
4. Vercel auto-detects a static site — click **Deploy**
5. Connect your custom domain under **Project Settings → Domains**

## TODO: set up the contact form

1. Sign up (free) at [web3forms.com](https://web3forms.com)
2. Create an access key for your receiving email address
3. In `index.html`, find the line:
   ```html
   <input type="hidden" name="access_key" value="REPLACE_ME">
   ```
   Replace `REPLACE_ME` with your key, commit, and push — Vercel auto-deploys.

## TODO: swap in a real OG image

Replace `public/og-image.png` with a 1200×630 PNG and update the `og:image` / `twitter:image`
meta tag URLs in `index.html` with your confirmed domain.

## TODO: confirm domain & email

Search `index.html` for `TODO:` comments — there are three spots for domain and email
placeholders that need real values before launch.

## TODO: generate full favicon set

A base SVG is at `public/favicon.svg`. To generate `.ico` and `apple-touch-icon.png`,
upload the SVG to [realfavicongenerator.net](https://realfavicongenerator.net) and drop
the output into `public/`.

## File structure

```
binary-timber-site/
├── index.html          main page
├── css/
│   └── styles.css      all styles
├── js/
│   └── main.js         scroll reveal + contact form handler
├── public/
│   ├── favicon.svg     base favicon (BT logo mark)
│   ├── favicon.ico     TODO: generate from favicon.svg
│   ├── apple-touch-icon.png  TODO: generate from favicon.svg
│   └── og-image.png    TODO: replace with real 1200×630 image
├── .gitignore
└── README.md
```
