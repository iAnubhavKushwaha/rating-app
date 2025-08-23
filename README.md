# Store Rating Web App

A full-stack web application to rate and manage stores with role-based access. Built with **React**, **Express.js**, **Prisma**, and **PostgreSQL (Neon DB)**.

---

## Features

### User Roles
- **Admin**
  - Add stores and users
  - View dashboard statistics
- **Normal User**
  - Browse and search stores
  - Rate stores (1–5 stars) and update ratings
- **Store Owner**
  - View who rated their stores
  - See average ratings

### Functionalities
- Dynamic ratings with live UI updates
- Sorting and filtering of stores
- Validations:  
  - Name: 20–60 characters  
  - Address: ≤400 characters  
  - Password: 8–16 characters (uppercase + special)  
  - Valid email format
- Unique rating per user per store

---

## Tech Stack
- **Frontend:** React, Tailwind CSS  
- **Backend:** Express.js (ESM), JWT-based authentication  
- **Database:** PostgreSQL hosted on Neon DB  
- **ORM:** Prisma (type-safe database queries)

---

## Database Structure
- **User:** Stores user info and roles  
- **Store:** Stores store details  
- **Rating:** Links users and stores, stores 1–5 star ratings  
- Unique constraint: `(userId, storeId)` ensures one rating per user per store  

---

## Installation

1. Clone the repository:  
```bash
git clone <repo-url>
```

2. Install backend dependencies:  
```bash
cd backend
npm install
```

3. Install frontend dependencies:  
```bash
cd frontend
npm install
```

4. Configure `.env` with Neon DB credentials and JWT secret.

5. Run Prisma migrations:  
```bash
npx prisma migrate dev
```

6. Start backend:  
```bash
npm run dev
```

7. Start frontend:  
```bash
npm run dev
```

---

## Usage
- Admins can log in to manage stores and users.  
- Normal users can browse and rate stores.  
- Store owners can view ratings and averages.  

---

## License
MIT License
