# Pink Fashions — Profile Page

A single-page, dependency-free static site for **Sheila Pink** (Pink Fashions, Kampala, Uganda):
fashion design, photography & videography, design consultation and bulk clothing production.

> **Demo content.** The name, photos, social handle and contact details in this repo are
> placeholders for a demo build. Replace them before pointing this at a real person — see
> [Editing the content](#editing-the-content).

Live content lives in `index.html`; all styling is in the `<style>` block at the top of that file.

## What's in here

| File | Purpose |
| --- | --- |
| `index.html` | The entire page: markup, styles, meta tags |
| `background.jpg` | Full-page background photo (1280×1920, ~75 KB) |
| `sheila.jpg` | Profile photo, square crop (183×183) |
| `logo.png` | "Pink Fashions" wordmark (700×127) — also used as the favicon |
| `gmail.png`, `whatsapp.png`, `twitter.png`, `telephone.png`, `location.png` | 48×48 icons, shown at 24×24 |
| `scripts/check-assets.mjs` | Verifies local links resolve, every `<img>` has an `alt`, one `<h1>`, LF endings |
| `.htmlvalidate.json`, `.stylelintrc.json` | Linter configs for the markup and the inline CSS |
| `.github/workflows/validate.yml` | CI: HTML + CSS validation and asset checks on every push/PR |

## Run it locally

The page must be served over HTTP (not opened as a `file://` path) so the background image and
icons resolve consistently.

```bash
npm install      # once, installs the dev tooling
npm start        # serves the site at http://localhost:4173
```

No Node? Python works too:

```bash
python3 -m http.server 4173
```

## Validate before pushing

```bash
npm run check    # HTML validation, CSS validation, asset/link + alt-text checks
```

`npm run check` runs three things, each also available on its own:

- `npm run lint:html` — `html-validate` (unclosed tags, invalid nesting, required attributes)
- `npm run lint:css` — `stylelint` (unknown properties, invalid values such as `margin: 1` or
  `vertical-align: auto`, duplicate declarations)
- `npm run check:assets` — every local `src`/`href` resolves, every `<img>` has `alt`,
  exactly one `<h1>`, no CRLF line endings

CI runs the same command on every push and pull request to `main`.

## Deploy

Any static host works — the repo is plain HTML and files. For GitHub Pages:

1. Push to `main`.
2. **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Choose branch `main`, folder `/ (root)`, save.
4. Site appears at `https://<user>.github.io/Profile-page/`.

After the first deploy, update the Open Graph tags in `index.html` with absolute URLs
(`og:url`, `og:image`) so WhatsApp/X/Facebook show a proper preview card.

## Editing the content

All copy, contact details and links are in the `<main>` element of `index.html`:

- **Contact details** appear twice each — once in the `href` (`mailto:`, `tel:`, `wa.me`, profile URL)
  and once in the visible `.contact-value` text. **Update both**, or the link and the visible text
  will disagree. Search for `7449934` or `sheilapink` to find every occurrence.
- **Activities** are the `<li>` items inside `.activities`.
- **Mission statement** is the `<p>` inside `.mission`.
- **Photos**: replace `sheila.jpg` with a square image (≥300×300 recommended) and
  `background.jpg` with a wide/portrait photo ≤200 KB. Keep the filenames, or update the `src`
  attributes to match.
- **Year** in the footer is hardcoded; update it each January.

## Image guidelines

Keep pages fast on mobile networks:

- Resize before committing — a phone photo straight off the camera is 3–8 MB.
- Backgrounds: ≤200 KB, longest edge ≤1920 px (`convert in.jpg -resize 1920x1920\> -strip -quality 76 out.jpg`).
- Use JPEG for photos, PNG only for logos/icons that need transparency.
- Always keep the `width`/`height` attributes on `<img>` so the layout doesn't jump while loading.

## Accessibility notes

The page targets WCAG 2.1 AA: single `<h1>`, semantic landmarks (`header`/`main`/`footer`),
`alt=""` on decorative icons, visible keyboard focus, a skip link, and near-opaque content
cards so text keeps its contrast over the background photo. Please keep these properties
if you redesign — `npm run check` enforces the `alt` attribute rule.

## License

Content, photos and logo © Sheila Pink / Pink Fashions. Code may be reused freely.
