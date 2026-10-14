# unibv-website

Website of Università La Borgata Vezzano.

A static, bilingual university website built with HTML, CSS and vanilla JavaScript. No build step, external dependencies, tracking, payment service or custom backend. The application country counter uses Supabase directly from the browser.

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
- `apply.html`: locally validated application form and result panel, with a Supabase country counter.
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

Use test details and test PDFs. The application sends only the exact country input to the Supabase `increment_application` RPC after successful validation. Country values are not trimmed or normalized. It validates required fields and PDF filename/type metadata locally without reading file contents. On valid submission it clears the form and opens the result panel. No payment is taken, documents are not uploaded, and applicant data is not written to storage. Form fields also clear when leaving or restoring the page. The PDF check is a usability check, not a document authenticity check. Successful local confirmation increments only an aggregate integer under `unibv.localApplicationAttempts` in localStorage. This browser-specific development/display counter is not a global application count; inspect it with `unibvDevelopment.getApplicationAttemptCount()` in the console on the application page. If storage is unavailable, the counter stays in memory. No other applicant fields or file metadata are stored or sent. Supabase stores the country and its aggregate application count.

## GitHub Pages

Publish the repository root through GitHub Pages. All asset and navigation paths are relative and support repository subpaths. No compilation or deployment tooling is required.

## Verification

Checked all four pages in both languages at desktop and mobile widths using Chromium: navigation and language persistence, overflow, photo fallbacks, keyboard menu, required fields, PDF selection validation, dialog dismissal, cleared form fields, and local submission behavior. See below for testing the Supabase integration.

## Publication asset and address

`assets/publications/BET_distribution_final.pdf` is the unchanged supplied PDF. Its title is *The Bifurcated Equiprobability Theory: A Comprehensive Re-examination of All Binary Outcomes*, by Avenger Bagnarol and Tanuel Mecchiolli, dated 27 September 2026. No journal or conference venue is specified in the document. Its original English title is used in both language views. PDF links retain their asset paths and are not rewritten by the language selector.

The website address is Via Roma 61/D, Vezzano (TN), Trentino, Italia (Italy in English). The supplied PDF’s contents and affiliation line remain unchanged. The bottom disclosure remains readable in both languages.

## Supabase application counter

At the top of `assets/js/main.js`, replace `YOUR_SUPABASE_URL` and
`YOUR_SUPABASE_PUBLISHABLE_KEY` in the clearly marked configuration section with
your project's origin URL (for example, `https://<project-ref>.supabase.co`,
without `/rest/v1/`) and publishable key (`sb_publishable_...`). These values are
public browser configuration. Never insert a secret or service_role key.
No Supabase client library, build step or backend server is needed.

The browser posts `{ "p_country": "<exact country input>" }` to
`/rest/v1/rpc/increment_application` with the publishable key in the `apikey`
header. The existing public function must be accessible through the project's
Data API and executable by `anon`, with permission to perform its counter update.
The void response does not need JSON parsing. Failures (including unset
placeholders) are logged to the console and the joke dialog still opens.
There are no automatic retries. The submission button is temporarily disabled
while the request is pending (up to a 10-second timeout), plus a brief 600ms guard,
then enabled again. Submissions are also ignored while the joke dialog is open.

To test before pushing:

1. Insert your public credentials, then run `python3 -m http.server 8000` here.
2. Open `http://localhost:8000/apply.html` and DevTools Console and Network panels.
3. Try missing required fields and a non-PDF file: validation must block submission
   and no RPC request should appear.
4. Fill all fields with test details, choose two test PDFs, accept the terms,
   and submit with a distinctive country such as `Test Country`. The joke dialog
   should appear immediately and the form should clear.
5. Inspect the single POST to `increment_application`: its JSON body must contain
   only `p_country`, exactly matching your input. Confirm in Supabase's Table
   Editor that `public.application_counts` has increased by one for that country.
6. Rapidly double-click the submit button: there should be only one POST and one
   increment. Close the dialog, wait for the request/guard to finish, refill the
   form, and submit again to verify the button remains reusable.
7. Block the RPC URL in DevTools or go offline after loading the page. Submit a
   valid form: the dialog should still open, an error should be logged, and the
   button should re-enable after failure/timeout. Restore network access.
8. Repeat with `?lang=en` to check the English form and disclosure.

Offline diagnostics (no network requests or database changes):

```sh
node --check assets/js/main.js
node tests/application-counter.test.cjs
```

The tests run the submission handler with a mocked DOM and fetch. They check
validation, exact country text, URL/method/headers/body, duplicate submission
guards, form clearing, the prank dialog and redacted HTTP/network errors. They
do not replace a real browser or live database test.

During integration debugging, an authenticated read-only table request returned
HTTP 401 / PostgreSQL `42501` (`permission denied for table application_counts`).
This does not prove the RPC cannot update: a SECURITY DEFINER function runs with
its owner's permissions. No live increment or corresponding database result has
been verified. Use the following read-only diagnostics in Supabase's SQL Editor
if a submission still fails; they do not change grants, policies or schema:

```sql
-- Find the RPC, signature, owner, execution mode and configured search_path.
SELECT p.oid::regprocedure AS signature,
       pg_get_userbyid(p.proowner) AS owner,
       p.prosecdef AS security_definer, p.proconfig,
       p.proacl,
       has_schema_privilege('anon', 'public', 'USAGE') AS anon_schema_usage,
       has_function_privilege('anon', p.oid, 'EXECUTE') AS anon_execute,
       pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname = 'increment_application';

-- Table privileges and RLS flags for anon and any RPC owner.
WITH roles AS (
  SELECT oid, rolname, rolsuper, rolbypassrls FROM pg_roles
  WHERE rolname = 'anon'
     OR oid IN (
       SELECT p.proowner FROM pg_proc p
       JOIN pg_namespace n ON n.oid = p.pronamespace
       WHERE n.nspname = 'public' AND p.proname = 'increment_application'
     )
)
SELECT r.rolname, r.rolsuper, r.rolbypassrls,
       pg_get_userbyid(c.relowner) AS table_owner,
       c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS force_rls,
       has_table_privilege(r.oid, c.oid, 'SELECT') AS can_select,
       has_table_privilege(r.oid, c.oid, 'INSERT') AS can_insert,
       has_table_privilege(r.oid, c.oid, 'UPDATE') AS can_update
FROM roles r CROSS JOIN pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'application_counts';

SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'application_counts';
```

For SECURITY INVOKER (the default), `anon` needs the table privileges and RLS
policies required by the actual function body. For SECURITY DEFINER, inspect the
owner's privileges and RLS status. Diagnose the RPC's own response before making
permission changes; the read-only table check alone is insufficient.

To confirm a live increment, run this query before and after one valid browser
submission, replacing the string with the exact country you enter:

```sql
SELECT country, applications
FROM public.application_counts
WHERE country = 'Test Country';
```

An existing row should increase by exactly one; a new row should be created with
the count specified by the function (normally one). A successful HTTP response
alone does not verify the stored result. In Chrome, enable Network's Disable
cache and Preserve log options, reload, and filter for `increment_application`.
Inspect the POST request's Headers, Payload and Response tabs. Console failures
include HTTP status and the Supabase response, with configured credentials
redacted; the Network panel naturally contains the public API key, so redact it
before sharing screenshots or request exports.
