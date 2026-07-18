# Response to the Conversion & Content Audit

The audit you shared is a solid framework (Magic Mind is the right comparison), but it was written without live Admin access. Now that the Shopify connector points at the real store, here's what's actually true, what I already fixed, and what's left. Findings below are from live queries against brainlube.com, not assumptions.

---

## Already fixed this pass (live on the store right now)

- **Product tagged `Limited Edition`** — the badge configured in `config/settings_data.json` last session will now render automatically once the theme is connected.
- **Product description rewritten** — replaced the thin, generic description with one that states the real formula and leads with the differentiator, not just adjectives.
- **Product page's Caffeine Level / Crash Risk scales recalibrated** (`templates/product.json`) — see below for why.

## Audit item #3 ("ingredient list contradicts the pitch") — mostly resolved, one real calibration issue

Pulled the actual product label image attached to the product (`Label_-_Can_...png`, uploaded very recently — after the audit was likely written). It has a **"BRAiNLUBE Energy Blend"** panel the audit's read apparently missed: taurine, guarana seed extract, ginseng root extract, green coffee bean extract, ashwagandha root extract, L-citrulline, bacopa monnieri, L-tyrosine, ginkgo biloba root extract, L-theanine, inositol — plus **130mg caffeine per serving**, disclosed separately. All six hero ingredients are there. This isn't the landmine the audit describes.

**What actually needed fixing:** 130mg of caffeine in a 12oz can is roughly coffee/Monster-strength — not "mild." The copy and the new attribute_insights scale I added last pass were calibrated as if it were a light dose. I corrected both: the scale now reads 62/100 ("moderate-high") instead of 40, and the messaging leans on the real, legitimate mechanism — L-theanine paired with caffeine is well-documented for smoothing out jitters — rather than underselling the dose. This is a stronger, more honest claim than "just enough caffeine," and it's backed by an ingredient that's actually on the label.

**Also worth noting:** the label uses a proprietary-blend format (total blend + total caffeine, not per-compound mg) and calls it "Nutrition Facts," not "Supplement Facts" — both correct, since this is a conventional beverage, not a supplement pill. The audit's ask for "12 compounds by amount" like Magic Mind isn't a compliance requirement, just a nice-to-have if you ever want to break out individual dosages.

## Confirmed real (verified via API, not just re-stating the audit)

- **No refund, shipping, or terms-of-service policy exists at all.** Queried `shop.shopPolicies` directly — only a Privacy Policy is configured. This is worse than "the returns link points to the wrong policy" (audit #9) — there's no returns policy to link to. **I didn't write one**, because refund terms are a real commitment to customers and I don't want to invent them — see questions below.
- **The "$50 free shipping" banner isn't backed by any rule.** Checked automatic discounts, discount codes, and the shipping rate table directly — zero automatic/code discounts exist, and the one $0 shipping rate in the delivery profile appears to be weight-tiered, not tied to a $50 subtotal. So beyond the audit's math point (one $30 product can't reach $50), the promise currently isn't enforced by anything at all.
- **Zero reviews, one SKU, one variant** — matches the audit.
- **Found something the audit didn't mention:** a second product already exists in the system — *"Coming Soon - Nootropics Energy Drink, Cerebral Citrus"* (DRAFT, 4-Pack $20 / 6-Pack $30, zero inventory). This answers the flavor-architecture question from last session: flavors are being modeled as **separate products**, not variants of one product. The collection plan in `CONTENT-DRAFTS.md` (flavor-specific collections) is the right shape for that.

## Can't verify or fix via API — needs you, directly in Shopify Admin

- **Payment methods.** Activating Shopify Payments (cards, Shop Pay, Apple/Google Pay) requires you to complete business/bank verification yourself in Admin → Settings → Payments — no connector or API can do this. Per the audit, this is the single highest-leverage fix available. I'd do this before anything else this week, before any copy or layout change.
- **Reviews app** (Judge.me, Loox) — installs go through the Shopify App Store, not the Admin API.

## Needs a decision from you before I write anything live

1. **Refund/guarantee terms** — what do you actually want to offer? ("30-day money back," "keep the cans, refund anyway," something narrower?) Once you tell me, I'll draft and publish real Refund, Shipping, and Terms of Service policies — currently there are none.
2. **Free shipping threshold** — lower the promise to match the $30 pack, or build toward a bundle that clears $50 naturally? The Cerebral Citrus draft product suggests a multi-flavor bundle may already be part of the plan.
3. **Trust badges** (third-party tested / made in USA / non-GMO / vegan) — audit item #10 suggests adding these near the buy button. I won't add a factual claim I can't verify — which of these are actually true?
4. **Subscriptions/bundles** — deferred last session as "small stuff for later," but the audit frames this as core to the business model in this category (average order value, not catalog breadth). Worth pulling forward, or still fine to wait?

---

## Follow-up: acting on your decisions

- **Refund policy (30-day, return required):** drafted and attempted to publish directly, but the Shopify connector doesn't have the `write_legal_policies` permission scope, so it can't write policies via API — this one needs you to paste it in. Text is below, ready to go into **Admin → Settings → Policies → Refund policy**:

  > We want you to feel confident buying BRAiNLUBE™. If you're not satisfied, you can return unopened cans within 30 days of delivery for a full refund.
  >
  > **How it works:** Contact us within 30 days of your delivery date to start a return. Ship the product back to us in its original packaging — you're responsible for return shipping unless the item arrived damaged or incorrect. Once we receive and inspect the return, we'll issue a refund to your original payment method.
  >
  > **Damaged or incorrect orders:** contact us within 30 days and we'll make it right at no cost to you — replacement or refund, your choice.
  >
  > Because these are consumable products, opened cans can't be returned unless defective.

- **Shipping threshold — bigger finding than I first reported.** I initially said no rule backed the $50 free-shipping claim; that was wrong. It's a real, price-based shipping rate (Economy, $0, triggers at order total ≥ $50) — I just hadn't queried deep enough the first time. So the actual problem is exactly what the audit said: the rate exists, but with one $30 product it's unreachable. I updated the announcement bar copy to **"FREE SHIPPING ON ORDERS $30+"** to match your call, but I deliberately did **not** touch the live shipping rate itself — the mutation for editing delivery-profile conditions is large and deeply nested, and getting it wrong risks corrupting real shipping rates for real customers. This is a 30-second manual fix: **Admin → Settings → Shipping and delivery → Domestic → edit the "Economy" $0 rate's minimum order price from $50 to $30.** Please do that one directly rather than have me guess at it.

- **Trust badges** (Third-Party Tested / Made in USA / Non-GMO) — added as a small line directly under the buy buttons on the product page (`templates/product.json`).

- **Subscriptions — already fully wired, no theme work needed.** Checked the product directly: a "Subscribe and save" selling plan group exists with weekly and monthly options (15% off each), already attached to the OG Mango product. Also checked the theme's product form code (`product-buy-bar.liquid`, `product-template.liquid`) — it already has native `product.selling_plan_groups` support built in. This should just be showing up live already; if it isn't rendering, it's worth a quick look at the product page rather than a theme fix, since the plumbing is all there.

---

## Note on the theme/Shopify connection

The theme is now connected via GitHub, and the Shopify theme editor auto-commits back to this repo whenever it re-saves theme files (you'll see commits from `shopify[bot]` — that's expected, not a conflict). One real side-effect from the connect/first-sync: the second wave-divider on the About page (`divider_about_2`) came back from Shopify's sync marked disabled. Left it as-is rather than fighting the live state since it's a minor decorative element — flag it if you want it re-enabled.
