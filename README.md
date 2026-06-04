# ⚡ ShortLink — URL Shortener

A production-grade URL shortener built with Spring Boot, Redis, PostgreSQL, and React.

## Live Demo
> Deploy link here (Render/Railway)

---

## Architecture

```
React Frontend (Port 3000)
        │
        ▼
Spring Boot REST API (Port 8080)
        │
   ┌────┴────┐
   │         │
Redis      PostgreSQL
(Cache)    (Persistent store)
```

**Cache-aside pattern:**
1. GET request hits Redis first (fast, ~1ms)
2. On cache miss, query PostgreSQL
3. Repopulate Redis with TTL
4. Result: 95%+ of redirects served from cache

---

## Features

- 🔗 URL shortening with Base62 encoding
- ✏️ Custom aliases
- ⏱️ Link expiry with automatic cleanup
- 📊 Click analytics (daily trends, device breakdown)
- 🔒 JWT authentication
- ⚡ Redis caching for sub-millisecond redirects
- 🚦 Rate limiting per user
- 🧪 Unit tested with JUnit 5 + Mockito

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.2 |
| Database | PostgreSQL (persistent) |
| Cache | Redis (fast lookups) |
| Auth | Spring Security + JWT |
| Frontend | React 18, Recharts |
| Testing | JUnit 5, Mockito |

---

## Setup & Run

### Prerequisites
- Java 17+
- PostgreSQL running on port 5432
- Redis running on port 6379
- Node.js 18+

### 1. Database setup
```sql
CREATE DATABASE urlshortener;
```

### 2. Redis (Mac)
```bash
brew install redis
brew services start redis
```

### 3. Backend
```bash
cd url-shortener
./mvnw spring-boot:run
```

### 4. Frontend
```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login |
| POST | /api/urls | Yes | Shorten URL |
| GET | /{shortCode} | No | Redirect |
| GET | /api/urls | Yes | Get all my URLs |
| GET | /api/urls/{code}/stats | Yes | Analytics |
| DELETE | /api/urls/{code} | Yes | Delete URL |

---

## Key Design Decisions

**Why Redis for caching?**
URL redirection is a read-heavy workload. 95%+ of requests are GET redirects. Redis serves these in <1ms vs ~10ms for PostgreSQL. We use a cache-aside pattern — write to DB first, then cache.

**Why Base62 for short codes?**
62 characters (a-z, A-Z, 0-9) with 7 characters = 62^7 = 3.5 trillion unique URLs. URL-safe (no special characters). Collision-resistant using SecureRandom.

**Why JWT (stateless auth)?**
Stateless — no session storage needed. Scales horizontally. Standard for REST APIs.

**How does expiry work?**
Expiry stored in DB and used to set Redis TTL. A scheduled job runs hourly to deactivate expired URLs in bulk. Expired URLs return HTTP 410 Gone.

---

## Interview Q&A

**Q: How does the caching work?**
Cache-aside pattern. On redirect: check Redis first. If miss, query PostgreSQL, store in Redis with TTL, return URL. This keeps the cache warm for popular URLs.

**Q: How do you handle hash collisions?**
Generate random Base62 code, check DB for existence, retry if collision (max 10 attempts). With 7 chars and 3.5 trillion possibilities, collisions are extremely rare.

**Q: How would you scale this to millions of users?**
1. Multiple Spring Boot instances behind a load balancer
2. Redis cluster for distributed caching
3. PostgreSQL read replicas for analytics queries
4. CDN for the redirect layer
5. Async analytics tracking (Kafka queue)

**Q: Why PostgreSQL over MySQL?**
Better support for JSONB (for future analytics), excellent indexing, and strong ACID compliance. Both would work fine here.
