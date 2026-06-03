# GEAN — Functional Requirements Document

**Project:** GEAN Brand Website  
**Version:** 1.0  
**Scope:** Functional requirements only — what the system does from the user's perspective

---

## Table of Contents

1. [Users & Roles](#1-users--roles)
2. [Global Navigation](#2-global-navigation)
3. [Home Page](#3-home-page)
4. [Shop Page](#4-shop-page)
5. [Product Detail Page](#5-product-detail-page)
6. [Cart](#6-cart)
7. [Our Story Page](#7-our-story-page)
8. [Article Page](#8-article-page)
9. [Article Detail Page](#9-article-detail-page)
10. [Contact Us Page](#10-contact-us-page)
11. [Footer](#11-footer)
12. [Content & Language](#12-content--language)

---

## 1. Users & Roles

The website is public and unauthenticated. All visitors have access to all pages without logging in.

| User Type | Description |
|---|---|
| Visitor | Any person browsing the site; can view all content |
| Shopper | A visitor who interacts with the shop (add to cart, view products) |

---

## 2. Global Navigation

### 2.1 Navigation Bar

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| NAV.1 | The navigation bar is visible on every page of the website. | The nav bar appears at the top of all 5 pages (Home, Shop, Our Story, Article, Contact Us). |
| NAV.2 | The nav bar contains the GEAN logo on the left side. | Clicking the logo navigates the user to the Home page from any page. |
| NAV.3 | The nav bar contains links to all main sections. | Links present: SHOP, OUR STORY, ARTICLE, CONTACT US. Each link navigates to the correct page. |
| NAV.4 | The nav bar contains a cart icon on the right side. | Clicking the cart icon opens the Cart drawer/overlay. The icon displays a badge with the number of items in the cart when the cart is not empty. |
| NAV.5 | The nav bar contains a "BUY NOW" button. | Clicking "BUY NOW" navigates the user to the Shop page (`/shop`). |
| NAV.6 | The current active page is visually distinguished in the navigation. | The link corresponding to the current page is highlighted (e.g., underlined or different color) so the user knows where they are. |

### 2.2 Mobile Navigation

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| NAV.7 | On small screens, the navigation links collapse into a menu icon (hamburger). | A menu toggle icon appears in the top-right area when the viewport is too narrow to display all links. |
| NAV.8 | Tapping the menu icon opens a full navigation menu. | All navigation links (SHOP, OUR STORY, ARTICLE, CONTACT US) and the BUY NOW button become accessible. |
| NAV.9 | Tapping any link in the mobile menu closes the menu and navigates to the selected page. | Menu closes upon navigation. |

---

## 3. Home Page

**Route:** `/`  
**Purpose:** First impression page — communicates the brand, product value, and drives discovery.

### 3.1 Hero Section

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| HOME.1 | The page opens with a full-width hero section. | The hero occupies the full viewport width and significant height. |
| HOME.2 | The hero displays the brand headline and subtext. | Headline: **"WORK SMARTER, FEEL BETTER."** Subtext: *"Zero Greasiness. Scent for Focused Minds. The Office Essential."* Both are visible on the hero. |
| HOME.3 | The hero contains a "DISCOVER GEAN" call-to-action button. | Clicking the button smoothly scrolls the page down to the "OUR PRODUCT" section. |

### 3.2 Benefit Highlights Section

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| HOME.4 | Below the hero, three product benefit highlights are displayed. | Three items appear side-by-side: (1) **Freshly Clean** — ดูแลมือ สะอาด, (2) **Repairing Comfort** — ซ่อมแซมความเสียหาย, (3) **Deep Nourishment** — บำรุงให้ผิวละมุนเนียน. Each item has an icon, English title, and Thai description. |

### 3.3 Featured Product Section

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| HOME.5 | A featured product card is displayed with the section title "OUR PRODUCT". | The product card shows: product image, product name, and a short description. |
| HOME.6 | The product card provides two actions. | (1) **"Add to cart"** button: adds the product to the cart. (2) **"Read more"** link: navigates the user to the Product Detail page for that product. |

### 3.4 Why Hand Cream? Section

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| HOME.7 | A "Why Hand Cream?" section displays three value propositions. | Three items shown: **UNIQUE FORMULA**, **UNIQUE SCENT**, **PROFESSIONAL**. Each has an icon and a short Thai description. |

### 3.5 Benefit Deep-Dive Sections

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| HOME.8 | Three detailed benefit sections are presented in sequence. | Sections in order: **01. Freshly Clean**, **02. Repair Renew**, **03. Nourish Skin**. Each section has an image and a descriptive paragraph in Thai. |
| HOME.9 | The image and text alternate sides between sections. | Section 01 has image on one side; Section 02 alternates; Section 03 alternates again — creating a visually varied layout. |

### 3.6 Brand Tagline Section

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| HOME.10 | A full-width brand quote section is displayed. | English quote: *"Beyond moisture. A sanctuary for your hands."* Thai translation below: *สนุกกับแสง สนุกสุขภาพมือ สนุกกับความงาม* |

### 3.7 Core Ingredients Section

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| HOME.11 | A "THE CORE ELEMENTS" section lists the key ingredients. | The following ingredients are displayed, each with a label and icon/visual: 95% Squalane Extract, Ceramide Complex, D-Panthenol (DAPF), Premium Green Tea Extract, White Tea Essence, Damask Rose. |

---

## 4. Shop Page

**Route:** `/shop`  
**Purpose:** Browse and purchase GEAN products.

### 4.1 Product Listing

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| SHOP.1 | The page displays the title "SHOP". | The heading "SHOP" is visible at the top of the page content area. |
| SHOP.2 | All available products are displayed in a grid layout. | Products are shown in a multi-column grid. Each product card contains: product image, product name, price (with currency), and an "Add to cart" button. |
| SHOP.3 | Clicking a product card or product image navigates to the Product Detail page. | The user is taken to `/product/[product-id]` for the selected product. |
| SHOP.4 | Clicking "Add to cart" on a product card adds that product to the cart. | The cart item count in the navigation increments by 1. User sees a brief confirmation (e.g., button text changes to "Added!" or a toast notification appears). |
| SHOP.5 | If no products are available, an appropriate empty state is shown. | A message such as "No products available at this time." is displayed instead of an empty grid. |

---

## 5. Product Detail Page

**Route:** `/product/[product-id]`  
**Purpose:** Display full information about a single product and allow purchase.

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| PROD.1 | The page displays the full product name and price. | Product name and price (with currency) are visible at the top of the product information. |
| PROD.2 | The page displays one or more product images. | At least one product image is shown. If multiple images exist, the user can view them (e.g., by clicking thumbnails). |
| PROD.3 | The page displays a full product description. | A detailed description of the product is shown, covering its purpose and key benefits. |
| PROD.4 | The page displays the product's key ingredients. | A list of ingredients or key elements is shown on the product page. |
| PROD.5 | The user can add the product to their cart from this page. | An "Add to cart" button is present. Clicking it adds the item to the cart and the cart count updates. |
| PROD.6 | A breadcrumb or back navigation is available. | User can navigate back to the Shop page without using the browser back button (e.g., a "← Back to Shop" link or breadcrumb). |

---

## 6. Cart

**Purpose:** Let the user review items before purchasing.

### 6.1 Cart Behavior

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| CART.1 | The cart is accessible from the navigation bar cart icon on any page. | Clicking the cart icon opens the cart (as a side drawer or dedicated page). |
| CART.2 | The cart displays all items the user has added. | Each cart item shows: product image, product name, quantity, and line price (unit price × quantity). |
| CART.3 | The cart displays the total price of all items. | A "Total" value at the bottom of the cart reflects the sum of all item line prices. |
| CART.4 | The user can change the quantity of any item in the cart. | Quantity controls (increase/decrease or number input) are present on each cart item. The total price updates immediately when quantity changes. |
| CART.5 | The user can remove an item from the cart. | A remove/delete control is present on each cart item. Removing an item updates the cart and total immediately. |
| CART.6 | The cart icon badge reflects the current number of items in the cart. | When the cart is empty, no badge is shown. When items are present, the badge shows the total item count. |
| CART.7 | The cart is preserved if the user navigates between pages. | Adding an item to cart on the Shop page, then navigating to Home, then returning — the cart still contains the same item. |
| CART.8 | If the cart is empty, an empty state message is shown. | Text such as "Your cart is empty." is displayed, with a link or button to go to the Shop. |

---

## 7. Our Story Page

**Route:** `/our-story`  
**Purpose:** Share the GEAN brand origin, philosophy, and commitment.

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| STORY.1 | The page shares the same hero banner as the Home page. | The same full-width hero (image, headline, subtext, "DISCOVER GEAN" button) appears at the top. The button on this page scrolls down to the story content. |
| STORY.2 | The page displays the brand narrative in English. | The full English story text is shown, organized in 4 paragraphs covering: brand philosophy, origin, product integrity, and brand promise. |
| STORY.3 | The page displays the brand narrative in Thai. | The Thai version of the story is shown in full, parallel to or below the English version. |
| STORY.4 | The English and Thai narratives are clearly separated and labeled. | A visual or textual label (e.g., a language tag or section divider) makes it clear which language is which. |
| STORY.5 | A "HOME" navigation shortcut is available within the story page. | A link labeled "HOME" (visible within the story section layout) allows the user to jump back to the top of the page or navigate to the Home page. |

---

## 8. Article Page

**Route:** `/article`  
**Purpose:** Browse GEAN's published articles on skincare, wellness, and lifestyle.

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| ART.1 | The page shares the same hero banner as the Home page. | The same full-width hero appears at the top of the Article page. |
| ART.2 | The page displays the section title "ARTICLE". | The heading "ARTICLE" is visible in the content area below the hero. |
| ART.3 | Published articles are displayed as cards in a grid. | Articles are arranged in a 3-column grid. Each card shows: thumbnail image, article title, and a short excerpt. |
| ART.4 | Clicking an article card opens the full article. | The user is navigated to the Article Detail page for that article (`/article/[article-id]`). |
| ART.5 | If more articles exist than are shown, a way to load more is available. | A "Load more" button or pagination is present when there are more articles than the initial display limit. |
| ART.6 | If no articles are published, an empty state is shown. | A message such as "No articles yet. Check back soon." is displayed. |

---

## 9. Article Detail Page

**Route:** `/article/[article-id]`  
**Purpose:** Read a full article.

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| ARTD.1 | The page displays the full article title. | The article title is shown prominently at the top of the content. |
| ARTD.2 | The page displays the article thumbnail/cover image. | A cover image is shown at the top of the article or inline with the title. |
| ARTD.3 | The page displays the full article body content. | The complete article text is rendered and readable, including any sub-headings and images within the article. |
| ARTD.4 | The page displays the article publish date. | A publication date (e.g., "June 1, 2026") is visible on the page. |
| ARTD.5 | A back navigation link is available. | A link such as "← Back to Articles" allows the user to return to the Article listing page. |

---

## 10. Contact Us Page

**Route:** `/contact`  
**Purpose:** Provide contact channels for customer support.

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| CON.1 | The page shares the same hero banner as the Home page. | The same full-width hero appears at the top. |
| CON.2 | The page displays the section title "HOW CAN WE SUPPORT?". | The heading is visible in the contact section below the hero. |
| CON.3 | Introductory text guides the user to contact channels. | A short paragraph in Thai explains where to reach GEAN (LINE and Instagram). |
| CON.4 | LINE contact information is displayed with an icon. | LINE handle **@gean_officially** is shown with the LINE icon. |
| CON.5 | Instagram contact information is displayed with an icon. | Instagram handle **gean_officially** is shown with the Instagram icon. |
| CON.6 | Clicking a social contact opens the respective platform. | Clicking LINE opens the LINE chat (or the LINE app/web). Clicking Instagram opens the GEAN Instagram profile. Both open in a new browser tab. |
| CON.7 | A QR code is displayed for quick contact. | A QR code image is shown with the label **"SCAN FOR CONTACT US!"** and a short Thai description below it. |
| CON.8 | A "Quick Answers" FAQ section is displayed. | A section titled "Quick Answers" lists common questions and answers as bullet points. Minimum required answers: (1) order delivery timeline: 1–3 business days, (2) return policy, (3) product authenticity guarantee (100% authentic). |

---

## 11. Footer

**Purpose:** Provide persistent secondary navigation and brand information at the bottom of every page.

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FOOT.1 | A footer is present at the bottom of every page. | The footer appears below the main content on all 5 pages. |
| FOOT.2 | The footer displays the GEAN logo or brand name. | The GEAN logo or brand wordmark is shown in the footer. |
| FOOT.3 | The footer contains secondary navigation links. | Links to main pages are present: SHOP, OUR STORY, ARTICLE, CONTACT US. |
| FOOT.4 | The footer displays social media links. | LINE and Instagram links/icons are present. Clicking each opens the respective platform in a new tab. |
| FOOT.5 | The footer displays a copyright notice. | A copyright line (e.g., "© 2026 GEAN. All rights reserved.") is shown. |

---

## 12. Content & Language

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| LANG.1 | Key content is available in both Thai and English. | Hero text, section titles, benefit descriptions, and story content all have both Thai and English versions present on the page simultaneously. |
| LANG.2 | Thai and English content are visually differentiated when shown together. | When both languages appear in the same section, they are laid out so readers can clearly identify which is which (e.g., English above Thai, or labeled). |

---

## Appendix: Page Summary

| Page | Route | Key Features |
|---|---|---|
| Home | `/` | Hero, benefit highlights, featured product, why hand cream, deep-dive benefits, tagline, ingredients |
| Shop | `/shop` | Product grid, add to cart |
| Product Detail | `/product/[id]` | Full product info, images, ingredients, add to cart |
| Our Story | `/our-story` | Hero, bilingual brand narrative |
| Article | `/article` | Hero, article card grid, load more |
| Article Detail | `/article/[id]` | Full article content, date, back link |
| Contact Us | `/contact` | Hero, social contacts, QR code, FAQ |
| Cart | (drawer or `/cart`) | Item list, quantity control, remove, total, checkout entry |
