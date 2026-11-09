# House Bubble: Next Steps

## Run it
```
npm install
npm run dev     # http://localhost:5173
```
Controls: drag cards, or use ← pass, → like, ↑ request tour, Backspace undo, Enter details.

## From prototype to product
1. **Real listings.** MLS data comes through IDX/RESO Web API feeds from a broker partner. Licensed APIs like RentCast, ATTOM, or Realtor/Bridge data can bootstrap this. Zillow's API is not open for this use.
2. **Accounts and sync.** Add auth (Supabase/Firebase) and move likes and prefs from localStorage to a database.
3. **Smarter matching.** Learn from swipes (price, style, location embeddings of photos) so the match % actually means something.
4. **Real "matches."** Route super-likes and tour requests to agents as paid leads, with in-app chat and tour scheduling.
5. **Couples mode.** Two people swipe on the same deck, and a home matches only when both like it. This is a strong differentiator.
6. **Native app.** Port to React Native/Expo. The data, store, and match logic carry over almost unchanged.

## Business model ideas
- Pay-per-lead or subscription for agents (like Zillow Premier Agent)
- Featured placement for listings and new developments
- Mortgage pre-approval and rental application referrals
