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
├── blog/
│   ├── index.html          # Blog listing page
│   ├── blog.css            # Blog-specific styles (extends ../style.css)
│   ├── jumeirah-vittaveli.html
│   ├── dhoores-retreat.html
│   ├── maadhoo-island.html
│   ├── oblu-helengeli.html
│   ├── kudafushi-island.html
│   └── fushifaru.html
└── images/
    ├── brands/             # Supplier brand logos (16 PNGs)
    ├── Slideshow-1.jpg     # Angelo Po kitchen (dark, chefs)
    ├── slide-2.jpg         # Angelo Po kitchen equipment
    ├── maldives-hero.jpg   # Hero background (aerial resort)
    ├── hotel-laundry.jpg   # Industrial laundry machines
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

### Do
- Keep it simple — this is a static site, not a web app
- Use CSS custom properties (defined in `:root` in `style.css`) for all colors, fonts, spacing
- Maintain responsive design across all breakpoints (480px, 768px, 1024px)
- Use semantic HTML elements (`<section>`, `<article>`, `<nav>`, `<footer>`)
- Keep images optimized — JPGs under 800KB, PNGs under 100KB
- Use `data-animate` attribute on elements that should fade in on scroll
- Follow the existing blog post template structure when adding new posts
- Test all links work on `file://` protocol (no directory-based paths)

### Adding a New Blog Post
1. Copy any existing post HTML file (e.g., `blog/fushifaru.html`) as a template
2. Update: title, meta description, breadcrumb, category, date, heading, subtitle, content
3. Update the `post-hero-bg` image path
4. Update previous/next navigation links at the bottom
5. Add a matching card entry in `blog/index.html`
6. Categories used: `Project Case Study` for resort projects, `Insight` for articles (e.g., procurement challenges)

### Contact Form
The contact form uses **Formspree** for submissions. To activate:
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Replace `YOUR_FORM_ID` in the form `action` attribute in `index.html`
If Formspree is not configured, the form falls back to `mailto:sales@gts.com.mv`.

### Hosting
This site is designed to be hosted on **GitHub Pages**. No build step is required — just serve the root directory.
