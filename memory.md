# Mansha International — Project Memory
**Last Updated**: 2026-09-07 (latest: testimonial card layout)
This is the single source of truth for the entire project. Read this before making any changes.

---

## RULE #1 — UPDATE THIS FILE AFTER EVERY CHANGE
After every task, add/update the relevant section in this file. No exceptions.

---

## 1. Project Info

| Field | Value |
|-------|-------|
| Business | Mansha International (formerly Mansha Knit) |
| Location | Ludhiana, Punjab, India |
| Founded | 2018 |
| Founders | Mr. Manish Singh and Mr. Deepak Kumar |
| Background | Mayer and Cie / Batliboi India — 20+ years German technical expertise |
| Products | Circular Knitting, Flat Knitting, Cap and Gloves Knitting Machines, Second-Hand Machines, Needles, Sinkers, Spare Parts |
| Phone | +91 8800335090 |
| Email | info@manshainternational.in |

---

## 2. File Structure

### Root Files
| File | Type | Purpose |
|------|------|---------|
| index.html | HTML | Main homepage |
| about-us.html | HTML | About page |
| products.html | HTML | Products listing |
| services.html | HTML | Services page |
| applications.html | HTML | Area of application page |
| contact.html | HTML | Contact page |
| faq.html | HTML | FAQ page |
| blog.html | HTML | Blog listing |
| category-circular-knitting.html | HTML | Category page |
| category-flat-knitting.html | HTML | Category page |
| category-cap-gloves.html | HTML | Category page |
| category-needles.html | HTML | Category page |
| category-spare-parts.html | HTML | Category page |
| category-second-hand.html | HTML | Category page |
| service-circular-knitting.html | HTML | Service detail |
| service-cap-gloves.html | HTML | Service detail |
| service-needles-spares.html | HTML | Service detail |
| styles.css | CSS | Global stylesheet — ALL pages use this |
| main.js | JS | Global scripts — ALL pages use this |
| logo.png | Image | Company logo |
| IMG_2014.JPG | Image | Why We Started section (about-us.html) |
| IMG_5425.jpg | Image | Founders section (about-us.html) |
| knitting-partner.jpg | Image | Knitting Partner section (about-us.html) |
| our-promise.jpg | Image | Our Promise section (about-us.html) |

### images/ Folder
| File | Purpose | Source |
|------|---------|--------|
| images/as-kumar.png | Mr. A S Kumar testimonial avatar | User provided: C:\Users\akash\Downloads\Forth.png |
| images/sarthak-sachdeva.png | Mr. Sarthak Sachdeva avatar | Cropped from user screenshot |

---

## 3. main.js — All Functions

| Function / Section | Lines | What It Does |
|--------------------|-------|--------------|
| Mobile Drawer | 7-30 | Open/close hamburger menu drawer |
| Mobile Submenu Accordions | 32-47 | Mobile nav submenu toggle |
| Modal Enquiry Popup | 50-80 | Open/close enquiry modal on .trigger-enquiry click |
| Accordion (FAQs) | 82-117 | FAQ expand/collapse, first item auto-open |
| Form Submit + Toast | 119-157 | Ajax-style form, shows toast notification |
| Animated Counter | 160-195 | Counts up numbers when .counter-section scrolls into view |
| Scroll to Top Button | 197-211 | Shows/hides #scrollTop button after 400px scroll |
| Sticky Header Scroll State | 213-227 | Adds .scrolled class to .header after 40px scroll |
| Scroll Reveal (IntersectionObserver) | 229-257 | Adds reltex-revealed class when elements enter viewport |
| Hero Arrow Click Effect | 259-287 | Fade+slide animation on hero arrow buttons |
| Parallax — handleAllParallax() | 289-348 | Unified parallax for CTA Banner + Area of Application |
| Testimonials Slider | 350-457 | Full carousel with autoplay, dots, arrows, swipe |

---

## 4. Parallax Implementation

### How It Works
- getBoundingClientRect() to get section position
- Calc diff between section center and viewport center
- Apply translate3d to background div
- requestAnimationFrame + ticking flag for performance

### CTA Banner (.cta-banner)
- Inner bg div class: .cta-banner-parallax-bg
- Parallax speed ratio: 0.18
- Background: Dark industrial machinery photo
- OLD: Was blue gradient — REMOVED and replaced with image

### Area of Application (.reltex-app-section)
- Background div: .reltex-app-bg — speed ratio 0.22
- Glow overlay div: .reltex-app-layer-glow — speed ratio 0.09
- Cards (.reltex-app-item) have staggered transition-delay in CSS

---

## 5. Testimonials Slider

### HTML Structure (index.html ~ line 898)
`
section.section-padding.bg-white
  div.container
    div.section-header
    div.testi-slider-wrap
      button#testiPrev.testi-arrow.testi-prev
      div#testiViewport.testi-viewport
        div#testiTrack.testi-track
          div.testimonial-card.testi-slide  x5
      button#testiNext.testi-arrow.testi-next
    div#testiDots.testi-dots
`

### Testimonial Card Structure
`html
<div class=testimonial-card testi-slide>
  <div>
    <div class=quote-icon><i class=ri-double-quotes-l></i></div>
    <div class=stars>...</div>
    <p class=testimonial-text>...</p>
  </div>
  <div class=client-info>
    <img src=... class=client-avatar alt=...>
    <div class=client-details>
      <h4>Name</h4>
      <p>Role, Location</p>
    </div>
  </div>
</div>
`

### JS Logic (main.js lines 350-457)
- visibleCount(): desktop=3, tablet<=1024=2, mobile<=640=1
- maxIndex(): slides.length - visibleCount()
- getOffset(idx): idx x (slideWidth + gap)
- goTo(idx): translateX track, sync dots, disable arrows at boundaries
- startAuto(): setInterval 3500ms, wraps to 0 after max
- stopAuto(): clearInterval
- Pause: mouseenter/focusin on viewport stops auto
- Resume: mouseleave/focusout resumes auto
- Touch: touchstart/touchend, swipe if diff > 40px
- Resize: 120ms debounce, rebuildDots + goTo(clamped index)
- Init: buildDots() → goTo(0) → startAuto()

### CSS Classes (styles.css)
| Class | Purpose |
|-------|---------|
| .testi-slider-wrap | display:flex, align-items:center, gap:1rem |
| .testi-viewport | overflow:hidden, clips track |
| .testi-track | display:flex, gap:1.5rem, transition:transform 0.55s cubic-bezier |
| .testi-slide | flex:0 0 calc((100%-3rem)/3) on desktop |
| .testi-arrow | 48px circle button, cyan on hover |
| .testi-dot | 8px pill, .active = cyan + 24px wide |
| .testimonial-card | white bg, border, shadow, flex-col, justify-between |

### Responsive
| Breakpoint | Visible Cards | .testi-slide width |
|-----------|--------------|-------------------|
| > 1024px | 3 | calc((100% - 3rem) / 3) |
| <= 1024px | 2 | calc((100% - 1.5rem) / 2) |
| <= 640px | 1 | 100% |

---

## 6. All 5 Testimonials Data

| # | Name | Role | City | State | Rating | Image |
|---|------|------|------|-------|--------|-------|
| 1 | Shri Gopal Mishra | Owner | Ludhiana | Punjab | 5/5 | WordPress: .../First.png (working) |
| 2 | Mr. Sachin Gupta | Owner | Murad Nagar | Ghaziabad | 5/5 | WordPress: .../Second.png (working) |
| 3 | Mr. Jatinder Makkar | Owner | Ludhiana | Punjab | 5/5 | WordPress: .../Third.png (working) |
| 4 | Mr. A S Kumar | Owner | Tirupur | Tamil Nadu | 4.5/5 | LOCAL: images/as-kumar.png |
| 5 | Mr. Sarthak Sachdeva | Owner | Meerut | UP | 4.5/5 | WordPress: .../Fifth.png (working) |

IMPORTANT: WordPress Fourth.png returns 404. Use images/as-kumar.png (local file).
WordPress URL base: https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/

---

## 7. About Us Page (about-us.html) Sections

| # | Section Title | Layout | Image File |
|---|--------------|--------|-----------|
| Hero | About Mansha International | Split diagonal, left content + right machine stage | — |
| 1 | About Mansha International | Left content + right image | Factory floor |
| 2 | WHY WE STARTED | Left image + right content | IMG_2014.JPG |
| 3 | FOUNDERS | Left content + right image | IMG_5425.jpg |
| 4 | YOUR COMPLETE KNITTING PARTNER | Left image + right content | knitting-partner.jpg |
| 4B | Our End-to-End Services (9 cards) | 3-col grid, hover dark effect | Custom SVG icons |
| 5 | OUR PROMISE TO YOU | Left content + right image | our-promise.jpg |
| 6 | COMMITTED TO YOU | Full-width 4 feature cards | Grid icons |

Service Cards Hover Style (matching bvc.mp4):
- bg: #222731, title: white, desc: #cbd5e1
- card: translateY(-4px) + elevated shadow
- icon box: rgba(255,255,255,0.15), border rgba(255,255,255,0.35)

---

## 8. Scroll Reveal System

Selector list observed by IntersectionObserver (main.js line 232):
- .section-header
- .cards-grid .card
- .company-pillars-grid .company-pillar-card
- .reltex-app-item
- .features-grid .feature-card
- .app-card
- .cta-banner
- .testimonials-grid .testimonial-card
- .accordion-wrapper .accordion-item
- .blog-grid .blog-card

Flow: element gets .reltex-reveal class → on 10% intersect gets .reltex-revealed class → CSS animates opacity + transform

---

## 9. Design System (CSS Variables in styles.css)

| Variable | Value | Usage |
|----------|-------|-------|
| --logo-cyan | #22b0fe | Primary accent, buttons, links |
| --logo-orange | #f97316 | Star ratings, secondary accents |
| --primary-navy | #0f172a | Dark text, headings |
| --text-main | #1e293b | Body text |
| --text-muted | #64748b | Captions, sub-text |
| --border-color | #e2e8f0 | Card borders, dividers |
| --bg-white | #ffffff | Card backgrounds |
| --radius-md | 12px | Cards, modals |
| --radius-sm | 8px | Inputs, small elements |
| --shadow-sm | 0 2px 8px rgba(0,0,0,0.06) | Card shadows |
| --transition | all 0.3s ease | Default transitions |

---

## 10. Important Rules (NEVER BREAK THESE)

1. JITNA BOLA JAYE SIRF UTNA HI CHANGE KARNA — no extra unsolicited changes
2. MEMORY.MD UPDATE KARNA ZAROORI HAI har change ke baad — immediately
3. Before any task, READ memory.md first
4. WordPress image problem: Fourth.png is 404 — use images/as-kumar.png
5. Parallax: always requestAnimationFrame + ticking pattern — never direct scroll handler
6. Slider init order: buildDots() → goTo(0) → startAuto()
7. All CSS changes go in styles.css, all JS in main.js — no inline scripts


---

## 11. Testimonial Card Layout Change (2026-09-07)

Card structure changed — client info (image+name) moved to TOP, quote text moved to BOTTOM.

New order inside .testimonial-card:
1. .client-info (avatar + name + role) — at TOP, border-bottom
2. .testi-body (stars + text + quote icon) — fills remaining space

CSS Changes (styles.css):
- .client-info: border-top removed, border-bottom added, padding-bottom, margin-bottom:1rem
- .testi-body: flex:1, flex-direction:column
- .testi-body .quote-icon: margin-top:auto (pushes to bottom), text-align:right, decorative only

HTML Change (index.html):
- All 5 cards restructured: client-info first, then testi-body div
- Quote icon changed from ri-double-quotes-l to ri-double-quotes-r (decorative, bottom-right)

## 12. Testimonial Card — Stars Position Change (2026-09-07)

Stars (rating) moved BELOW the review text.

Final order inside .testi-body:
1. p.testimonial-text  — review quote text
2. div.stars           — star rating (niche)
3. div.quote-icon      — decorative quote (bottom-right)

## 13. FAQ Section Redesign (2026-09-07)

Changed from: full-width centered accordion layout
Changed to: 2-column split layout matching reference image

### New HTML Structure (index.html)
section.faq-split-section
  div.faq-split-left  (Left: heading + accordion)
    sub-title-badge
    h2.faq-split-title
    p.faq-split-desc
    div.accordion-wrapper (4 existing FAQ items - content unchanged)
  div.faq-split-right  (Right: machinery bg image + dark form card)
    div.faq-bg-overlay (dark gradient overlay)
    div.faq-quote-card
      form.faq-quote-form.ajax-form (Full Name, Email, Phone, Enquiry, Send Message btn)

### CSS Classes Added (styles.css)
- .faq-split-section: display:grid, 1fr 1fr, min-height:600px
- .faq-split-left: padding 5rem 4rem, white bg, flex-col centered
- .faq-split-right: background-image machinery photo, dark overlay
- .faq-bg-overlay: absolute, dark gradient, z-index:1
- .faq-quote-card: glassmorphism dark card, backdrop-filter:blur(16px)
- .faq-input: semi-transparent dark input fields, cyan focus border
- .faq-submit-btn: orange button with hover effect
- Responsive: stacks to 1 column at 900px

### accordion-wrapper change
Removed max-width:840px and margin:0 auto (now fills left column naturally)
Added margin-top:2rem, gap changed to 0.85rem

### Background Image (right column)
URL: https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Circular-Knitting-Machine-scaled.jpg

## 14. FAQ Right Column Background Image Fix (2026-09-07)

Problem: Circular-Knitting-Machine-scaled.jpg was 404 on WordPress
Fix: Changed to Cap-and-gloves-knitting-machines.jpeg (confirmed 200 OK)
URL: https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Cap-and-gloves-knitting-machines.jpeg
Overlay: rgba(5,12,35,0.72) to rgba(8,20,55,0.58) - slightly lighter so image shows through

## 15. FAQ Right Column — Form Replaced with Contact Us Button (2026-09-07)

Removed: Full form (Full Name, Email, Phone, Enquiry, Submit button)
Added: Single Contact Us button (a.faq-contact-btn) linking to contact.html

Current .faq-quote-card content:
  h3.faq-quote-title  = Request a Free Quote
  p.faq-quote-sub     = Tell us your textile machinery requirements...
  a.faq-contact-btn   = Contact Us -> href contact.html

CSS: .faq-contact-btn (orange, full-width, hover effect, text-decoration:none)
Old .faq-submit-btn replaced with .faq-contact-btn in styles.css

## 16. CTA Banner — Form Replaced with Contact Us Button (2026-09-07)

Section: Quick Quote Form Banner (index.html line ~862)
Change: Removed full form, added single pill-shaped Contact Us button

New HTML structure:
  div.cta-grid.cta-grid-btn
    div.cta-content  (heading + description - unchanged)
    div.cta-btn-wrap
      a.cta-contact-btn  href=contact.html  (Contact Us arrow button)

CSS Added (styles.css):
- .cta-grid-btn: grid-template-columns 1fr auto (text fills left, button right)
- .cta-btn-wrap: flex, align right
- .cta-contact-btn: white pill button (border-radius:50px), hover = cyan bg
- Arrow icon slides right on hover

FAQ section form: NOT CHANGED - still has original form (Full Name, Email, Phone, Enquiry)

## 17. FAQ Section — Form Restored & Background Image Lightened (2026-09-07)

Section: Frequently Asked Questions (index.html line ~1052)
Changes:
1. Restored original "Request a Free Quote" form:
   - Inputs: Full Name (text, required), Email Address (email, required), Phone Number (tel), Your Enquiry (textarea, required)
   - Button: `button.faq-submit-btn` ("Send Message" with arrow icon)
   - Replaced standalone "Contact Us" link button
2. Lightened background image overlay:
   - `.faq-bg-overlay`: Opacity reduced from `rgba(5, 12, 35, 0.72) ... rgba(8, 20, 55, 0.58)` to `rgba(5, 12, 35, 0.38) ... rgba(8, 20, 55, 0.25)`
   - Textile machinery photo is now clearly visible and bright in the background
3. CSS: Re-added `.faq-submit-btn` styling in styles.css

## 18. Blog Posts — Machinery & Equipment Images Replacement & Filter System (2026-09-07)

### Changes in `blog.html`:
1. Replaced all blog post images with authentic, relevant textile machinery and equipment photos:
   - Post 1 (Maintenance): `Circular-Knitting-machine.jpeg` + `Machine Maintenance` badge (was duplicate cap & gloves image)
   - Post 2 (Cap & Gloves): `Cap-and-gloves-knitting-machines.jpeg` + `Cap & Gloves` badge
   - Post 3 (Installation): `Installation-and-consultation.jpeg` + `Technical Consultation` badge
   - Post 4 (Needles & Spares): `Needles-and-spare-parts.jpeg` + `Needles & Spares` badge
   - Post 5 (Flat Knitting): `Flat-Knitting-machine-1.jpeg` + `Flat Knitting` badge
   - Post 6 (Circular Factory Tech): `circular_knitting_machine_factory.webp` + `Circular Knitting` badge
2. Added interactive Category Filter Pills above the blog grid:
   - Filter buttons: `[All Topics] [Circular Knitting] [Cap & Gloves] [Flat Knitting] [Needles & Spare Parts] [Installation & Maintenance]`
   - Filter pills dynamically filter `.blog-card` using `data-category` attributes with smooth opacity/translate transitions.
3. Added Category Badges (`.blog-category-badge`) over images using glassmorphism dark pill aesthetic with cyan icons.

### Changes in `styles.css`:
- Added `.blog-filters` (centered flex-wrap pills), `.filter-btn` and `.filter-btn.active` (cyan pill with glow)
- Added `.blog-category-badge` (semi-transparent dark backdrop blur badge)
- Added smooth card transition & `.blog-card.is-hidden`

### Changes in `main.js`:
- Added click event listener for `.blog-filters .filter-btn` to smoothly filter `.blog-card` elements by `data-category`

### Changes in `index.html`:
- Updated blog section cards on home page with matching machinery photos and category badges (Post 1 now has Circular Knitting machine maintenance photo instead of duplicate cap & gloves).

## 19. All Pages Header Banner Overlay Lightened (2026-09-07)

Issue: Inner page header banners (`.page-banner`) had an overly dark overlay (`~0.82-0.89` dark navy opacity), making the underlying machinery photos appear almost completely black/muddy.
Fix:
- Lightened overlay opacity across all `.page-banner` classes in `styles.css` from `rgba(16, 13, 36, 0.82) ... rgba(16, 13, 36, 0.88)` down to `rgba(10, 16, 38, 0.38) ... rgba(10, 16, 38, 0.48)`.
- Applied across all 16 inner pages:
  * `about-us.html` (`.banner-about`)
  * `services.html` (`.banner-services`)
  * `products.html` (`.banner-products`)
  * `applications.html` (`.banner-applications`)
  * `faq.html` (`.banner-faq`)
  * `blog.html` (`.banner-blog`)
  * `contact.html` (`.banner-contact`)
  * All product/service category pages (`.banner-cap-gloves`, `.banner-circular`, `.banner-needles`, `.banner-flat`, `.banner-second-hand`)
- Enhanced text shadow on `.page-banner h1` and `.breadcrumb` to maintain crisp readability over the now bright and visible machinery backgrounds.
