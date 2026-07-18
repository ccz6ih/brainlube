# Content Drafts — Pages & Collections

Draft copy for the gaps identified in `README.md`. Written to match the existing site voice (short, benefit-first, light wordplay, ingredient-science-adjacent). Treat as a first pass for review, not final legal/marketing copy — anything involving health claims should get a compliance pass before publishing, same as the existing FAQ disclaimers.

Founder name confirmed as **Steve Land**.

---

## A. About Page (`/pages/about`) — ✅ built in `templates/page.about.json`

This is no longer just a draft — `templates/page.about.json` in this repo now contains the full page, built the same way `page.contact.json` is (a disabled `main-page` + real sections underneath): hero → divider → origin story → philosophy → three-pillar recap (reused from the homepage) → founder-story teaser (same `featured-article` block the Contact page uses, linking to "The BRAiNLUBE Story") → divider → closing CTA.

**One manual step is still required in Shopify Admin** (page templates only apply once a Page resource exists — that's store data, not a theme file): create a Page titled **About**, handle `about`, and set its template suffix to `about` so it picks up `page.about.json`. The copy below is what's now live in that template file, kept here for reference/editing.

### Hero (image-with-text section)
> **SUBTITLE:** THE STORY BEHIND THE CAN
> **TITLE:** WE BUILT THE ENERGY DRINK WE WISHED EXISTED

### Rich text — origin
> BRAiNLUBE™ started with a problem, not a business plan.
>
> Steve Land spent years running on machine-dispensed coffee through long stretches in IT computer rooms — the kind of hours where your body's awake but your brain checked out an hour ago. Then he tried an early commercial energy drink built around natural adaptogens, and noticed something: sharper focus, smoother thinking, none of the usual jitter-and-crash.
>
> Then that formula disappeared from shelves.
>
> So he pulled together a small team and spent two years building something better — not just replacing the drink he lost, but rethinking what an energy drink should actually do for your brain, not just your adrenaline.

**Button:** SHOP BRAINLUBE → `/collections/all`

### Rich text — philosophy (reuse existing "What's Inside" hotspot content from the homepage, or link to it)
> BRAiNLUBE™ is a cognitive support drink with a splash of natural energy — powered by real roots, leaves, berries, and adaptogens, not chemicals. Every ingredient is chosen for one job: cross the blood-brain barrier and actually do something, in doses precise enough to build up in your system without overloading it.
>
> Made by a small business. Just smart stuff inside.

### Three-pillar recap (banner-grid or testimonials section — this content already exists verbatim in `index.json`, reuse rather than rewrite)
- **Carefully Chosen Ingredients** — that cross the blood-brain barrier and actually work
- **Precise Ingredient Amounts** — so active ingredients absorb efficiently and build in your system over time, without overload
- **Naturally Balanced Flavors** — like mango + citrus, for better taste and absorption

### Founder note (optional closing block, testimonial-style single quote)
> "I didn't want to build another energy drink. I wanted the one I couldn't buy anymore." — Steve Land, Founder

### Closing CTA (rich-text + buttons, matches homepage pattern)
> **SUBTITLE:** READY TO TRY IT?
> **BUTTON:** SHOP BRAINLUBE → `/collections/all`
> **SECONDARY LINK:** Read the full story on BRAiNWAVES → `/blogs/brainwaves/the-brainlube-story`

---

## B. Collection Architecture (single-SKU-today, multi-flavor-soon)

The live FAQ already tells customers new flavors are coming ("Cerebral Citrus, Brilliant Berry, Proton Peach," early-2027 target). Build the collection structure now so:
- Nav/SEO doesn't need restructuring later
- The "Coming Soon" collection can start building an email list immediately
- `list-collections.json`'s generic "Explore our extensive range" copy has something real to point at

### Recommended collections

**1. Shop All** — `all`
- *Title:* Shop All BRAiNLUBE
- *Description:* "Every can we make, in one place. Right now that's one very good flavor — more are brewing." (self-aware about the single-SKU reality rather than pretending otherwise)
- *SEO title:* BRAiNLUBE Nootropic Energy Drinks | Shop All
- *Meta description:* Shop BRAiNLUBE, the cognitive-support energy drink made with ashwagandha, bacopa monnieri, ginseng, ginkgo, guarana, and real mango juice.

**2. OG Mango** — `og-mango` *(flavor-specific collection, even at n=1)*
- *Title:* OG Mango
- *Description:* "The original. Real mango juice, a precise adaptogen-and-nootropic stack, and just enough caffeine to keep you sharp without the crash."
- Purpose: once Cerebral Citrus / Brilliant Berry / Proton Peach ship, this becomes one tile in a flavor grid instead of a page that has to be rebuilt from scratch.

**3. Coming Soon** — `coming-soon`
- *Title:* What's Brewing Next
- *Description:* "Cerebral Citrus. Brilliant Berry. Proton Peach. New flavors are in development now, targeting early 2027. Want first access?"
- Contents: no purchasable products yet — pair with a newsletter-signup block (the theme's `newsletter` footer block / `modal-newsletter.liquid` section already exist for this) instead of a product grid.

**4. Best Sellers** *(hold until there are ≥3 SKUs — not worth building at n=1)*

### Collection page settings note
`main-collection-banner` is currently `"disabled": true` in `collection.json` — turn it on once collections have real distinguishing copy (per above), otherwise every collection page will look identical to the product grid with no context.

---

## C. FAQ Page (optional, low priority)

`templates/blog.faq.json` (`main-blog-faq` section) exists in the repo but isn't confirmed live anywhere. The actual FAQ content (7 Q&As: how BRAiNLUBE works, what nootropics/adaptogens are, caffeine content, serving frequency, side effects, taste) already lives inline on the product page (`product.json` → `faq` block) and is solid as-is. Two options:
- Leave as-is (FAQ lives on the product page only) — simplest, no action needed.
- Or promote it to a standalone `/pages/faq` or the unused blog-faq template for SEO surface area — only worth doing if organic search is a priority, since the content would just be duplicated/relocated, not new.

---

## D. Legal / Policy Pages

Not part of this repo — Shopify auto-generates policy pages (Shipping, Returns, Privacy, Terms) under **Settings → Policies** once the store is live, separate from the `pages` app. Footer links to `customer-resources` and `contact` menus need to be wired to these after the theme is connected. Flagging here so it isn't forgotten, not because it's a theme-file task.

---

## E. Product Description (Admin field — not a theme file)

`product.description` is store data (Shopify Admin → Products → OG Mango → Description), not something a theme template controls, so it can't be committed to this repo — it has to be pasted into Admin directly. Current live description is thin; here's a fuller draft matching the sharper FAQ voice, meant to replace it:

> **BRAiNLUBE™ — OG Mango**
>
> Most energy drinks spike you, then dump you an hour later. This one doesn't.
>
> BRAiNLUBE™ is a cognitive-support drink first and an energy drink second — six natural ingredients (ashwagandha, bacopa monnieri, ginkgo biloba, ginseng, guarana, and just enough caffeine) chosen to cross the blood-brain barrier and actually do something, dosed precisely enough to build in your system without overloading it. Real mango juice, lightly carbonated, nothing synthetic.
>
> **What it's for:** the stretch of your day where you need to think clearly, not just feel wired — deep work, long shifts, exam prep, whatever demands your brain more than your adrenaline.
>
> **What's in every can:** real roots, leaves, berries, and adaptogens. No synthetic stimulant stack, no crash at 2pm.
>
> *Not intended for children under 18. Not recommended for individuals sensitive to caffeine, pregnant women, or nursing mothers. Limit to two 12oz cans daily.*

This also gives the product page real content of its own — right now a visitor landing directly on the product URL (from an ad, a share, a QR code on the can) sees a thin page, since most of the actual selling copy lives on the homepage and in the FAQ instead.
