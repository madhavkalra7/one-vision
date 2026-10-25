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

24 pages: Home, Why One Vision, Owners, Tenants, About Us, Make the Switch, Contact, Maintenance Report, FAQs, Privacy Information, People-first Approach, Commitments, Community, Property & Area, Compare Your Options, Company Details, Owner & Tenant Access, Owner FAQs, Tenant FAQs, Property Journal, three original property guides, and Properties for Rent. Directory-based routes work with ordinary static hosting. Includes a custom 404 page.

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

## Motion

Reference-matched 3-second introduction (once per browser tab session, skippable), 900ms/26px scroll reveals with 90ms card staggering, 1.8-second hero crossfades, slow image zoom, inner-page entrances, animated FAQ opening/closing, mobile menu entrance and link/icon hover motion. The slideshow advances every 6.5 seconds and pauses on hover, keyboard focus, hidden tabs and when offscreen. A pause/play control and manual image controls are included. Reduced-motion preferences disable the intro, autoplay and nonessential animation, including when changed while the page is open. Content remains visible if JavaScript is unavailable.

## Full section coverage and new journeys

The homepage now includes layered property imagery, the six-item expectations section, a horizontal people/journey rail, client-priority panels, service commitments, two photographic property/area cards, suburb enquiry, FAQs, and the journal. About includes people and community; Owners includes tenant care, communication and investment planning; Tenants includes rental search, inspection/application preparation, tenancy guidance and tenant FAQs. Nested navigation and an expanded footer connect all routes. New sections use the shared scroll reveal/stagger system.

Where verified staff and testimonials have not been supplied, the same layouts show useful property-journey cards and questions to ask. No fictional profiles, reviews, review scores, property listings, guarantees, sponsorships or offices are displayed.

### Optional verified content

`site.config.mjs` accepts:

- `people`: objects with `name`, `role`, optional `bio`, optional `image` (local absolute URL path or HTTPS).
- `testimonials`: approved objects with `quote`, `name`, optional `context`.
- `serviceAreas`: confirmed suburb/area name strings; adds direct area-enquiry links.
- `ownerPortalUrl` and `tenantPortalUrl`: verified HTTPS portal URLs; when absent, access guidance and an enquiry route appear.
- `properties`: real listing objects with unique URL-safe `id`, `title`, numeric `weeklyRent`, optional `suburb`, `address`, `beds`, `baths`, `cars`, `type` (`house`, `apartment`, `townhouse`, `unit`), `available`, `description`, `image` (asset basename without extension), `inspectionUrl`, and `applicationUrl`. Each object generates a property detail page; images must exist in `assets/` as WebP. Only verified HTTPS or site-relative booking/application destinations are rendered.

Rental filters support keywords/suburbs, property type, maximum weekly rent and minimum bedrooms. Sorting supports published order and rent ascending/descending. Filter state is encoded in the URL. With no matching or published properties, a rental enquiry carries those preferences to the contact form. No interest registration or inspection is claimed to have been sent/booked by this static website.

Property images are illustrative unless explicitly provided as actual listing/profile images. Additional Unsplash image identifiers: photo-1518005020951-eccb494ad742, photo-1518837695005-2083093ee35b, photo-1497366754035-f200968a6e72, photo-1521737711867-e3b97375f902.
