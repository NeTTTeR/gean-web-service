## Project: GEAN — Brand Website MVP

### Product Goal

To build a branded product website for **GEAN**, a premium hand cream product. The site communicates the brand story, showcases the product, provides an article hub, and offers a contact channel — all in a clean, minimal, premium aesthetic with bilingual (Thai + English) content.

---

### Pages Overview

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero + product intro + brand values |
| Shop | `/shop` | Product listing and purchase CTA |
| Our Story | `/our-story` | Brand background and philosophy |
| Article | `/article` | Blog/article card grid |
| Contact Us | `/contact` | Contact info, social links, QR code, FAQ |

---

### FR.1 — Global Navigation

| ID | User Story | Acceptance Criteria |
|---|---|---|
| FR.1.1 | As a user, I want a top navigation bar to access any page. | 1. Nav bar contains: Logo (GEAN), links (SHOP, OUR STORY, ARTICLE, CONTACT US), cart icon, and a prominent "BUY NOW" button. 2. Nav bar is visible on all pages. |
| FR.1.2 | As a user, I want the navigation to be usable on any device. | 1. Nav collapses into a hamburger menu on mobile. |

---

### FR.2 — Home Page

| ID | User Story | Acceptance Criteria |
|---|---|---|
| FR.2.1 | As a visitor, I want a hero section that immediately communicates the brand value. | 1. Full-width hero with dark background image (keyboard/workspace lifestyle photo). 2. Headline: **"WORK SMARTER, FEEL BETTER."** 3. Subtext: *"Zero Greasiness. Scent for Focused Minds. The Office Essential."* 4. CTA button: **"DISCOVER GEAN"** scrolls to product section. |
| FR.2.2 | As a visitor, I want to see 3 key benefit highlights below the hero. | 1. Three icons with labels and short descriptions: **Freshly Clean** (ดูแลมือ สะอาด), **Repairing Comfort** (ซ่อมแซมความเสียหาย), **Deep Nourishment** (บำรุงให้ผิวละมุนเนียน). |
| FR.2.3 | As a visitor, I want to view the featured product with an add-to-cart option. | 1. Section title: **"OUR PRODUCT"**. 2. Product card shows: product image, product name, short description, "Add to cart" button, and "Read more" link. |
| FR.2.4 | As a visitor, I want to understand why to use this hand cream. | 1. Section title: **"Why Hand Cream?"** 2. Three value props with icons: **UNIQUE FORMULA**, **UNIQUE SCENT**, **PROFESSIONAL**. Each with a short Thai description beneath. |
| FR.2.5 | As a visitor, I want detailed benefit sections with visual support. | 1. Three alternating image + text sections: **01. Freshly Clean**, **02. Repair Renew**, **03. Nourish Skin**. 2. Each section has a product/ingredient image and a descriptive paragraph (Thai). |
| FR.2.6 | As a visitor, I want to see a brand tagline section. | 1. Full-width section with brand quote: *"Beyond moisture. A sanctuary for your hands."* 2. Thai translation below: *สนุกกับแสง สนุกสุขภาพมือ สนุกกับความงาม* |
| FR.2.7 | As a visitor, I want to see the core ingredients. | 1. Section title: **"THE CORE ELEMENTS"** 2. List of key ingredients with icons/labels: 95% Squalane Extract, Ceramide Complex, D-Panthenol (DAPF), Premium Green Tea Extract, White Tea Essence, Damask Rose. |

---

### FR.3 — Shop Page

| ID | User Story | Acceptance Criteria |
|---|---|---|
| FR.3.1 | As a shopper, I want to browse available GEAN products. | 1. Page title: **"SHOP"**. 2. Products displayed in a responsive grid (2-3 columns). 3. Each product card shows: image, name, price, and "Add to cart" button. |

---

### FR.4 — Our Story Page

| ID | User Story | Acceptance Criteria |
|---|---|---|
| FR.4.1 | As a visitor, I want to learn about the brand origin and philosophy. | 1. Shared hero banner (same as Home hero). 2. "OUR STORY" section with long-form brand narrative in **English** and **Thai**. 3. English content covers: brand essence, founder vision, product integrity commitment, and brand promise. |

**English Story Content (reference):**
> The GEAN Story: The Essence of Pristine Care. True well-being begins with absolute purity. At GEAN, we believe that cleanliness is not merely a daily routine, but the very foundation of genuine self-care.
>
> GEAN was born from a founder's uncompromising vision: to create a sanctuary of personal care products that people can truly trust. Driven by a deep appreciation for the "Raw & Real" — an authentic, unpretentious approach to life — our intention is to bridge the gap between exceptional quality and everyday necessity. We envision GEAN as a comprehensive ecosystem of cleanliness and hygiene essentials, meticulously designed to elevate your daily rituals.
>
> From the thoughtful selection of ingredients to the final, comforting touch on your skin, every product embodies our profound commitment to pristine care. We craft each formula with integrity, ensuring that genuine effectiveness, safety, and refined aesthetics are always within your reach.
>
> At GEAN, we protect and purify, so you can step into the world with confidence. Because when you experience the profound peace of mind that comes from true cleanliness, you are free to write your own beautiful story.

---

### FR.5 — Article Page

| ID | User Story | Acceptance Criteria |
|---|---|---|
| FR.5.1 | As a reader, I want to browse articles about skincare and wellness. | 1. Shared hero banner. 2. Section title: **"ARTICLE"** displayed on a warm tan/brown background. 3. Articles displayed in a 3-column card grid. 4. Each card is rounded with a thumbnail image, article title, and short excerpt. |

---

### FR.6 — Contact Us Page

| ID | User Story | Acceptance Criteria |
|---|---|---|
| FR.6.1 | As a customer, I want to find ways to contact GEAN. | 1. Shared hero banner. 2. Section title: **"HOW CAN WE SUPPORT?"** 3. Intro text in Thai directing users to LINE/Instagram. |
| FR.6.2 | As a customer, I want to see GEAN's social media contacts. | 1. LINE: **@gean_officially** (with LINE icon). 2. Instagram: **gean_officially** (with Instagram icon). |
| FR.6.3 | As a customer, I want to scan a QR code to contact GEAN quickly. | 1. QR code image displayed with label **"SCAN FOR CONTACT US!"** 2. Short Thai description below the QR code. |
| FR.6.4 | As a customer, I want quick answers to common questions. | 1. **"Quick Answers"** section with bullet-point FAQ list. 2. Minimum items: shipping timeline (1–3 days), return policy, 100% authentic guarantee. |

---

### Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NF.1 | Design | Color palette: dark brown/charcoal for hero (#1a1a1a), sage/mint green for accent sections, off-white/cream for backgrounds. |
| NF.2 | Typography | Light/thin weight sans-serif font for headings (e.g. similar to the GEAN logo style). Body text readable at small sizes. |
| NF.3 | Responsive | Fully responsive across desktop (1280px+), tablet (768px), and mobile (375px). |
| NF.4 | Bilingual | All key sections support both Thai and English content side-by-side or stacked. |
| NF.5 | Performance | Pages load quickly; images are optimized. No heavy animations that block content. |
| NF.6 | Branding | GEAN logo appears in the top-left of the nav on every page. Brand identity is consistent across all pages. |
