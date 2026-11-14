# Tehj Patel — Software Engineering Portfolio

[View the portfolio](https://t3hj.github.io/portfolio-website/)

A static HTML, CSS and JavaScript portfolio for graduate and junior software
engineering applications. It presents project evidence, implementation decisions,
current limitations, professional experience and a downloadable CV.

## Start here

- **Local Lens:** final-year civic reporting project, built with Streamlit,
  Python, Supabase and optional vision analysis.
- **RoboThink Register:** operational staff software with React, TypeScript,
  Supabase and tested attendance/progression rules.
- **Sillage:** a public, device-local fragrance explorer with offline support.
- **ForgeFlow:** repository-analysis prototype; incomplete pipeline connections
  are explicitly labelled.
- **Sentinel:** deterministic security-operations simulation with controlled,
  human-approved remediation; not a live AI analyst.

## Preview locally

No npm dependencies, build step or credentials are required for the main website.

```sh
git clone https://github.com/t3hj/portfolio-website.git
cd portfolio-website
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://localhost:4173`. On Windows, use `python` instead of `python3` if needed.
A local HTTP server supports demo assets and fetch requests more reliably than
opening HTML with a `file:` URL.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main portfolio: work, about, skills, experience, education and contact |
| `styles/home.css`, `styles/layout.css` | Main page styling and responsive layouts |
| `scripts/main.js` | Project filters, carousel, disclosure controls and interactions |
| `scripts/github-stats.js` | Public GitHub statistics with a fallback state |
| `about.html`, `skills.html`, `contact.html` | Additional pages retained for direct links |
| `projects.html` | Compatibility redirect to the main projects section |
| `assets/projects/` | Project captures, provenance notes and screenshot manifest |
| `demos/` | Browser demos; see the attribution and adaptation notes there |
| `Tehj_Patel_CV.pdf` | Public CV download |

## Review before publishing

1. Check desktop and phone layouts, keyboard navigation and reduced-motion behaviour.
2. Exercise each project filter, carousel arrows and the Other Projects disclosure.
3. Check local links, screenshots and the CV download. Keep LinkedIn URLs consistent.
4. Verify each demo's access label: public, account required, staff-only or prototype.
5. Keep claims aligned with repository code. Do not imply model integration,
   cross-device sync or production readiness where only a prototype exists.
6. Use only consented images or synthetic data. Staff/student records and private
   collection backups must never appear in screenshots.
7. Update the screenshot manifest when replacing a capture, preserving attribution.

The homepage uses email and social links; the separate contact page has a form.
Do not submit test messages to the live form when checking layout.
Public GitHub stats and externally hosted fonts/icons require network access.

## Deployment

The live website is served by GitHub Pages. Changes on a review branch are
proposals; merging to the publishing branch can update the live site. Review the
pull request before merging. No deployment command is needed for local preview.

## License

See [LICENSE](LICENSE) for the website licence. Demo and third-party asset licences
are documented separately in [demos](demos/README.md) and
[project screenshots](assets/projects/README.md).
