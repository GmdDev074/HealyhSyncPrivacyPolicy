# HealthSync Legal Pages

Static **Privacy Policy** and **Terms & Conditions** pages for the [HealthSync](https://play.google.com/store/apps/details?id=com.health.sync) Android app (`com.health.sync`).

The site is built with plain **HTML + CSS + JavaScript** (no framework) and deploys automatically to **GitHub Pages** on every push to `main` / `master`.

---

## Live links

After the first successful deploy, your pages will be available at:

| Page | URL |
|------|-----|
| **Home** | `https://<github-username>.github.io/<repository-name>/` |
| **Privacy Policy** | `https://<github-username>.github.io/<repository-name>/privacy-policy.html` |
| **Terms & Conditions** | `https://<github-username>.github.io/<repository-name>/terms-and-conditions.html` |

> **Example** — if your repo is `gmddev074/HealyhSyncPrivacyPolicy`, the Privacy Policy URL is:  
> `https://gmddev074.github.io/HealyhSyncPrivacyPolicy/privacy-policy.html`

Each GitHub Actions run also prints these URLs in the **Workflow summary** tab.

---

## What this project does

1. **Legal pages** — Professional Privacy Policy and Terms & Conditions for HealthSync, suitable for Google Play Store compliance.
2. **Centralized branding** — App name, email, Play Store package, and URLs live in one `Constants` class (`js/constants.js`).
3. **Template placeholders** — HTML uses `{{APP_NAME}}`, `{{APP_EMAIL}}`, etc.; `js/main.js` replaces them at runtime.
4. **Automatic “Last Updated” dates** — Dates are **not** hard-coded. A build script reads **git history** and sets:
   - `PRIVACY_LAST_UPDATED` from the latest commit touching `privacy-policy.html`, `js/constants.js`, or `css/style.css`
   - `TERMS_LAST_UPDATED` from the latest commit touching `terms-and-conditions.html`, `js/constants.js`, or `css/style.css`
   - `COPYRIGHT_YEAR` from the current year at build time
5. **CI/CD** — GitHub Actions builds, verifies, and deploys to GitHub Pages. Pull requests run a **test build** without publishing.

---

## Project structure

```
.
├── .github/workflows/deploy-pages.yml   # GitHub Actions: build + deploy
├── .gitignore                           # Keeps secrets, generated files, and junk out of git
├── .nojekyll                            # Ensures GitHub Pages serves all files correctly
├── index.html                           # Landing page with links to legal docs
├── privacy-policy.html                  # Privacy Policy
├── terms-and-conditions.html            # Terms & Conditions
├── css/style.css                        # Shared styles
├── js/
│   ├── constants.js                     # Manual config (edit this)
│   ├── constants.generated.js           # Auto-generated dates (do not commit)
│   └── main.js                          # Injects {{PLACEHOLDERS}} into pages
├── scripts/generate-dates.mjs           # Builds constants.generated.js from git
├── package.json                         # `npm run build` / `npm run preview`
└── README.md
```

---

## Configuration

Edit **`js/constants.js`** to change branding:

| Constant | Current value |
|----------|----------------|
| `APP_NAME` | HealthSync |
| `APP_EMAIL` | gmddev074@gmail.com |
| `PLAY_STORE_PACKAGE` | com.health.sync |
| `MIN_AGE` | 13 |
| `SERVICE_DESCRIPTION` | Health/wellness tracking description |

Do **not** edit `js/constants.generated.js` — it is recreated on every build.

---

## Local development

### Prerequisites

- Node.js **18+**

### Preview locally

```bash
npm run build    # Generate last-updated dates from git history
npm run preview  # Serve at http://localhost:4173
```

Open:

- http://localhost:4173/privacy-policy.html  
- http://localhost:4173/terms-and-conditions.html  

> If you open HTML files directly in the browser (`file://`), `constants.generated.js` may be missing. Always run `npm run build` first.

---

## GitHub Pages setup (one-time)

1. Push this repository to GitHub.
2. Go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Push to `main` or `master` — the workflow verifies and deploys automatically.

### Workflow behavior

| Event | What happens |
|-------|----------------|
| Push to `main` / `master` | Build → verify → **deploy** to GitHub Pages |
| Pull request | Build → verify → **no deploy** (test run only) |
| Manual | Run **Deploy GitHub Pages** from the Actions tab |

---

## How automatic dates work

When you change legal content and push:

1. GitHub Actions checks out the full git history (`fetch-depth: 0`).
2. `node scripts/generate-dates.mjs` inspects commit dates for watched files.
3. `js/constants.generated.js` is written with fresh dates.
4. The site (including generated file) is deployed.

**Watched files**

| Date field | Files |
|------------|-------|
| Privacy “Last Updated” | `privacy-policy.html`, `js/constants.js`, `css/style.css` |
| Terms “Last Updated” | `terms-and-conditions.html`, `js/constants.js`, `css/style.css` |

---

## What is ignored by git

`.gitignore` excludes generated artifacts, dependencies, secrets, OS/editor junk, logs, archives, and local tool folders so only source files are tracked. Notably:

- `js/constants.generated.js` (rebuilt in CI)
- `node_modules/`, lockfiles, `.env*`
- Editor folders (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Temporary and backup files

---

## Play Store usage

Use the live GitHub Pages URLs in Google Play Console:

- **Privacy policy URL** → `…/privacy-policy.html`
- **Terms URL** (if required) → `…/terms-and-conditions.html`

---

## License

All rights reserved © HealthSync.
