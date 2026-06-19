# LUXÉ — Premium E-Commerce Website & Admin Command Center

LUXÉ is a high-end, responsive, static e-commerce website designed with a dark glassmorphic design system. The application coordinates real-time user experiences, order processing, catalog inventory CRUD operations, and analytical tracking purely client-side via a unified `localStorage` state machine.

---

## 🌟 Key Features

### 1. Storefront Showcase (`index.html`)
- **Dynamic Catalog**: Renders products dynamically from the central `localStorage` inventory database.
- **Product Filters**: Real-time category-based filtering with smooth transition effects.
- **Interactive Wishlist**: Instantly saves/removes items to/from user favorites.
- **Cart Interactions**: Fast add-to-cart operations with custom micro-interactive toast feedback.

### 2. Customer Dashboard (`dashboard.html`)
- **Overview Panel**: Displays loyalty metrics, current delivery tracking status, and recent activity.
- **Order History**: Expandable receipt blocks displaying items purchased, payment details, addresses, and live shipping milestones.
- **Wishlist Manager**: View, add to cart, or remove favorited items.
- **Profile Coordinates**: Form to update client settings (Name, Email, Phone, Address), immediately synchronizing across the app.

### 3. Merchant Admin Panel (`admin.html`)
- **Access Guard Screen**: A glassmorphic lock screen blocking unauthorized access. Correct admin portal credentials:
  - **Username**: `admin`
  - **Password**: `admin`
- **Dynamic Analytics**: Live metrics (Total Revenue, Total Orders, AOV), dynamic SVG sales progression charts, product category breakdowns, and low stock warnings.
- **Catalog Management (CRUD)**: Create, Read, Update, and Delete products. Edits instantly populate on the home page storefront.
- **Orders Manager**: Modifies customer order statuses (Processing, In Transit, Delivered, Cancelled), updating the client's dashboard tracker in real-time.
- **User Directory**: Lists active clients and summarizes total lifetime transactions and spends.

---

## 📁 File Structure

```
Test_Website/
├── index.html       # Storefront homepage & navbar dropdown menu
├── dashboard.html   # Customer personal panel layout
├── admin.html       # Merchant portal lock screen and analytical sheets
├── styles.css       # Unified design token system & layout styles
└── script.js        # Core state controller, event handlers, and data layer
```

---

## ⚙️ Core Architecture & State Management

The frontend uses five synchronized structures serialized inside `localStorage`:

1. `luxe_products`: Catalog records shown on the storefront and managed in the admin dashboard.
2. `luxe_orders`: Store transactions tracking order numbers, dates, pricing, totals, and logistics status.
3. `luxe_wishlist`: Customer favorite product IDs.
4. `luxe_profile`: Active customer settings (Mock Name: "Alex Mercer", Email, Phone, Shipping Address).
5. `luxe_auth`: Client admin authentication role (`'user'` or `'admin'`).

---

## 🚀 Running the Project

1. Since the application is built entirely as a static client-side codebase, you do not need local servers or build configurations.
2. Simply double-click **`index.html`** or open it directly in any modern web browser to begin.
3. Navigate to the Customer Dashboard or Merchant Portal via the user dropdown menu in the header.