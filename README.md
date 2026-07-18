# BRAiNLUBE — Shopify Theme & Site Documentation

Internal reference doc for the brainlube.com Shopify store. Covers brand identity, theme architecture, current content inventory, and the gaps to close before this repo is connected to Shopify (Admin → Themes → Add theme → Connect from GitHub).

---

## 1. Brand Snapshot

| | |
|---|---|
| **Name** | BRAiNLUBE™ |
| **Tagline** | "Sip Smarter" / "Live Brighter" |
| **Category** | Nootropic / cognitive-support energy drink |
| **Current SKU** | "Nootropics Energy Drink, OG Mango" — 12oz can, $30.00 USD, real mango juice |
| **Founder** | Steve Land (IT professional). The "S. Bradley Land" reference in `templates/index.json` (homepage founder-story block) is outdated/incorrect and should be corrected to Steve Land when content is next edited. |
| **Origin story** | Land noticed sharper focus drinking an early commercial energy drink with natural adaptogens during long IT/computer-room shifts, then formulated his own after that product disappeared. ~2 years of development. |
| **Blog** | "BRAiNWAVES" — science-adjacent brain-health content, 4 live posts |
| **Required disclaimer** | "Not intended for children under 18 years of age, not recommended for people sensitive to caffeine, pregnant women or women who are nursing." (already in footer) |

### Voice & tone
Conversational but credibility-leaning — references research/ingredient science without heavy jargon. Light wordplay throughout ("Sip Smarter," "BRAiNWAVES," "brain boost"). Copy leans short, punchy, benefit-first; body copy expands with plain-English ingredient explanations.

### The six core ingredients (used repeatedly across the site — hero hotspots, product FAQ, banner grid)
1. **Ashwagandha** — adaptogen root; mental energy, stress resistance, mood, healthy brain aging
2. **Bacopa Monnieri** — nootropic herb; memory/retention, stress resistance (positioned for students)
3. **Caffeine** — modest dose, framed as "just enough to stay sharp"
4. **Ginkgo Biloba** — brain circulation, memory, age-related cognitive performance
5. **Ginseng** — adaptogen; supports brain chemicals, counters stress, energizes
6. **Guarana** — berry; natural caffeine source, mind energy, physical endurance

Positioning line used twice: *"Powered by real roots, leaves, berries, and adaptogens not chemicals."*

---

## 2. Visual Identity

**Theme:** Taiga by Woolman, v8.1.0 (Shopify Online Store 2.0, purchased theme — themes.woolman.co)

### Color scheme (`default`, from `config/settings_data.json`)
| Token | Value | Usage |
|---|---|---|
| Background | `#c7e8e5` (soft teal) | Primary background |
| Foreground | `#111111` | Body text |
| Button background | `#faa638` (orange) | Primary CTA |
| Button foreground | `#111111` | |
| Card background | `#ffffff` | |
| Card gradient (accent) | `linear-gradient(127deg, #fef051, #ff46c7)` | Yellow→pink, used for special/testimonial cards |
| Overlay scheme | bg `#006eb9` (blue), accent `#db00a1`/`#cc0095` (magenta) | Announcement bar, footer, dividers |

Divider sections use a recurring **"waves" SVG graphic** in blue gradient — it's the site's signature transition motif between blocks.

### Typography
- **Headings:** Inconsolata (monospace) — bold, gives the brand its "lab/technical" edge against the soft, organic color palette
- **Body:** Rubik
- **Buttons:** header font, wide letter-spacing (6), pill-shaped (`border-radius: 200`), not uppercase
- **Site header/nav:** uppercase, heavy letter-spacing (20)

### UI details
- Icon stroke weight: 1.4 (line icons)
- Product cards: portrait-alt aspect ratio, centered text, badges enabled
- Modal/card corner radius: 12–20px (soft, rounded — contrasts with pill buttons)

---

## 3. Repo / Theme Architecture

Standard Shopify OS 2.0 layout:

```
config/       theme settings (settings_schema.json = theme's configurable options; settings_data.json = current live values, incl. color schemes + presets: Taiga/Bubbly/Meadow/Hehku)
layout/       theme.liquid (main wrapper), password.liquid
locales/      en/de/es/fi/fr/it/sv — storefront + schema translations
sections/     ~70 reusable section .liquid files (hero, faq, testimonials, banner-grid, hotspots, etc.) + 3 section groups (header-group.json, footer-group.json, aside-group.json)
snippets/     shared partials — icons, cards, product form pieces, megamenu, drawers
templates/    JSON templates that assemble sections per page/resource type
```

### Templates present
| Template | Type | Status |
|---|---|---|
| `index.json` | Home | ✅ Fully built — hero, ingredient hotspots, testimonials, blog teaser, founder-story teaser |
| `product.json` | Product | ✅ Fully built — buy box, ingredient tab, benefit banner grid, FAQ (7 Q&As), sliding text |
| `collection.json` | Collection | ✅ Built, generic grid (banner disabled) — only meaningful with more SKUs |
| `list-collections.json` | All collections | ✅ Built, generic header copy ("Explore our extensive range...") — needs real copy once >1 collection exists |
| `page.contact.json` | Contact | ✅ Built — contact form **+** founder-story article **+** divider. Currently doing double duty as the de facto About page. |
| `page.json` | Generic page | ✅ Default main-page only — this is what a new About page would use unless a custom template is built |
| `blog.json` | Blog listing | ✅ Built, "BRAiNWAVES" |
| `article.json` | Blog post | ✅ Built |
| `blog.faq.json` | Alternate blog template (`main-blog-faq`) | ⚠️ Exists in repo, **not confirmed in use** on any live blog |
| `404.json`, `search.json`, `cart.json`, `gift_card.liquid`, `customers/*` | Scaffolding | ✅ Default theme behavior, no custom copy needed yet |

### Navigation (from `sections/footer-group.json`)
Footer link lists: **Quick links** (`footer` menu), **Customer Resources** (`customer-resources` menu), **Contact** (`contact` menu) — these are Shopify-admin-managed navigation menus, not files in this repo. Confirm their live link targets (shipping/returns/privacy/terms) once connected, since that content isn't visible from the theme code.

Header: `main-menu` drawer, 3-item shortcut limit, no megamenu blocks currently configured even though the theme supports megamenu-banners / megamenu-products / megamenu-columns block types.

---

## 4. Content Gaps (why this doc exists)

Live-site crawl confirms:

1. **`/pages/about` returns a 404.** The founder story only exists buried in the Contact page (`page.contact.json` → `featured_article` block linking to the blog post "The BRAiNLUBE Story"). There is no standalone About page.
2. **Only one collection is meaningful** ("All"), holding the single OG Mango SKU. `list-collections.json` and `collection.json` are built generically and will look sparse/empty in the admin's collection list until more collections exist.
3. **Founder name inconsistency** — "Steven Land" (site copy, blog) vs. "S. Bradley Land" (homepage rich-text block). Needs a decision before it's repeated on a new About page.
4. Future flavors are already teased in the live FAQ ("Cerebral Citrus, Brilliant Berry, Proton Peach," early-2027) — collection architecture should anticipate this rather than being built one-SKU-at-a-time later.

See **`CONTENT-DRAFTS.md`** in this repo for the actual page copy and the recommended collection structure.

---

## 5. Before Connecting to Shopify — Checklist

- [ ] Confirm founder's correct name (Steven Land vs. S. Bradley Land)
- [ ] Create `/pages/about` in Shopify Admin (Online Store → Pages), assign the `page` template, paste in drafted copy
- [ ] Decide on collection structure (see CONTENT-DRAFTS.md) and create collections in Admin — collections are store data, not theme files, so they're created after connecting the theme, in Shopify Admin
- [ ] Verify footer menu targets (`customer-resources`, `contact`) actually resolve to real policy pages (Shopify auto-generates legal policy pages under Settings → Policies, distinct from the `pages` app)
- [ ] Decide whether `blog.faq.json` (`main-blog-faq`) should be assigned anywhere, or removed if unused
- [ ] Push this repo to GitHub, then in Shopify Admin: **Online Store → Themes → Add theme → Connect from GitHub**
