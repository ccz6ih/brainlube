# Product Page & Conversion Recommendations

Theme audit findings and ideas for improving conversion, based on comparing the live product page (`templates/product.json`) against everything the **Taiga 8.1.0** theme in this repo actually supports. Short version: the current product page uses maybe half of what this theme version can do, and the copy is functional but flat. Below is what's underused, what's weak, and what to do about the "limited edition" idea specifically.

---

## 1. The theme upgrade itself is safe

Per the 8.1.0 changelog, the only breaking change is the removal of the old Menu banner / Menu collection / Menu divider header blocks in favor of new Megamenu blocks. Checked `sections/header-group.json` — **no megamenu blocks are configured on the live site today** (just a plain drawer menu, 3-item shortcut limit). There's nothing to migrate. This is a clean upgrade, not a rebuild.

That said, the new Megamenu blocks (`megamenu-banners`, `megamenu-products`, `megamenu-columns` — see `sections/header.liquid` schema) are sitting there unused. With only one product they're not worth setting up yet, but once flavors multiply, `megamenu-products` pointed at a "Shop All Flavors" collection is the natural nav upgrade.

---

## 2. Product page: what's built vs. what the theme offers

Current `product.json` block stack, top to bottom:
`badges (disabled)` → `rating (disabled)` → title → description → variant picker → price → `quantity_selector (disabled)` → buy buttons → inventory status → pickup availability → sticky buy bar → one collapsible tab ("Ingredients," rendering a metafield as plain text).

That's it above the fold. Below the fold: a rich-text intro, a 4-icon benefit grid (real icon images — good), a **second, disabled, duplicate** 4-icon benefit grid using auto-generated squiggly SVG art instead of the real icons, a sliding-text banner, disabled product recommendations, and the FAQ.

**Blocks the theme has available that aren't used anywhere on the product page:** `attribute_insights`, `icons`, `upsell_products`, `sibling_products`, `share`, `sku`, `custom_liquid`, `badges`. That's most of the theme's newer conversion tooling sitting completely idle.

### `attribute_insights` — biggest missed opportunity
This block renders a labeled visual scale (slider / fill-bar / segmented) with a value from 0–100, custom start/center/end labels, and optional threshold messaging ("if value is low, show this message"). It's built for exactly what an energy drink buy box needs and currently has nothing like it:
- **Caffeine content** — e.g. a fill-bar labeled "Mild / Moderate / High" showing BRAiNLUBE sitting in the "just enough" zone, directly reinforcing the "just enough caffeine to stay sharp" copy that's currently just a sentence, not a visual.
- **Crash risk** — segmented scale, low-to-high, with BRAiNLUBE marked low. This is the single biggest differentiator claim on the site ("no crash") and right now it's asserted, never shown.
- Could also do "Focus Duration" or "Natural Ingredient %" the same way.

This turns a claim into a glanceable graphic right in the buy box, next to the price — that's normally the highest-value real estate on the page and it's currently just a plain price + buttons.

### `icons` block (up to 8 images + title, in a grid) — for ingredient credibility
This is a ready-made slot for exactly the images you're gathering. Rather than only having the ingredient breakdown live in a text-only collapsible tab, add an `icons` block near the top of the product page: one tile per ingredient (Ashwagandha, Bacopa, Ginkgo, Ginseng, Guarana, Caffeine), each with its real photo (root/berry/leaf) and the ingredient name. This mirrors the homepage's hotspot treatment but works as static, scannable proof directly on the page where people decide to buy — right now the product page's only ingredient content is a metafield dumped into a collapsible tab, no imagery at all.

### `badges` block + `settings.custom_badges` — for Limited Edition (see §3)

### `upsell_products` and `sibling_products` — not urgent at n=1, but plan for it
`sibling_products` in particular is built for cross-linking variant-like products by a shared option name (e.g., "Flavor") — this is exactly the mechanism to use once Cerebral Citrus / Brilliant Berry / Proton Peach ship, if they're modeled as separate products rather than variants of one. Worth deciding that data model now (separate products vs. variants) since it changes which of these blocks apply.

### Product media captions (new in 8.1.0)
`snippets/product-media.liquid` now reads a pipe character in each image's alt text (`Alt text|Caption text`) and displays the second half as an overlay caption in the zoom gallery. Cheap way to add "Real mango juice, no artificial flavors" or "12oz, serves 1" directly on the product photos once real photography is in — no new section needed, just alt-text convention when uploading images.

---

## 3. The "Limited Edition" idea — the theme already half-built this

Good instinct — and worth knowing the theme is already set up for it in two places nobody's using yet:

1. **`collection.json` already has two disabled-by-default banner blocks** in the product grid literally titled "LIMITED EDITION" and "LIMITED-EDITION OG MANGO" (`sections/main-collection-product-grid.liquid` banner block type, inserted at a specific grid position). Someone building this theme clearly anticipated a limited-run merchandising moment. At one product, a grid with a banner tile next to a single product card will look sparse — this pays off once there are 2–3 products, but the mechanism is there today.
2. **`hero-countdown.liquid` is a full countdown-timer hero section** (`component-count-down.css` + `component-countdown.js`), completely unused anywhere in the current templates. This is the natural tool for a "first batch / limited release" launch: swap the homepage hero for this section with a countdown to when the limited batch sells out or a restock date, paired with real urgency copy instead of just the current straightforward "Power Up Your Brain" hero.
3. **`badges` block + `settings.custom_badges`** (format: `tag:#background:#text`, semicolon-separated, in `config/settings_schema.json`) lets you tag the product `Limited Edition` and have a real badge render on the product card and product page automatically — no custom code. Currently the `badges` block is disabled on the product page and there's no custom badge configured at all.

**Concretely for the current single-SKU launch:** tag the OG Mango product `Limited Edition`, add the custom badge, enable the `badges` block on the product page (position: over-media, so it shows on the can photo), and consider the countdown hero for the homepage during the launch window. That's copy + two settings changes + one section swap — no new build required.

---

## 4. Copy quality — concrete critique

The existing copy isn't bad, but it under-sells. It states facts rather than making you want the can in your hand. Examples:

- **Homepage hero rich-text** currently: *"BRAiNLUBE™ is a cognitive support drink with a splash of natural energy. Powered by real roots, leaves, berries, and adaptogens not chemicals... Made by a small business. Just smart stuff inside."* This is accurate but generic — it could describe almost any supplement brand. It never mentions the actual physical experience (what it tastes like, what "sharp" actually feels like, when you'd reach for it) until the FAQ, three scrolls down.
- **Product description** on the product page is minimal — the actual detail (six ingredients, what each does, the founder story, the flavor) all lives in *other* sections (FAQ, homepage), not in the one place — the product page itself — where someone is actively deciding to buy. A first-time visitor landing directly on the product URL (from an ad, a share, a QR code on the can) gets a thin page.
- **FAQ intro copy** is good and does the most "selling" of anywhere on the site ("Curious about what makes BRAiNLUBE™ different from your average energy drink? You're in the right place.") — this voice should be the template for the rest of the site's copy, not the exception.

**Direction, not a rewrite:** lean harder into sensory + specific detail everywhere. Instead of "just enough caffeine to stay sharp," say what that means in practice — how it compares to a coffee or a typical energy drink, how long the focus lasts, what it doesn't feel like (no jitters, no crash at 2pm). Instead of "made by a small business," tell the actual two-year formulation story on the page it's selling from, not just buried in a blog post linked from Contact. Once real ingredient photography and the `attribute_insights` scales are in, a lot of this "prove it, don't just say it" work is visual instead of copy — which is the better fix anyway.

---

## 5. Suggested priority order

1. **Confirm product data model for future flavors** (separate products vs. variants) — this decision affects whether `sibling_products` applies and how collections get built later.
2. **Limited Edition launch**: tag product, configure custom badge, enable `badges` block, swap in `hero-countdown` for the launch window. Low effort, uses existing theme mechanisms.
3. **Ingredient imagery**: once photos are ready, add an `icons` block (or a hotspot-style section) to the product page — this is the single highest-impact content gap since the product page currently shows zero ingredient imagery despite it being the site's core credibility story.
4. **`attribute_insights` scales** for caffeine level / crash risk in the buy box — turns the site's main differentiator claim into something visual, right where people decide to buy.
5. **Product page copy pass**: bring the FAQ's sharper, more confident voice into the product description itself so a cold visitor landing directly on the product page gets the full story, not a thin page.
6. **Clean up dead weight**: delete the disabled duplicate SVG benefit-icon block on the product page (`banner_grid_Vw4bUx`) — it's a leftover duplicate of the enabled real-icon version and adds nothing if ever turned on.
