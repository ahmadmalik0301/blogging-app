# 📝 Blogging Platform Backend

A backend API for a blogging platform built with **NestJS**, featuring authentication, role-based access control, real-time notifications, and email queuing.

---

## 🚀 Features

- **Authentication**
  - Local signup & login
  - Google OAuth signup
  - Access & Refresh tokens (JWT)
  - Refresh token stored in **HTTP-only cookies**

- **Authorization**
  - Role-based access:
    - **Admin** → Create, update, delete posts
    - **User** → View posts only

- **Email Notifications**
  - Whenever a new user signs up, the **Admin receives an email**
  - Handled using **BullMQ** and **Redis queues**

- **Real-time Notifications**
  - Implemented with **WebSockets (Socket.IO)**
  - Admin is notified instantly on new user signup

- **Database & Queues**
  - **PostgreSQL** (via Docker) for persistent storage
  - **Redis** (via Docker) for job queues & caching

---

## 🛠️ Tech Stack

- [NestJS](https://nestjs.com/) — Backend framework
- [PostgreSQL](https://www.postgresql.org/) — Database
- [Redis](https://redis.io/) — Queue & cache
- [BullMQ](https://docs.bullmq.io/) — Background jobs (email sending)
- [Docker](https://www.docker.com/) — Containerization
- [Socket.IO](https://socket.io/) — Real-time notifications
- [JWT](https://jwt.io/) — Authentication & authorization

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (>= 18.x)
- Docker & Docker Compose

### Steps

### 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start required services (PostgreSQL & Redis) with Docker
docker compose up -d

# 3. Create a .env file in the project root and add the following:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb?schema=public
JWT_SECRET=xxxxxx
ADMIN_EMAIL=xxxxxx
ADMIN_PASS=xxxxxx
SENDER_EMAIL=xxxxxx
SGMAIL_AUTH=xxxxxx
GOOGLE_CLIENT_ID=xxxxxx
GOOGLE_CLIENT_SECRET=xxxxxx
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/redirect

# 4. Start the development server
npm run start:dev

# 5. Visit Swagger API docs
http://localhost:3000/api/docs

# 6. (Optional) Start the React Frontend
cd frontend
npm install
npm start

# Frontend will be available at:
http://localhost:3000
```
