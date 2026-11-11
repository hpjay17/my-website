# Jay Wang: personal website

Portfolio and travel/aviation pages, built as a static site. Live at https://hpjay17.github.io/my-website/

## Features

- Portfolio page with career and organization tabs, skills, a project carousel and certifications
- Two themes (charcoal with sage green, and terminal green), switched with a crossfade where the browser supports View Transitions
- Beyond Work page with interests, an aviation logbook summary, trip cards, a filtered photo gallery and a lightbox
- Travel map with great-circle flight routes, drawn on a flat map that pans endlessly or on a globe you can spin
- Flight replay that flies every route in order, with a scrubber, a date counter and running stats
- Intro screen on Beyond Work: a boarding pass in the sage theme, a terminal login in the green one

## Tech stack

- React, built with Vite; each page (`index.html`, `beyond.html`) is its own small React app
- Plain CSS, shared by both pages through CSS variables for the two themes
- The travel map, globe, replay and intro screen are plain JavaScript in `public/legacy/` that the React page calls into: SVG for the flat map, Canvas 2D for the globe
- GitHub Pages hosting; pushing to `main` builds and publishes the site with GitHub Actions (`.github/workflows/deploy.yml`)
- Python with Pillow for generating the map's dot grid (`tools/make-world-dots.py`)

## Project structure

```
index.html              Portfolio page: the <head>, plus an empty box React fills in
beyond.html             Beyond Work page, the same way
package.json            The libraries the project uses and its commands (dev, build, preview)
vite.config.js          Build settings
src/
  data/
    portfolio.js        Portfolio content
    beyond.js           Beyond Work content: interests, aviation, trips, stops, routes, gallery, intro screen text
  styles/
    shared.css          Theme colors, page shell, top bar and pieces both pages use
    portfolio.css       Portfolio page
    beyond.css          Beyond Work page, travel map and intro screen
  shared/               Components and helpers both pages use: TopBar, Footer, Section, Icon, useTheme, useTyping
  portfolio/            Portfolio page: main.jsx starts it, App.jsx lays it out, one file per section
  beyond/               Beyond Work page, the same way, plus the photo viewer (Lightbox) and TravelMap
public/                 Files copied to the site as they are
  images/               Photos and link-preview images
  files/                Résumé and certificate PDFs
  favicon.svg           Tab icon, with favicon-32.png as a fallback and apple-touch-icon.png for phones
  legacy/
    travel-map.js       Flat travel map: routes, pins, stats, pan and zoom
    map-controls.js     Zoom buttons and drag, flick and pinch handling for the map and globe
    replay.js           Flight replay
    globe.js            Globe view of the travel map
    gate.js             Intro screen on Beyond Work (add ?gate to the URL to see it again)
    helpers.js          Small helpers those scripts share
    world-dots.js       Generated land grid for the map (don't edit by hand)
tools/make-world-dots.py  Rebuilds public/legacy/world-dots.js from Natural Earth outlines
```

Content lives in `src/data/`. The components read it and build the pages, so content edits don't touch the components.

## Adding content

**A trip:** add an entry to `travel` in `src/data/beyond.js` with `place`, `coords`, `date`, `image` and `note`, then add its flights to `routes`. The card, pin, tooltip, replay and stats update from that. Shrink new photos first:

```bash
sips -Z 1600 -s format jpeg -s formatOptions low public/images/beyond/NAME.jpeg
```

**A flight:** add `["From place", "To place"]` to `routes` in `src/data/beyond.js`, in the order flown, using exact place names. A layover airport goes in `stops` first. A year on its own line (`"2027",`) starts that year in the replay.

**A stat:** the travel stats (places, countries, miles) are calculated from the data. Logbook tiles on the aviation section are the `logbook` list in `src/data/beyond.js`.

The notes above each list in `src/data/beyond.js` cover the fields in detail. Map, replay and globe settings are the constants at the top of `travel-map.js`, `replay.js` and `globe.js` in `public/legacy/`.

After editing a file in `public/legacy/`, bump its `?v=` number in `beyond.html` so browsers load the new version instead of a cached one. Everything in `src/` is handled automatically.

## Running locally

Needs Node.js. The first time, from the project folder:

```bash
npm install
```

Then, to preview while editing (the page updates as you save):

```bash
npm run dev
```

Open the address it prints, usually http://localhost:5173. Press Ctrl + C to stop.

`npm run build` makes the finished site in `dist/`, and `npm run preview` serves that folder to check it. Opening `index.html` directly in a browser no longer works; the pages need one of these commands.

## Link previews

Both pages have Open Graph tags for previews on LinkedIn, iMessage and Slack. If the site moves to a custom domain, update the `og:url` and `og:image` addresses in both HTML files.

## How this was built

I built this site with Claude Code as a development tool. I set the requirements and the structure, then gave it scoped prompts with explicit constraints: no frameworks or build step, content kept in the data files, and no change in behavior during refactors. I reviewed and tested every change in the browser, sent back the ones that didn't hold up (an early version of the flight replay drew its lines out of sync with the plane), and cut ideas that didn't fit once I saw them running, like a stock-ticker banner. What the site does and what stays in it were my calls.
