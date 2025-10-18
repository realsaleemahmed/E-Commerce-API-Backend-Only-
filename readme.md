# E-commerce Backend API 🛍️🛒

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is a RESTful API built with **Node.js**, **Express**, and **MongoDB** for a multi-seller e-commerce platform. It provides a robust foundation including user authentication, product management, order processing, product reviews, and a shopping cart.

**View the Code:** [https://github.com/realsaleemahmed/E-commerce-Backend-API](https://github.com/realsaleemahmed/E-commerce-Backend-API)

---

## ✨ Features Implemented

* **🔐 User Authentication & Authorization:**
    * JWT-based authentication (Register, Login).
    * Password hashing using `bcryptjs`.
    * Role-based access control (Customer, Seller, Admin) via middleware.
* **📦 Product Management (CRUD):**
    * Sellers/Admins can create, read, update, and delete products.
    * Public access to view all products (paginated) and single products.
    * Stores title, description, price, category, stock, images (URLs), and `sellerId`.
* **🛒 Shopping Cart:**
    * Authenticated users can add items, update quantities, view their cart, remove items, and clear the cart.
    * Handles stock checking when adding/updating items.
    * Populates product details in the cart response.
* **🧾 Order Management:**
    * Customers can create orders from cart items.
    * **Secure backend price calculation**.
    * Customers can view their own order history.
    * Customers and Admins can view specific orders (with permission checks).
    * Admins can update order status to 'Paid' (`paidAt` timestamp) and 'Delivered' (`deliveredAt` timestamp).
* **⭐ Product Reviews (CRUD):**
    * Authenticated users can post reviews (one per user per product).
    * Users can update or delete their own reviews (Admins can delete any).
    * Product's average rating and review count are automatically updated.

---

## 🧭 API Endpoints Overview

All endpoints are prefixed with `/api`.

### Authentication (`/auth`)

* `POST /register`
* `POST /login`

### Products (`/products`)

* `GET /` (Public, Paginated)
* `POST /` (Seller/Admin)
* `GET /:id` (Public)
* `PUT /:id` (Owner/Admin)
* `DELETE /:id` (Owner/Admin)

### Reviews (Nested under `/products/:id/reviews`)

* `POST /` (Customer)
* `GET /` (Public)
* `PUT /:reviewId` (Author/Admin)
* `DELETE /:reviewId` (Author/Admin)

### Orders (`/orders`)

* `POST /` (Customer)
* `GET /myorders` (Customer)
* `GET /:id` (Owner/Admin)
* `PUT /:id/pay` (Admin)
* `PUT /:id/deliver` (Admin)

### Cart (`/cart`)

* `GET /` (Customer)
* `POST /` (Customer - Add/Update item)
* `DELETE /items/:productId` (Customer - Remove item)
* `DELETE /` (Customer - Clear cart)

---

## 💻 Technologies Used

* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Middleware:** Custom middleware for auth & roles
* **Environment Variables:** dotenv

---

## ⚙️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/realsaleemahmed/E-commerce-Backend-API.git](https://github.com/realsaleemahmed/E-commerce-Backend-API.git)
    cd E-commerce-Backend-API
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the root directory and add the following:
    ```env
    PORT=4000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_super_secret_jwt_key>
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    *(Requires `nodemon` installed globally or as a dev dependency, defined in `package.json`)*

---

## 📝 Future Features / To-Do

This API provides a solid core. Potential future enhancements:

* **💳 Payment Gateway Integration:** (e.g., Stripe, PayPal)
* **🖼️ Image Uploads:** (e.g., Cloudinary for user avatars and product images)
* **🔍 Advanced Product Queries:** (Searching, Filtering, Sorting)
* **📊 Admin/Seller Dashboards:** (Dedicated management endpoints)
* **🔑 Forgot/Reset Password:** (Email-based password recovery)
* **📉 Stock Management:** (Auto-decrement stock on successful order)

---

## 📧 Contact & Discussion

For questions, discussions, or contributions, please contact Saleem Ahmed at [saleemkhanx001@gmail.com](mailto:saleemkhanx001@gmail.com).