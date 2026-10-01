# unibv-website

Website of Università La Borgata Vezzano.

A static, bilingual university website built with HTML, CSS and vanilla JavaScript. No build step, external dependencies, tracking, payment service or backend.

## Preview

From this directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. If that port is occupied, stop the existing server or choose another port.

## Pages and editing

- `index.html`: home, university overview and research perspectives.
- `staff.html`: staff biographies and research interests.
- `publications.html`: the paper by Avenger Bagnarol and Tanuel Mecchiolli, dated 27 September 2026. Copy the publication article to add another paper, using its actual bibliographic information.
- `apply.html`: local-only application form and result panel.
- `assets/css/style.css`: shared styling; brand colours are variables in `:root`.
- `assets/js/main.js`: reusable header/footer, language switching, mobile menu, photo fallback and local form validation.

Italian and English text is authored in the HTML using `lang="it"` and `lang="en"` blocks. Shared navigation translations live in `main.js`. The selector updates `?lang=it` or `?lang=en`, and internal links carry the selection. Italian is the default. Language selection uses no cookies or localStorage. JavaScript is needed for the shared navigation, English selection and application interaction; page content remains available in Italian without it.

## Images

The original root-level logo is preserved. The site uses its copy at `assets/images/logo.png`.

Add real replacement portraits at:

- `assets/images/avenger_bagnarol.png`: Avenger Bagnarol (current portrait).
- `assets/images/tanuel_mecchiolli.png`: Tanuel Mecchiolli.

Both cards use the supplied portraits, with styled initials as a load-error fallback. Portrait files are not altered; CSS controls the crop.

## Application privacy

Use test details and test PDFs. The application has no external endpoint. It validates required fields and PDF filename/type metadata locally without reading file contents. On valid submission it clears the form and opens the result panel. No payment is taken, documents are not uploaded, and applicant data is not written to storage. Form fields also clear when leaving or restoring the page. The PDF check is a usability check, not a document authenticity check. Successful local confirmation increments only an aggregate integer under `unibv.localApplicationAttempts` in localStorage. This browser-specific development/display counter is not a global application count; inspect it with `unibvDevelopment.getApplicationAttemptCount()` in the console on the application page. If storage is unavailable, the counter stays in memory. No applicant fields or file metadata are stored.

## GitHub Pages

Publish the repository root through GitHub Pages. All asset and navigation paths are relative and support repository subpaths. No compilation or deployment tooling is required.

## Verification

Checked all four pages in both languages at desktop and mobile widths using Chromium: navigation and language persistence, overflow, photo fallbacks, keyboard menu, required fields, PDF selection validation, dialog dismissal, cleared form fields, and no network requests on local submission.

## Publication asset and address

`assets/publications/BET_distribution_final.pdf` is the unchanged supplied PDF. Its title is *The Bifurcated Equiprobability Theory: A Comprehensive Re-examination of All Binary Outcomes*, by Avenger Bagnarol and Tanuel Mecchiolli, dated 27 September 2026. No journal or conference venue is specified in the document. Its original English title is used in both language views. PDF links retain their asset paths and are not rewritten by the language selector.

The website address is Via Roma 61/D, Vezzano (TN), Trentino, Italia (Italy in English). The supplied PDF’s contents and affiliation line remain unchanged. The bottom disclosure remains readable in both languages.
