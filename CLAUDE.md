# CLAUDE.md — GTS Maldives Website

## Project Overview
This is the official website for **GTS Private Limited** (GTS Maldives) — a hospitality equipment supplier serving resorts and hotels in the Maldives since 2004. The site is a static HTML/CSS/JS website with no build tools or frameworks.

## Tech Stack
- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties (variables), Grid, Flexbox, responsive breakpoints
- **Vanilla JavaScript** — No frameworks or libraries
- **Google Fonts** — Jost (body, Futura alternative) + EB Garamond (headings)

## File Structure
```
/
├── index.html              # Main single-page site (all sections)
├── style.css               # Global styles + CSS variables
├── script.js               # Interactivity (nav, animations, form)
├── .cpanel.yml             # cPanel deployment config (copies to public_html)
├── blog/
│   ├── index.html          # Blog listing page
│   ├── blog.css            # Blog-specific styles (extends ../style.css)
│   ├── jumeirah-vittaveli.html
│   ├── dhoores-retreat.html
│   ├── maadhoo-island.html # OZEN Maadhoo project
│   ├── oblu-helengeli.html
│   ├── kudafushi-island.html
│   └── fushifaru.html
└── images/
    ├── brands/             # Supplier brand logos (16 PNGs)
    ├── resort logos/        # Resort/client logos (20 files, mixed formats)
    ├── slide-2.jpg         # Angelo Po kitchen equipment
    ├── maldives-hero.jpg   # Hero background (aerial resort)
    ├── hotel-laundry.jpg   # Industrial laundry machines (hero slide 1)
    ├── Jumeirah.avif       # Jumeirah resort (hero slide)
    ├── Oblu.jpg            # OBLU resort (hero slide)
    └── maldives-*.jpg      # Resort photos (Unsplash, free license)
```

## Rules

### Do NOT
- Add build tools, bundlers, or package managers (no npm, webpack, vite, etc.)
- Add JavaScript frameworks or libraries (no React, jQuery, etc.)
- Add CSS frameworks (no Bootstrap, Tailwind, etc.)
- Modify the color scheme without explicit approval — the red accent (#b5313a) is the brand color
- Change fonts without explicit approval — Jost + EB Garamond are the chosen fonts
- Remove or rename existing blog posts or their URLs (they may be linked externally)
- Delete images from `/images/` without checking they're not referenced
- Add tracking scripts, analytics, or third-party cookies without explicit approval
- Commit `.env` files, API keys, or credentials
- Use directory-based links (e.g., `blog/` or `../`) — always use explicit file paths (`blog/index.html`, `../index.html`) for `file://` protocol compatibility
- Add unnecessary comments, docstrings, or code annotations
- Use `translate3d()` in JS parallax — it creates GPU layers that break `backdrop-filter` compositing. Use `translate()` or CSS custom properties instead.
- Set `perspective` on the hero section — interferes with `backdrop-filter` on child elements
- Set `will-change: transform` on hero background elements — prevents backdrop-filter from seeing background images

### Do
- Keep it simple — this is a static site, not a web app
- Use CSS custom properties (defined in `:root` in `style.css`) for all colors, fonts, spacing
- Maintain responsive design across all breakpoints (360px, 480px, 768px, 1024px, 1400px, 1800px)
- Use semantic HTML elements (`<section>`, `<article>`, `<nav>`, `<footer>`)
- Keep images optimized — JPGs under 800KB, PNGs under 100KB
- Use `data-animate` attribute on elements that should fade in on scroll
- Follow the existing blog post template structure when adding new posts
- Test all links work on `file://` protocol (no directory-based paths)
- Use `all: unset` when overriding desktop nav-menu styles for mobile overlay — prevents inherited properties from leaking through
- Use `box-sizing: border-box` immediately after `all: unset` on the mobile nav overlay

### Navigation Architecture
- **Desktop**: Single fixed pill navbar, no idle/scroll state change. Nav items right-aligned (`justify-content: flex-end`). Padding `16px 16px 16px 28px`, width `min(90vw, 960px)`.
- **Mobile (≤768px)**: Compact centered pill with logo + hamburger. Overlay drops from top as a full-width card (`left: 10px; right: 10px`) with fade+scale animation. Overlay uses `all: unset` to reset desktop styles.
- The JS `scrolled` class toggle is inert — no CSS rules target `.navbar.scrolled`.

### Hero Section
- 5-slide carousel with Ken Burns animation (CSS `transform: scale()` keyframes)
- Mouse parallax uses CSS custom properties (`--px`, `--py`) set via JS, applied on `.hero-bg-stack` via `translate()`
- Scroll parallax uses `--scroll-offset` CSS variable
- Hero overlay gradient is intentionally lighter in the mid-section so `backdrop-filter` blur on buttons is visible

### Adding a New Blog Post
1. Copy any existing post HTML file (e.g., `blog/fushifaru.html`) as a template
2. Update: title, meta description, breadcrumb, category, date, heading, subtitle, content
3. Update the `post-hero-bg` image path
4. Update previous/next navigation links at the bottom
5. Add a matching card entry in `blog/index.html`
6. Categories used: `Project Case Study` for resort projects, `Insight` for articles (e.g., procurement challenges)

### Contact Form
The contact form uses **Formspree** (endpoint: `https://formspree.io/f/mwvapbeq`).
Submissions are sent to **sales@gts.com.mv**.
Fields: Full Name, Email, Phone Number, Property/Company, Subject (dropdown), Message.

### Hosting & Deployment
- **Repository**: github.com/muaaadh/gts-website (public)
- **Hosting**: cPanel shared hosting at gts.com.mv
- **Deploy workflow**:
  1. `git push origin main` from local
  2. cPanel → Git Version Control → Update from Remote (pulls into `~/gts-website/`)
  3. cPanel → File Manager → copy files from `gts-website/` to `public_html/`
- The `.cpanel.yml` file exists for automated deployment but requires cPanel Terminal access (currently unavailable on this host)
