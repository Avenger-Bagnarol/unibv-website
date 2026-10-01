# unibv-website

Website of the fictional university La Borgata Vezzano.

A static, bilingual university parody built with HTML, CSS and vanilla JavaScript. No build step, external dependencies, tracking, payment service or backend.

## Preview

From this directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. If that port is occupied, stop the existing server or choose another port.

## Pages and editing

- `index.html`: home, university overview, demonstration news.
- `staff.html`: staff biographies and research interests.
- `publications.html`: five fictional examples, each marked with an editing comment. Copy an article to add another publication and update both language blocks.
- `apply.html`: local application demonstration and fictional-university reveal.
- `assets/css/style.css`: shared styling; brand colours are variables in `:root`.
- `assets/js/main.js`: reusable header/footer, language switching, mobile menu, photo fallback and local form validation.

Italian and English text is authored in the HTML using `lang="it"` and `lang="en"` blocks. Shared navigation translations live in `main.js`. The selector updates `?lang=it` or `?lang=en`, and internal links carry the selection. Italian is the default. Language selection uses no cookies or localStorage. JavaScript is needed for the shared navigation, English selection and application interaction; page content remains available in Italian without it.

## Images

The original root-level logo is preserved. The site uses its copy at `assets/images/logo.png`.

Add real replacement portraits at:

- `assets/images/picture1.jpg`: Avenger Bagnarol.
- `assets/images/picture2.jpg`: Tanuel Mecchiolli.

Until these files exist, the staff page shows styled initials and a photograph-forthcoming message. No placeholder binary files are included.

## Application privacy

Use fictional details and test PDFs. The application has no external endpoint. It validates required fields and PDF filename/type metadata locally without reading file contents. On valid submission it clears the form and opens the reveal. No payment is taken, documents are not uploaded, and applicant data is not written to storage. Form fields also clear when leaving or restoring the page. The PDF check is a demo usability check, not a document authenticity check.

## GitHub Pages

Publish the repository root through GitHub Pages. All asset and navigation paths are relative and support repository subpaths. No compilation or deployment tooling is required.

## Verification

Checked all four pages in both languages at desktop and mobile widths using Chromium: navigation and language persistence, overflow, photo fallbacks, keyboard menu, required fields, PDF selection validation, dialog dismissal, cleared form fields, and no network requests on demonstration submission.
