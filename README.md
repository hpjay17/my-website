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
| `shared.js` | Behavior both pages use: theme switcher, smooth scrolling, section fade-in, typewriter effect |
| `gate.js` | Entry gate on `beyond.html`: boarding pass (blue theme) or terminal login (green theme), once per visit. Add `?gate` to the URL to see it again |
| `world-dots.js` | Dot-grid world map data used by the travel map (generated, don't edit by hand) |
| `tools/make-world-dots.py` | Rebuilds `world-dots.js` from Natural Earth coastlines |
| `styles.css` | Styles for both pages, including the blue and green themes |
| `images/` | Profile photo, link-preview card (`preview.jpg`), project placeholders |
| `images/beyond/` | Interest, aviation, and travel photos, plus the Beyond page preview |
| `images/beyond/gallery/` | Photo gallery images |
| `files/` | Résumé and certificate PDFs |
| `favicon.svg`, `apple-touch-icon.png` | Browser tab and home-screen icons |

## Updating content

Content lives in the data objects at the top of `script.js` and `beyond.js`; edit those rather than the HTML.

**Adding a trip:** see the comment above `travel:` in `beyond.js`. In short: add the photo, add a `travel` entry with `coords`, then add any map lines to `routes`.

```bash
sips -Z 1600 -s formatOptions 72 images/beyond/NAME.jpeg
```

**Travel map settings:** zoom regions, padding, and animation speeds are the `MAP_*` settings under "Travel map" in `beyond.js`. The map's colors and sizes are the `.map-*` rules in `styles.css`. To change the dot grid itself, run `python3 tools/make-world-dots.py` (see the notes at the top of the script).

**Changing the resume:** replace the PDF in `files/` and update the `CV` link in `script.js`.

## Link previews

Both pages have Open Graph tags (`og:*`) for previews on LinkedIn, iMessage, and Slack. If the site moves to a custom domain, update the `og:url` and `og:image` addresses in both HTML files.
