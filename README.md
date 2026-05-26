# Decentralized Voting API (NestJS Backend)

A secure, real-time NestJS backend for the Decentralized Blockchain-Based Online Voting System. It manages user registration, EPIC verification against pre-authorized national databases, candidate listings, blockchain simulated vote recording (SHA-256 chains), and real-time updates via WebSockets.

---

## 🚀 Features

- **Authentication Module (`/api/auth`)**: Registration and login using EPIC card numbers, passwords, and Aadhaar verification.
- **Admin Module (`/api/admin`)**: Managed access to voter registration approvals, Aadhaar database imports, and candidate listings.
- **Vote Module (`/api/vote`)**: Casting encrypted votes, recording ledger blocks with SHA-256 hash chaining, blockchain audits, and results aggregation.
- **Real-Time Gateway**: Socket.io Server integration for pushing live statistics and voter transaction notifications to active dashboards.

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: NestJS (v11) with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Real-Time**: Socket.io (`@nestjs/websockets` and `@nestjs/platform-socket.io`)
- **API Docs**: Swagger UI (`/api/docs`)
- **Cryptography**: Node.js `crypto` for computing ledger SHA-256 block chains

---

## ⚙️ Configuration & Environment Variables

Create a `.env` file in the root directory to customize the environment:

```env
PORT=5249
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=onlineVotingSysDB
```

*Note: TypeORM is configured with `synchronize: true` for development ease.*

---

## 🏃 Run Locally

### 1. Database Setup
1. Ensure **PostgreSQL** is running locally on port `5432`.
2. Create a database named `onlineVotingSysDB`.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
# Development (with watch mode)
npm run start:dev

# Production build and run
npm run build
npm run start:prod
```
The server starts on `http://localhost:5249` with the `/api` prefix.

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end (E2E) tests
npm run test:e2e

# Test coverage
npm run test:cov
```
