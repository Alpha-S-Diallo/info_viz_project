# Player Chemistry Network — American Club Basketball

An interactive directed network graph visualizing passing relationships and player chemistry for the 2025/2026 American Club Basketball winter season.

## What it shows

- **Nodes** — each player on the team, sized by assists per game (bigger = more of a playmaker)
- **Edges** — directed assist relationships (arrow points from passer to receiver)
- **Edge thickness & color** — both encode total assists between two players (thicker and darker orange = stronger connection)

## Features

- **Hover** over a node to highlight that player's connections and fade everything else out
- **Click** a node to see their season stats in the sidebar (PPG, RPG, APG, games played)
- **Filter** edges by chemistry strength — show only strong connections (3+ assists) or weak ones (1 assist)
- **Drag** nodes to reposition and explore the layout

## Data

- `data/season_stats.csv` — individual season stats for 16 players across 4 games
- `data/assist_network.csv` — directed assist records showing who passed to who and how many times per game

## How to run

No build step needed. Open `index.html` in a browser directly, or serve it with any static file server:

```bash
npx serve .
Built with
D3.js v7 — force simulation, scales, and SVG rendering
