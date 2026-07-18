# Content Drafts — Pages & Collections

Draft copy for the gaps identified in `README.md`. Written to match the existing site voice (short, benefit-first, light wordplay, ingredient-science-adjacent). Treat as a first pass for review, not final legal/marketing copy — anything involving health claims should get a compliance pass before publishing, same as the existing FAQ disclaimers.

Founder name confirmed as **Steve Land**.

---

## A. About Page (`/pages/about`) — ✅ built in `templates/page.about.json`

Restructured per direction: the page now leads with two dropdown/accordion panels right after the hero — **"About The Company"** and **"The Science — Why BRAiNLUBE Works"** — using the theme's `faq` section type (same accordion component used elsewhere on the site). Below that: the three-pillar recap, the founder-story teaser (linking to the BRAiNWAVES blog post), and a closing CTA.

**One manual step is still required in Shopify Admin** (page templates only apply once a Page resource exists): create a Page titled **About**, handle `about`, template suffix `about` — this has already been done based on the live menu (main menu already links `/pages/about`), so this may already be complete; just confirm the template suffix is set to `about`.

---

## B. Collection Architecture (single-SKU-today, multi-flavor-soon)

Deferred per direction — revisit once the site itself is dialed in. Note: a second product, *"Coming Soon - Nootropics Energy Drink, Cerebral Citrus"* (draft status, 4-Pack $20 / 6-Pack $30), already exists in the store, confirming flavors are modeled as separate products, not variants.

---

## C. FAQ Page (optional, low priority)

`templates/blog.faq.json` (`main-blog-faq` section) exists in the repo but isn't confirmed live anywhere. The product-page FAQ (7 Q&As) is solid as-is; no action needed unless you want it promoted to its own page for SEO surface area later.

---

## D. Legal / Policy Pages — drafted, blocked on a permission scope

The Shopify connector can write products, menus, and most store data, but **not** shop policies (`write_legal_policies` scope isn't granted) — so these three need to be pasted into **Admin → Settings → Policies** by hand. The footer's "Customer Resources" menu has already been wired to the correct canonical URLs for all four policies (`/policies/refund-policy`, `/policies/shipping-policy`, `/policies/privacy-policy`, `/policies/terms-of-service`), so the moment you save each policy in Admin, the footer links start working with no further action.

### Refund Policy
> We want you to feel confident buying BRAiNLUBE™. If you're not satisfied, you can return unopened cans within 30 days of delivery for a full refund.
>
> **How it works:** Contact us within 30 days of your delivery date to start a return. Ship the product back to us in its original packaging — you're responsible for return shipping unless the item arrived damaged or incorrect. Once we receive and inspect the return, we'll issue a refund to your original payment method.
>
> **Damaged or incorrect orders:** contact us within 30 days and we'll make it right at no cost to you — replacement or refund, your choice.
>
> Because these are consumable products, opened cans can't be returned unless defective.

### Shipping Policy
> We ship across the United States and to a growing list of international destinations.
>
> **Processing time:** Orders are typically processed within 1–2 business days.
>
> **Shipping rates & delivery:** Shipping costs are calculated at checkout based on your order and destination. Free shipping is available on qualifying orders — look for the free shipping banner at checkout for the current threshold.
>
> **International shipping:** Customers are responsible for any customs duties, taxes, or fees charged by their destination country.
>
> Questions? Contact us anytime.

### Terms of Service
> These Terms of Service govern your use of BRAiNLUBE™ ("we," "us," "our") and any purchase made through brainlube.com. By using this site or placing an order, you agree to these terms.
>
> **Products & health disclaimer:** Our products are not intended to diagnose, treat, cure, or prevent any disease and have not been evaluated by the FDA. BRAiNLUBE™ is not intended for children under 18, and is not recommended for individuals sensitive to caffeine, pregnant women, or nursing mothers. Consult a physician before use if you have a medical condition or take medication.
>
> **Age requirement:** You must be at least 18 years old to purchase from this site.
>
> **Orders & payment:** All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our discretion, including in cases of suspected fraud or pricing/product errors.
>
> **Intellectual property:** All content on this site, including the BRAiNLUBE™ name, logo, and product designs, is our property and may not be used without written permission.
>
> **Limitation of liability:** To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of our products or site.
>
> **Governing law:** These terms are governed by the laws of the State of Colorado.
>
> **Changes:** We may update these Terms of Service from time to time. Continued use of the site after changes means you accept the new terms.

---

## E. Product Description (Admin field) — ✅ already live

Replaced live via the Shopify connector — see `AUDIT-FINDINGS.md` for what changed and why.
