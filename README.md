# THAHASSUL Results Portal

Professional results portal generated from the uploaded workbook `sur_yaseen_publishable_results.xlsx`.

## Included features
- THAHASSUL branding with premium dark educational theme
- Top 10 Ladies and Top 10 Gents
- Built from **full scorers only**
- Group leaderboard sorted by full-scorer count
- Click-through modal for full scorers inside each group
- Protected mobile lookup returning only Name, Group, and Place
- Malayalam questions and answer key
- YouTube class links section

## Ranking logic used
- Top 10 sections: full scorers only, ordered by earliest completion
- Group leaderboard: highest number of full scorers first
- Group detail modal: sorted by earliest completion
- Mobile lookup: searched across all published participants, but returns only public-safe fields

## Project structure
- `public/` - static frontend
- `public/data/public_results.json` - safe public dataset
- `functions/api/lookup.js` - serverless lookup endpoint
- `private/lookup_data.json` - private hashed mobile lookup data

## Deploy
### Cloudflare Pages
1. Upload the `public` folder as your site content.
2. Add the `functions` folder for Pages Functions.
3. Keep `private/lookup_data.json` outside the public folder.
4. Ensure `/api/lookup` resolves to the included function.

### Netlify
You can adapt the same lookup logic into a Netlify Function.

## Files generated
- Public participants: 1560
- Full scorers: 699
- Ladies full scorers: 673
- Gents full scorers: 26
- Groups with full scorers: 93
