# Jay Wang — Personal Website

Portfolio and "Beyond Work" site, hosted on GitHub Pages at
https://hpjay17.github.io/my-website/

Plain HTML, CSS, and JavaScript: no build step or dependencies. Pushing to `main` publishes the site.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Portfolio page: career, organizations, skills, projects, certifications |
| `beyond.html` | Beyond Work page: interests, aviation, travel map, photo gallery |
| `data/portfolio.js` | Portfolio content (`portfolioData`) |
| `data/beyond.js` | Beyond Work content (`beyondData`): interests, aviation, trips, stops, routes, gallery |
| `data/world-dots.js` | Dot-grid world map used by the travel map (generated, don't edit by hand) |
| `js/portfolio.js` | Renders the portfolio page |
| `js/beyond.js` | Renders the Beyond Work page: travel map, gallery, lightbox |
| `js/globe.js` | Globe view of the travel map (the "Globe" button): drag to spin, follows the replay |
| `js/shared.js` | Behavior both pages use: theme switcher with its circular reveal, smooth scrolling, section fade-in, typewriter effect |
| `js/gate.js` | Entry gate on `beyond.html`: boarding pass (blue theme) or terminal login (green theme), once per visit. Add `?gate` to the URL to see it again |
| `css/styles.css` | Styles for both pages, including the blue and green themes |
| `tools/make-world-dots.py` | Rebuilds `data/world-dots.js` from Natural Earth coastlines |
| `images/` | Profile photo, link-preview card (`preview.jpg`), project placeholders |
| `images/beyond/` | Interest, aviation, and travel photos, plus the Beyond page preview |
| `images/beyond/gallery/` | Photo gallery images |
| `files/` | Résumé and certificate PDFs |
| `favicon.svg`, `apple-touch-icon.png` | Browser tab and home-screen icons |

## Updating content

Content lives in `data/portfolio.js` and `data/beyond.js`; edit those rather than the HTML or the files in `js/`.

**Adding a trip:** see the note above `travel:` in `data/beyond.js`. In short: add the photo, add a `travel` entry with `coords`, then add any map lines to `routes`.

```bash
sips -Z 1600 -s formatOptions 72 images/beyond/NAME.jpeg
```

**Flight replay:** the map's Replay button flies every entry in `routes` in the order listed, so keep new flights in order. A year on its own line (`"2027",`) starts that year in the replay. `REPLAY_MS` in `js/beyond.js` sets how long it takes.

**Globe settings:** spin speed, how quickly a flick slows down, how high routes arc, where it starts facing, the zoom limit and the pin sizes are the `GLOBE_*` settings at the top of `js/globe.js`. It uses the same places, routes and colors as the flat map, so there's nothing extra to update.

**Travel map settings:** the flat map's zoom limit, how far north and south it can be dragged, how quickly a flung map slows down, and padding around the pins are the `MAP_*` settings under "Travel map settings" in `js/beyond.js`. The map's colors and sizes are the `.map-*` rules in `css/styles.css`. To change the dot grid itself, run `python3 tools/make-world-dots.py` (see the notes at the top of the script).

**Changing the resume:** replace the PDF in `files/` and update the `CV` link in `data/portfolio.js`.

**After editing a file,** bump its `?v=` number in the HTML so browsers load the new version instead of a cached one.

## Link previews

Both pages have Open Graph tags (`og:*`) for previews on LinkedIn, iMessage, and Slack. If the site moves to a custom domain, update the `og:url` and `og:image` addresses in both HTML files.
