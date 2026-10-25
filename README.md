# One Vision Property Group

A fast, responsive property management website for **ONEVISION PROPERTY GROUP PTY LTD**, **ABN 37 700 329 102**. The white/amber palette, photographic homepage, split inner-page layouts and generous spacing follow the supplied Smart Rentals design reference. All website copy and branding are adapted for One Vision. Reference-company staff, contact details, awards and reviews are deliberately excluded.

## Run

Requires Node.js 18 or later. No package installation or dependencies are needed.

```sh
npm run build
npm test
npx serve dist
```

## Pages

Home, Why One Vision, Owners, Tenants, About Us, Make the Switch, Contact, Maintenance Report, FAQs, and Privacy Information. Directory-based routes work with ordinary static hosting. Includes a custom 404 page.

## Business details and enquiry delivery

Edit `site.config.mjs`, then rebuild. The supplied attachment contained the legal name and ABN only. Telephone, email, office address, staff, service areas and licence information have not been invented.

**Enquiry delivery is not connected.** Forms validate inputs and download a plain-text enquiry for the visitor; they clearly state that nothing has been sent. Entries are not stored. Maintenance preparation always downloads locally and never claims to lodge a request.

To enable general enquiries, set either:

- `email`: opens the visitor's email app with their enquiry for review and sending; or
- `enquiryEndpoint`: an HTTPS form service accepting JSON. Success is shown only after a successful HTTP response. Configure server validation, abuse protection, retention and CORS on that service.

Provide verified business contact details, service scope and any required licensing disclosures before public business launch. Review privacy information if connecting services. Set `canonicalOrigin` to the actual deployed origin to emit canonical URLs.

## Deploy

The repository contains source; generated `dist/` is ignored. For Vercel or Netlify, use build command `npm run build` and output/publish directory `dist`. No environment variables are required. Root-relative asset paths expect hosting at a domain root rather than a GitHub Pages project subdirectory.

`netlify.toml` and `vercel.json` include build configuration and security headers. GitHub Actions runs build and internal-link checks on pushes and pull requests. No public deployment is performed by the workflow.

## Structure

- `scripts/build.mjs` — shared templates and page content; generates all HTML.
- `site.config.mjs` — business identity and optional delivery configuration.
- `assets/` — local images, SVG branding, CSS, browser interactions.
- `scripts/check.mjs` — page, link, asset, fragment and business-identity checks.

Uses native HTML details/summary for FAQs, a keyboard-accessible mobile menu, reduced-motion support, labelled forms, image switcher and no third-party browser scripts.

## Photography

Locally hosted property photographs sourced from Unsplash. These are illustrative interiors/homes, not representations of One Vision listings, staff or offices.

- Image identifier: photo-1600596542815-ffad4c1539a9.
- Image identifiers: photo-1600210492486-724fe5c67fb0, photo-1600607687920-4e2a09cf159d, photo-1600566753190-17f0baa2a6c3.
- Source image delivery: `https://images.unsplash.com/<image-identifier>`; Unsplash licence: https://unsplash.com/license
