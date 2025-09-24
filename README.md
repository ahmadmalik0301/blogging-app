# 📝 Blogging Platform Backend

A backend API for a blogging platform built with **NestJS**, featuring authentication, role-based access control, post liking, real-time notifications, and email queuing.

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
    - **User** → View posts, like posts

- **Post Liking System**
  - Users can **like or unlike posts**
  - Each like is tracked in the database
  - Prevents duplicate likes from the same user
  - When a post is liked, a **notification is stored in the database** for the admin

- **Email Notifications**
  - Whenever a new user signs up, the **Admin receives an email**
  - Handled using **BullMQ** and **Redis queues**

- **Real-time Notifications**
  - Implemented with **WebSockets (Socket.IO)**
  - Admin receives instant notifications for:
    - New user signups
    - Post likes from users
  - Notifications are also **persisted in the database** for later viewing

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

# 3. Run database migrations
npm run migration:run

# 4. Start the development server
npm run start:dev

```
