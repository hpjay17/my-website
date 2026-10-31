# Jay Wang: personal website

Portfolio and travel/aviation pages, built as a static site. Live at https://hpjay17.github.io/my-website/

## Features

- Portfolio page with career and organization tabs, skills, a project carousel and certifications
- Two themes (cyan and terminal green), switched with a crossfade where the browser supports View Transitions
- Beyond Work page with interests, an aviation logbook summary, trip cards, a filtered photo gallery and a lightbox
- Travel map with great-circle flight routes, drawn on a flat map that pans endlessly or on a globe you can spin
- Flight replay that flies every route in order, with a scrubber, a date counter and running stats
- Intro screen on Beyond Work: a boarding pass in the cyan theme, a terminal login in the green one

## Tech stack

- HTML, CSS and plain JavaScript, with no framework, build step or dependencies
- SVG for the flat map, Canvas 2D for the globe
- GitHub Pages hosting; pushing to `main` publishes the site
- Python with Pillow for generating the map's dot grid (`tools/make-world-dots.py`)

## Project structure

```
index.html              Portfolio page
beyond.html             Beyond Work page
css/styles.css          Styles for both pages and both themes
data/
  portfolio.js          Portfolio content
  beyond.js             Beyond Work content: interests, aviation, trips, stops, routes, gallery
  world-dots.js         Generated land grid for the map (don't edit by hand)
js/
  shared.js             Theme switcher, scrolling, section fade-in, typing effect
  portfolio.js          Renders the portfolio page
  beyond.js             Renders the Beyond Work page sections, gallery and lightbox
  travel-map.js         Flat travel map: routes, pins, stats, pan and zoom
  replay.js             Flight replay
  globe.js              Globe view of the travel map
  gate.js               Intro screen on Beyond Work (add ?gate to the URL to see it again)
images/                 Photos and link-preview images
files/                  Résumé and certificate PDFs
tools/make-world-dots.py  Rebuilds data/world-dots.js from Natural Earth outlines
```

Content lives in `data/`. The scripts in `js/` read it and build the pages, so content edits don't touch the HTML or JavaScript.

## Adding content

**A trip:** add an entry to `travel` in `data/beyond.js` with `place`, `coords`, `date`, `image` and `note`, then add its flights to `routes`. The card, pin, tooltip, replay and stats update from that. Shrink new photos first:

```bash
sips -Z 1600 -s format jpeg -s formatOptions low images/beyond/NAME.jpeg
```

**A flight:** add `["From place", "To place"]` to `routes` in `data/beyond.js`, in the order flown, using exact place names. A layover airport goes in `stops` first. A year on its own line (`"2027",`) starts that year in the replay.

**A stat:** the travel stats (places, countries, miles) are calculated from the data. Logbook tiles on the aviation section are the `logbook` list in `data/beyond.js`.

The notes above each list in `data/beyond.js` cover the fields in detail. Map, replay and globe settings are the constants at the top of `js/travel-map.js`, `js/replay.js` and `js/globe.js`.

After editing a file, bump its `?v=` number in the HTML so browsers load the new version instead of a cached one.

## Running locally

From the project folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Link previews

Both pages have Open Graph tags for previews on LinkedIn, iMessage and Slack. If the site moves to a custom domain, update the `og:url` and `og:image` addresses in both HTML files.

## How this was built

I built this site with Claude Code as a development tool. I set the requirements and the structure, then gave it scoped prompts with explicit constraints: no frameworks or build step, content kept in the data files, and no change in behavior during refactors. I reviewed and tested every change in the browser, sent back the ones that didn't hold up (an early version of the flight replay drew its lines out of sync with the plane), and cut ideas that didn't fit once I saw them running, like a stock-ticker banner. What the site does and what stays in it were my calls.
