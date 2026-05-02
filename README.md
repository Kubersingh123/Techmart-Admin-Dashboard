# TechMart Admin Dashboard - E-Commerce Admin & Order Management System

TechMart Admin Dashboard is a full-stack MERN project for managing an electronics e-commerce business. It includes admin authentication, product and category CRUD, inventory tracking, order processing, simulated payments, customer records, and reports.

## Tech Stack

- Frontend: React.js, Bootstrap, Recharts, Axios, React Router
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT with bcrypt password hashing
- Third-party API: Fake Store API product import
- Deployment targets: Netlify/Vercel for frontend, Render/Railway for backend

## Features

- Admin register, login and logout
- Protected dashboard routes using JWT
- Dashboard cards for products, orders, revenue, pending orders, delivered orders and low stock
- Product CRUD with search, category filter and status filter
- Category CRUD with duplicate-name protection
- Inventory page with low-stock alerts and manual stock updates
- Order creation with stock validation and automatic stock reduction
- Order status lifecycle: Pending -> Processing -> Shipped -> Delivered
- Payment simulation with Pending, Paid, Failed and Refunded statuses
- Customer list and customer order history
- Reports for total sales, monthly revenue, best-selling products, order status summary and stock health
- Product import from Fake Store API
- Responsive admin dashboard UI

## Folder Structure

```text
techmart-admin-dashboard/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    server.js
    seed.js
    package.json
    .env.example
  frontend/
    src/
      components/
      context/
      pages/
      services/
      App.jsx
      main.jsx
      styles.css
    package.json
    .env.example
```

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Update `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/techmart_admin
JWT_SECRET=replace_with_a_long_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
LOW_STOCK_THRESHOLD=5
```

Seed login:

```text
Email: admin@techmart.com
Password: admin123
```

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Update `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Open the frontend at `http://localhost:5173`.

## API Routes

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/import`

### Categories

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Orders

- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders`
- `PUT /api/orders/:id/status`
- `PUT /api/orders/:id/payment`

### Customers

- `GET /api/customers`
- `GET /api/customers/:id`

### Reports

- `GET /api/reports/dashboard`
- `GET /api/reports/sales`
- `GET /api/reports/inventory`

## Testing With Postman or Thunder Client

1. Register or login an admin.
2. Copy the returned token.
3. Add this header to protected requests:

```text
Authorization: Bearer YOUR_TOKEN
```

Recommended checks:

- Invalid login returns `401`.
- Duplicate category returns `409`.
- Creating an order with higher quantity than stock returns `400`.
- Invalid order status transition returns `400`.
- Product import saves products and categories from Fake Store API.

## Deployment

### Backend on Render or Railway

1. Create a MongoDB Atlas database.
2. Add environment variables from `backend/.env.example`.
3. Set build command: `npm install`.
4. Set start command: `npm start`.
5. Add the deployed frontend URL as `CLIENT_URL`.

### Frontend on Netlify or Vercel

1. Set `VITE_API_URL` to the deployed backend API URL, for example `https://your-api.onrender.com/api`.
2. Build command: `npm run build`.
3. Publish directory: `dist`.

## Screenshots

Add screenshots here after running the project:

- Login Page
- Dashboard Home
- Products Page
- Orders Page
- Reports Page
