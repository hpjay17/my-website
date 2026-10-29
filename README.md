# Jay Wang — Personal Website

Portfolio and "Beyond Work" site, hosted on GitHub Pages at
https://hpjay17.github.io/my-website/

Plain HTML, CSS, and JavaScript: no build step or dependencies. Pushing to `main` publishes the site.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Portfolio page: career, organizations, skills, projects, certifications |
| `beyond.html` | Beyond Work page: interests, aviation, travel map, photo gallery |
| `script.js` | Portfolio content (`templateData`) and page behavior |
| `beyond.js` | Beyond Work content (`beyondData`), travel map, gallery |
| `world-dots.js` | Dot-grid world map data used by the travel map |
| `styles.css` | Styles for both pages, including the blue and green themes |
| `images/` | Profile photo, link-preview card (`preview.jpg`), project placeholders |
| `images/beyond/` | Interest, aviation, and travel photos, plus the Beyond page preview |
| `images/beyond/gallery/` | Photo gallery images |
| `files/` | Résumé and certificate PDFs |
| `favicon.svg`, `apple-touch-icon.png` | Browser tab and home-screen icons |

## Updating content

Content lives in the data objects at the top of `script.js` and `beyond.js`; edit those rather than the HTML.

**Adding a trip:** see the comment above `travel:` in `beyond.js`. In short: add the photo, add a `travel` entry with `coords`, then add any map lines to `routes`.

**Adding a photo:** shrink it first so pages load quickly:

```bash
sips -Z 1600 -s formatOptions 72 images/beyond/NAME.jpeg
```

iPhone `.HEIC` photos need converting first: `sips -s format jpeg IN.HEIC --out OUT.jpeg`

**Changing the résumé:** replace the PDF in `files/` and update the `CV` link in `script.js`.

## Link previews

Both pages have Open Graph tags (`og:*`) for previews on LinkedIn, iMessage, and Slack. If the site moves to a custom domain, update the `og:url` and `og:image` addresses in both HTML files.
