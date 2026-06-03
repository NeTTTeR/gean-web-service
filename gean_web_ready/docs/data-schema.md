# GEAN — Local Storage Data Schema

**Version:** 1.0  
**Scope:** Data entities stored in the browser's `localStorage` to support the GEAN website requirements.

---

## Table of Contents

1. [Storage Strategy Overview](#1-storage-strategy-overview)
2. [Storage Key Registry](#2-storage-key-registry)
3. [Entity: Cart](#3-entity-cart)
4. [Entity: Product Catalog Cache](#4-entity-product-catalog-cache)
5. [Entity: Article List Cache](#5-entity-article-list-cache)
6. [Shared Sub-types](#6-shared-sub-types)
7. [Validation Rules](#7-validation-rules)
8. [Serialization & Deserialization](#8-serialization--deserialization)
9. [Data Relationships](#9-data-relationships)
10. [Storage Size Estimates](#10-storage-size-estimates)

---

## 1. Storage Strategy Overview

`localStorage` stores only string values. All data objects are serialized via `JSON.stringify()` before writing and deserialized via `JSON.parse()` after reading.

**Design principles:**
- Each top-level entity uses its own `localStorage` key — one key per concern
- Cached data (products, articles) includes a `cachedAt` timestamp so the app can decide when to refresh
- Cart data has no expiry — it persists until the user clears it or completes a purchase
- All IDs are strings (UUIDs or slugs) to avoid type coercion issues after JSON round-trips
- Currency amounts are stored as integers in the smallest unit (satang for THB, e.g. ฿120.00 → `12000`) to avoid floating-point errors

---

## 2. Storage Key Registry

All `localStorage` keys used by the GEAN website are prefixed with `gean_` to avoid collisions with other scripts or libraries.

| Key | Entity | Description |
|---|---|---|
| `gean_cart` | Cart | The user's current shopping cart |
| `gean_products` | ProductCatalog | Cached list of all products |
| `gean_articles` | ArticleList | Cached list of article summaries |

---

## 3. Entity: Cart

**Key:** `gean_cart`  
**Persistence:** Indefinite — survives page navigation and browser restarts (requirement CART.7). Cleared only when a purchase is completed or the user empties the cart.

### 3.1 Cart Schema

```
Cart {
  items:     CartItem[]   // List of items in the cart (empty array if cart is empty)
  updatedAt: string       // ISO 8601 timestamp of the last change
}
```

### 3.2 CartItem Schema

```
CartItem {
  productId:  string   // References Product.id
  quantity:   number   // Positive integer, minimum 1
  addedAt:    string   // ISO 8601 timestamp of when item was first added
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `productId` | string | Yes | Must match an existing Product ID; non-empty |
| `quantity` | number | Yes | Integer ≥ 1; maximum 99 per line item |
| `addedAt` | string | Yes | Valid ISO 8601 datetime string |

### 3.3 Cart Business Rules

- **One line per product:** There is at most one `CartItem` per `productId`. Adding the same product again increments `quantity` on the existing item.
- **Quantity ceiling:** `quantity` must not exceed 99. Attempting to increase beyond 99 keeps it at 99.
- **Remove to zero:** When `quantity` reaches 0 (user decrements), the `CartItem` is deleted from the `items` array entirely.
- **Total price calculation:** Total is computed at read time — never stored — by joining `CartItem.productId` against the product catalog to retrieve the unit price.

### 3.4 Derived Values (not stored)

| Value | Derivation |
|---|---|
| Cart item count (badge) | `cart.items.reduce((sum, i) => sum + i.quantity, 0)` |
| Line price | `product.priceSatang × item.quantity` |
| Cart total | Sum of all line prices |

### 3.5 Example

```json
{
  "items": [
    {
      "productId": "gean-hand-cream-50ml",
      "quantity": 2,
      "addedAt": "2026-06-01T10:30:00.000Z"
    },
    {
      "productId": "gean-hand-cream-100ml",
      "quantity": 1,
      "addedAt": "2026-06-01T10:45:00.000Z"
    }
  ],
  "updatedAt": "2026-06-01T10:45:00.000Z"
}
```

---

## 4. Entity: Product Catalog Cache

**Key:** `gean_products`  
**Persistence:** Cached with a TTL. The app refreshes the cache if `cachedAt` is older than 1 hour.

### 4.1 ProductCatalog Schema

```
ProductCatalog {
  items:     Product[]   // All available products
  cachedAt:  string      // ISO 8601 timestamp of when this data was last fetched/set
}
```

### 4.2 Product Schema

```
Product {
  id:              string        // Unique identifier / URL slug (e.g. "gean-hand-cream-50ml")
  nameEn:          string        // Product name in English
  nameTh:          string        // Product name in Thai
  priceSatang:     number        // Price in smallest currency unit (satang); e.g. ฿120.00 = 12000
  currency:        string        // ISO 4217 currency code; "THB"
  descriptionEn:   string        // Full product description in English
  descriptionTh:   string        // Full product description in Thai
  images:          string[]      // Ordered list of image URLs; first item is the primary image
  ingredients:     Ingredient[]  // List of key ingredients shown on the product detail page
  inStock:         boolean       // Whether the product is available for purchase
  createdAt:       string        // ISO 8601 date string (for ordering)
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `id` | string | Yes | Unique, URL-safe slug; non-empty |
| `nameEn` | string | Yes | Non-empty |
| `nameTh` | string | Yes | Non-empty |
| `priceSatang` | number | Yes | Integer ≥ 0 |
| `currency` | string | Yes | Always `"THB"` in this version |
| `descriptionEn` | string | Yes | Non-empty |
| `descriptionTh` | string | Yes | Non-empty |
| `images` | string[] | Yes | At least 1 URL; all items must be non-empty strings |
| `ingredients` | Ingredient[] | Yes | At least 1 item |
| `inStock` | boolean | Yes | — |
| `createdAt` | string | Yes | Valid ISO 8601 date string |

### 4.3 Example

```json
{
  "cachedAt": "2026-06-01T09:00:00.000Z",
  "items": [
    {
      "id": "gean-hand-cream-50ml",
      "nameEn": "GEAN Hand Cream 50ml",
      "nameTh": "เจียน แฮนด์ ครีม 50 มล.",
      "priceSatang": 39000,
      "currency": "THB",
      "descriptionEn": "A lightweight, fast-absorbing hand cream designed for the modern workspace. Zero greasiness, with a focused scent to elevate your daily rituals.",
      "descriptionTh": "ครีมทามือสูตรเบา ซึมซับเร็ว ออกแบบมาเพื่อคนทำงานยุคใหม่ ไม่เหนียว กลิ่นหอมช่วยเพิ่มสมาธิในชีวิตประจำวัน",
      "images": [
        "/images/products/hand-cream-50ml-front.jpg",
        "/images/products/hand-cream-50ml-side.jpg"
      ],
      "ingredients": [
        { "nameEn": "95% Squalane Extract", "nameTh": "สควาเลน สกัด 95%", "descriptionEn": "Deep moisturisation without greasiness." },
        { "nameEn": "Ceramide Complex", "nameTh": "เซราไมด์ คอมเพล็กซ์", "descriptionEn": "Strengthens the skin barrier." }
      ],
      "inStock": true,
      "createdAt": "2026-01-15"
    }
  ]
}
```

---

## 5. Entity: Article List Cache

**Key:** `gean_articles`  
**Persistence:** Cached with a TTL. The app refreshes the cache if `cachedAt` is older than 1 hour.

### 5.1 ArticleList Schema

```
ArticleList {
  items:     ArticleSummary[]   // Ordered list of article summaries (newest first)
  cachedAt:  string             // ISO 8601 timestamp of when this data was last fetched/set
}
```

### 5.2 ArticleSummary Schema

Article summaries are lightweight objects used for the Article listing page (ART.3). Full article body content is not stored in this list — it is stored separately per article if needed (see §5.4).

```
ArticleSummary {
  id:            string   // Unique identifier / URL slug (e.g. "why-hand-cream-matters")
  titleEn:       string   // Article title in English
  titleTh:       string   // Article title in Thai
  excerptEn:     string   // Short excerpt in English (max 200 characters)
  excerptTh:     string   // Short excerpt in Thai (max 200 characters)
  thumbnailUrl:  string   // URL of the cover/thumbnail image
  publishedAt:   string   // ISO 8601 date string (e.g. "2026-05-20")
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `id` | string | Yes | Unique, URL-safe slug; non-empty |
| `titleEn` | string | Yes | Non-empty |
| `titleTh` | string | Yes | Non-empty |
| `excerptEn` | string | Yes | Non-empty; ≤ 200 characters |
| `excerptTh` | string | Yes | Non-empty; ≤ 200 characters |
| `thumbnailUrl` | string | Yes | Non-empty URL string |
| `publishedAt` | string | Yes | Valid ISO 8601 date string (date only) |

### 5.3 Example

```json
{
  "cachedAt": "2026-06-01T09:00:00.000Z",
  "items": [
    {
      "id": "why-hand-cream-matters",
      "titleEn": "Why Hand Cream Is the Office Essential You're Missing",
      "titleTh": "ทำไมครีมทามือถึงเป็นของจำเป็นในออฟฟิศที่คุณขาดไม่ได้",
      "excerptEn": "Discover how a simple hand cream ritual can transform your workday — from dry, tired hands to smooth, confident ones.",
      "excerptTh": "ค้นพบว่าครีมทามือง่ายๆ สามารถเปลี่ยนวันทำงานของคุณได้อย่างไร",
      "thumbnailUrl": "/images/articles/hand-cream-office.jpg",
      "publishedAt": "2026-05-20"
    }
  ]
}
```

### 5.4 Article Detail (Optional Cache)

Full article body content can be cached per-article using a dynamic key pattern. This avoids loading all article bodies upfront.

**Key pattern:** `gean_article_[id]`  
**Example key:** `gean_article_why-hand-cream-matters`

```
ArticleDetail {
  id:          string   // Matches ArticleSummary.id
  titleEn:     string
  titleTh:     string
  bodyEn:      string   // Full article body in English (plain text or HTML string)
  bodyTh:      string   // Full article body in Thai
  thumbnailUrl: string
  publishedAt:  string  // ISO 8601 date string
  cachedAt:     string  // ISO 8601 timestamp
}
```

---

## 6. Shared Sub-types

### 6.1 Ingredient

Used inside `Product.ingredients`.

```
Ingredient {
  nameEn:        string   // Ingredient name in English (e.g. "Ceramide Complex")
  nameTh:        string   // Ingredient name in Thai
  descriptionEn: string   // One-line benefit description in English
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `nameEn` | string | Yes | Non-empty |
| `nameTh` | string | Yes | Non-empty |
| `descriptionEn` | string | Yes | Non-empty |

---

## 7. Validation Rules

These rules must be enforced whenever data is read from or written to `localStorage`.

### On Write

| Rule | Description |
|---|---|
| **Schema validation** | Before saving, verify that the object conforms to the expected schema. Reject writes that violate required fields or type constraints. |
| **CartItem.quantity ≥ 1** | Never write a CartItem with quantity < 1. Remove the item instead. |
| **CartItem.quantity ≤ 99** | Clamp to 99 if the user tries to add more. |
| **Unique productId per cart** | Merge rather than duplicate: if `productId` already exists in `cart.items`, increment quantity instead of adding a new entry. |
| **No negative prices** | `priceSatang` must be ≥ 0. |

### On Read

| Rule | Description |
|---|---|
| **Parse failure handling** | Wrap all `JSON.parse()` calls in try/catch. On failure, treat the value as absent and fall back to the default empty state (e.g. empty cart). |
| **Missing key handling** | If a `localStorage` key is absent, return the default empty state — do not throw an error. |
| **Cache TTL check** | For `gean_products` and `gean_articles`, check `cachedAt`. If `Date.now() - Date.parse(cachedAt) > 3600000` (1 hour), treat cache as stale and re-fetch. |
| **Stale article detail** | For `gean_article_[id]`, apply the same 1-hour TTL as the article list. |

### Default Empty States

| Entity | Default |
|---|---|
| Cart | `{ "items": [], "updatedAt": "<now>" }` |
| ProductCatalog | `{ "items": [], "cachedAt": null }` |
| ArticleList | `{ "items": [], "cachedAt": null }` |

---

## 8. Serialization & Deserialization

Since `localStorage` only stores strings, all entities must be serialized before writing and deserialized after reading.

### Write Pattern

```js
function saveCart(cart) {
  localStorage.setItem('gean_cart', JSON.stringify(cart));
}
```

### Read Pattern

```js
function loadCart() {
  try {
    const raw = localStorage.getItem('gean_cart');
    if (!raw) return defaultCart();
    return JSON.parse(raw);
  } catch {
    return defaultCart();
  }
}
```

### Data Type Notes After JSON Round-trip

| Stored As | Read Back As | Note |
|---|---|---|
| `number` (priceSatang) | `number` | Safe — no precision loss for integers |
| `string` (ISO date) | `string` | Always re-parse with `new Date(str)` when computing |
| `boolean` (inStock) | `boolean` | Safe |
| `string[]` (images) | `string[]` | Safe |
| `null` (cachedAt when absent) | `null` | Safe — JSON supports null |

---

## 9. Data Relationships

```
Cart
  └── items: CartItem[]
        └── productId ──────────────────► Product.id
                                          (resolved at read time from gean_products cache)

ArticleList
  └── items: ArticleSummary[]
        └── id ─────────────────────────► ArticleDetail.id
                                          (loaded on-demand into gean_article_[id])
```

- The cart does **not** embed full product data. It stores only `productId` and resolves product details (name, price, image) from the product cache at display time.
- If the product cache is stale or missing when the cart is rendered, the app must refresh `gean_products` before displaying cart totals and line items.

---

## 10. Storage Size Estimates

`localStorage` has a typical browser limit of **5 MB** per origin.

| Key | Estimated Size | Notes |
|---|---|---|
| `gean_cart` | < 1 KB | A cart with 10 items is ~500 bytes |
| `gean_products` | < 50 KB | Assumes ≤ 20 products with full descriptions and up to 5 image URLs each |
| `gean_articles` | < 30 KB | Assumes ≤ 50 article summaries (no body text) |
| `gean_article_[id]` (each) | < 10 KB | Per article with full bilingual body |

**Total estimated usage: well under 1 MB** — comfortably within the 5 MB limit even at full scale.

> If product images or article bodies grow large, store only image URLs (not base64-encoded images) and keep article bodies as plain text rather than embedded HTML with inline styles.
