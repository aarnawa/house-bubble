# House Bubble

House hunting with Tinder-style swiping. Prototype with made-up sample data.

**Live preview: https://aarnawa.github.io/house-bubble/**

Best at phone width. Swipe right to like, left to pass, up to request a tour. On desktop you can use the arrow keys, Backspace to undo, and Enter for details.

## Run it locally

```bash
git clone https://github.com/aarnawa/house-bubble.git
cd house-bubble
npm install
npm run dev
```

Then open http://localhost:5173.

## Using this with Claude

Point Claude Code at a clone of this repo, or paste it this:

> Clone https://github.com/aarnawa/house-bubble, read its README and NEXT_STEPS.md, run it, and tell me what you'd improve first.

## Project notes

- **Stack:** Vite, React, TypeScript, Tailwind, framer-motion, lucide-react. No backend; state lives in `localStorage`.
- **Data:** `src/data/listings.ts` holds fictional listings, agents and phone numbers. Photos are hotlinked from Unsplash and don't always match their listing.
- **State:** `src/store/useAppStore.tsx` (reducer, persistence, deck selection).
- **Match %:** `src/lib/match.ts`. A placeholder score, not based on real data. "It's a Match!" fires on every swipe up and at random on about 30% of likes.
- **Rename the app:** change `APP_NAME` in `src/lib/format.ts`.

## In progress

`src/lib/invest.ts` (rental cash flow, cap rate, 5-year return) and `src/lib/rating.ts` (score out of 10, buyer pros and cons) are written, but no screen shows them yet. The next step is adding them to `src/components/ListingDetail.tsx`. Their market assumptions are rough estimates per city and not financial advice.

See [NEXT_STEPS.md](NEXT_STEPS.md) for the product roadmap.
