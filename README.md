#  FlowMaster Plumbing Nairobi — Website v2

> A warm artisan/retro-trade-poster plumbing website — completely different aesthetic from the first version. Deep terracotta, aged brass, chalk white, with Abril Fatface display type and Google Sheets booking capture built in.


## ✨ Design Philosophy

| Attribute | Choice |
|---|---|
| **Aesthetic** | Warm Artisan / Retro Trade Poster — handcrafted, trustworthy, heritage feel |
| **Display Font** | [Abril Fatface](https://fonts.google.com/specimen/Abril+Fatface) — bold serif italics, editorial gravitas |
| **Body Font** | [Outfit](https://fonts.google.com/specimen/Outfit) — geometric, clean, contemporary |
| **Palette** | Terracotta `#c1440e` · Aged Brass `#b8860b` · Deep Ink `#1c1208` · Chalk White `#faf7f0` |
| **Mood** | A trusted local tradesperson's business card — not a tech startup |
| **Unforgettable detail** | Masonry-style services grid with tall/wide span cards + floating stat cards on the hero image |

---

## 📁 Project Structure

```
flowmaster-plumbing-nairobi/
│
├── index.html    # Full page HTML — 7 sections, semantic markup
├── style.css     # All styles — terracotta palette, responsive masonry grid
├── script.js     # JavaScript — nav, form, Sheets, urgency button
└── Code.gs       # Google Apps Script — booking capture + emergency routing
```

> **Zero build tools. Zero npm. Zero dependencies.** Open `index.html` and it works.

---

## 🗂️ Page Sections

| Section | Description |
|---|---|
| **Announce Bar** | Top ink-black strip — emergency line, phone number, 24/7 note |
| **Hero** | Terracotta background with noise texture, decorative pipe lines, Abril Fatface headline, floating stat cards over photo |
| **Diagonal Band** | Skewed ink marquee strip with scrolling service names |
| **Services** | Masonry-style grid — tall, wide, dark card variants |
| **About** | Full-width dark ink section — photo + NCA badge + three pillars |
| **How It Works** | 4-step process with dashed connector lines |
| **Testimonials** | Asymmetric layout — large featured left card + 3 mini stack right |
| **Contact / Booking** | Split dark layout — clickable call/WhatsApp cards + form |
| **Footer** | 4-column dark footer with brand, two link columns, contacts |

---

## 🆚 How This Differs From the First Plumbing Site

| Feature | Version 1 (AquaShield style) | Version 2 (FlowMaster) |
|---|---|---|
| **Font** | Syne + DM Sans | Abril Fatface + Outfit |
| **Primary colour** | Electric Blue `#1d6ef5` | Terracotta `#c1440e` |
| **Accent** | Copper orange | Aged Brass |
| **Hero bg** | Dark photo overlay | Solid terracotta + noise texture |
| **Services layout** | Uniform card grid | Masonry with tall/wide spans |
| **Testimonials** | 3-column equal cards | Asymmetric feature + mini stack |
| **Announce bar** | None | Ink-black top strip |
| **Services ticker** | Straight marquee | Skewed diagonal band |
| **About section** | Light two-column | Full-width dark ink |
| **Stat presentation** | Inline metrics row | Floating cards overlapping image |

---

## 🚀 Quick Start

### 1. Get the files

```bash
git clone https://github.com/yourname/flowmaster-plumbing.git
cd flowmaster-plumbing
```

### 2. Open locally


open index.html
# or VS Code Live Server


### 3. Customise your details

| Find | Replace with | File(s) |
|---|---|---|
| `FlowMaster` | Your business name | `index.html`, `Code.gs` |
| `+254700000000` | Your real number | `index.html` |
| `hello@flowmaster.co.ke` | Your real email | `index.html` |
| `Ngong Road, Nairobi` | Your address | `index.html` |
| `Since 2009` / `2009` | Your founding year | `index.html` |
| `YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` | Your deployed Apps Script URL | `script.js` |

---

## 📊 Google Sheets Booking Integration

Every form submission routes to a Google Sheet row — with emergency jobs highlighted red automatically.

### Data Flow

```
Client fills form  →  script.js validates + POSTs  →  Code.gs appends row
                              ↓                              ↓
               Urgency detected client-side        Row coloured by urgency
               (button turns terracotta-red)       Emergency → red row + alert email
```

### Setup (~5 minutes)

**Step 1 — Create a Google Sheet**

[sheets.google.com](https://sheets.google.com) → New → name it `FlowMaster – Bookings`

**Step 2 — Open Apps Script**

Inside the sheet: **Extensions → Apps Script**

**Step 3 — Paste Code.gs**

Delete all existing code. Paste the full `Code.gs` file contents.

Set notification emails:

var NOTIFY_EMAIL    = 'bookings@flowmaster.co.ke';  // standard alerts
var EMERGENCY_EMAIL = 'dispatch@flowmaster.co.ke';  // emergency-only alerts


**Step 4 — Deploy**


Deploy → New Deployment
  Type           → Web App
  Execute as     → Me
  Who has access → Anyone

Copy the Web App URL.

**Step 5 — Connect**

In `script.js` line 14:

const SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';


**Step 6 — Test**

Submit a form. Select "EMERGENCY" — the button should turn terracotta-red. Check the sheet within seconds.



### Sheet Column Structure

| Column | Content | Notes |
|---|---|---|
| **Timestamp** | Date & time (Nairobi EAT) | Auto-filled |
| **Client Name** | Full name | From form |
| **Phone** | Phone number | From form |
| **Service** | Selected service | From form |
| **Urgency** | Urgency level | From dropdown |
| **Location** | Estate / area | From form |
| **Notes** | Problem description | From form |
| **Status** | `New` or `EMERGENCY` | Auto-set |
| **Plumber Assigned** | Technician name | Fill manually |
| **Quote Sent** | Y / N | Fill manually |
| **Job Date** | Scheduled date | Fill manually |
| **Invoice #** | Invoice reference | Fill manually |
| **Device** | Mobile / Desktop | Auto-detected |
| **Source URL** | Referral page | Auto-filled |

> 🚨 Emergency rows are highlighted in warm red, service/urgency/status columns bolded.
>
> ✅ Normal rows get a chalk-white tint.
>
> 💡 The sheet header is styled in terracotta to match the brand.



## 🎨 Design System

### Colour Palette


--terra:        #c1440e    /* Terracotta — hero bg, buttons, accents */
--terra-deep:   #9b3408    /* Deeper hover states */
--terra-lt:     #e05a22    /* Lighter accent, hero sub-text */
--ink:          #1c1208    /* Deep ink — dark sections, text */
--brass:        #b8860b    /* Aged brass — secondary accent */
--brass-lt:     #d4a420    /* Light brass — dark bg accent */
--chalk:        #faf7f0    /* Chalk white — page bg, light text */
--chalk-warm:   #f0ebe0    /* Warm chalk — service card bg */
--parchment:    #e8e0cc    /* Parchment — borders, dividers */


### Unique Layout Features

**Masonry services grid** — uses `grid-row: span 2` and `grid-column: span 2` to create a varied, editorial layout rather than a uniform card grid.

**Diagonal band** — the services ticker uses `transform: skewY(-1.5deg)` on the outer container to create a diagonal slash effect, then `skewY(1.5deg)` on the inner content to keep text straight.

**Floating stat cards** — absolutely positioned over the hero image with a floating animation using `@keyframes floatCard` — staggered delay between the two cards.

**Noise texture overlay** — both the hero and about sections use an inline SVG `feTurbulence` filter as a `background-image` to add a subtle printed/grain texture.

**Asymmetric testimonials** — left column is a large terracotta feature card, right column is three stacked mini cards — creates visual hierarchy without a carousel.

### Fonts

| Role | Font | Usage |
|---|---|---|
| Headlines, brand name | Abril Fatface | All `h1`, `h2`, logo, step numbers |
| Body, UI, labels | Outfit | All body text, buttons, labels, nav |



## ⚙️ JavaScript Features

| Feature | Description |
|---|---|
| Sticky header | Transparent → chalky solid after 60px scroll |
| Mobile nav | Slide-in warm drawer, overlay, Escape key |
| Smooth scroll | Header-offset anchor navigation |
| Booking form | 5-field validation, urgency-aware messaging |
| Google Sheets | POST with emergency detection and dual email routing |
| **Urgency button** | Submit button turns terracotta-red + changes label on EMERGENCY |
| Scroll reveal | Staggered `IntersectionObserver` fade-in |
| Footer year | Auto-updated copyright year |

---

## 🌍 Deployment

### Free Static Hosting

| Platform | Free | Notes |
|---|---|---|
| [Netlify](https://netlify.com) | ✅ | Drag & drop 3 files |
| [Vercel](https://vercel.com) | ✅ | Connect GitHub repo |
| [GitHub Pages](https://pages.github.com) | ✅ | Push to `gh-pages` |
| [Cloudflare Pages](https://pages.cloudflare.com) | ✅ | Global CDN |

> ⚠️ `Code.gs` lives in Google Apps Script, not your hosting folder.

---

## 🔧 Customisation

### Swap Hero Image

In `style.css`, update `.hero-img`:

.hero-img {
  background: url('YOUR_PLUMBER_PHOTO_URL') center/cover no-repeat;
}


Use a photo of a plumber at work — the `brightness(0.92)` filter softens it against the terracotta.

### Swap About Photo


.about-photo {
  background: url('YOUR_TEAM_PHOTO_URL') center/cover no-repeat;
}


### Add a Service Card


<div class="svc-block">
  <div class="svc-number">07</div>
  <div class="svc-icon-circle"><i class="fas fa-YOUR-ICON"></i></div>
  <h3>Service Title</h3>
  <p>Description of what this covers.</p>
  <div class="svc-tags"><span>Tag 1</span><span>Tag 2</span></div>
  <a href="#contact" class="svc-link">Book Now <i class="fas fa-arrow-right"></i></a>
</div>


Add `class="svc-block svc-dark"` for ink background. Add `class="svc-block svc-tall"` to span two rows or `svc-wide` to span two columns.


## ✅ Pre-Launch Checklist

- [ ] Replace all `+254700000000` with real number
- [ ] Replace `hello@flowmaster.co.ke` with real email
- [ ] Update founding year ("Since 2009")
- [ ] Update address from "Ngong Road, Nairobi"
- [ ] Deploy `Code.gs` and paste URL into `script.js`
- [ ] Set `NOTIFY_EMAIL` and `EMERGENCY_EMAIL` in `Code.gs`
- [ ] Test standard booking → verify chalk-tinted row in sheet
- [ ] Test emergency booking → verify red row + email alert
- [ ] Replace hero image (`.hero-img`) with real plumber photo
- [ ] Replace about photo (`.about-photo`) with real team photo
- [ ] Update social media links in footer
- [ ] Add favicon to `<head>`
- [ ] Test on mobile — hero, form, masonry grid
- [ ] Verify Google Map shows correct area

---

## 📄 License

Free for personal and commercial use. Adapt freely for any plumbing business.

---

<div align="center">

*Abril Fatface · Terracotta · Chalk · Brass*

**FlowMaster — We Fix Every Leak.**

</div>
