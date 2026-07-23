# Deploying this site to Vercel via GitHub

## 1. Push to GitHub
Put these two files at the **root** of your repo (not in a subfolder):
- `index.html`
- `vercel.json`

```bash
git add index.html vercel.json
git commit -m "Add site"
git push
```

## 2. Import into Vercel
1. Go to https://vercel.com/new
2. Select "Import Git Repository" and pick your repo
3. Vercel will auto-detect it as a static site (no framework) because of `index.html` at the root
4. Leave Build Command / Output Directory as default (or blank) — `vercel.json` already tells it there's nothing to build
5. Click **Deploy**

That's it — Vercel will serve `index.html` at your project's root URL (e.g. `your-project.vercel.app`).

## Notes
- Any time you push a new commit to the connected branch, Vercel auto-redeploys.
- If you later add more pages, just add more `.html` files at the root or in folders — Vercel serves static files directly, no config needed beyond what's here.
