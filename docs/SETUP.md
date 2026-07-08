# FutureFinance AI - Setup Guide

## Prerequisites

- Docker & Docker Compose 20.10+
- Java 17+ (if running backend locally)
- Node.js 16+ (if running frontend locally)
- Python 3.9+ (if running ML engine locally)
- PostgreSQL 14+ (if running database locally)
- Git

## Quick Start with Docker

### 1. Clone Repository
```bash
git clone https://github.com/nandubodra/FutureFinance-AI.git
cd FutureFinance-AI
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env file with your API keys
```

### 3. Start All Services
```bash
docker-compose up -d
```

Wait for all services to be healthy:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- ML Engine: http://localhost:5000
- Database: localhost:5432

### 4. Verify Services
```bash
curl http://localhost:8080/api/health
curl http://localhost:5000/api/health
```

---

## Local Development Setup

### Database Setup

```bash
# Start PostgreSQL
docker run --name futurefinance_db \
  -e POSTGRES_USER=futurefinance \
  -e POSTGRES_PASSWORD=secure_password_123 \
  -e POSTGRES_DB=futurefinance_db \
  -p 5432:5432 \
  postgres:14-alpine

# Initialize schema
psql -U futurefinance -d futurefinance_db -f database/schema.sql
```

### Backend Setup

```bash
cd backend

# Build
mvn clean install

# Run
mvn spring-boot:run

# Backend available at http://localhost:8080
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend available at http://localhost:3000
```

### ML Engine Setup

```bash
cd ml-engine

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run
python app.py

# ML Engine available at http://localhost:5000
```

---

## API Keys Setup

### OpenAI API

1. Get your API key from https://platform.openai.com/api-keys
2. Add to `.env`:
```
OPENAI_API_KEY=sk-your-key-here
```

### Bank APIs (IDBI)

1. Register at IDBI Developer Portal
2. Get credentials
3. Add to `.env`:
```
IDBI_CLIENT_ID=your_client_id
IDBI_CLIENT_SECRET=your_client_secret
```

---

## Database Migrations

### Using Flyway (Recommended)

```bash
# Place migration files in backend/src/main/resources/db/migration/
# Files should be named: V1__description.sql

# Migrations run automatically on startup
```

### Manual Migration

```bash
psql -U futurefinance -d futurefinance_db -f database/schema.sql
```

---

## Configuration Files

### Backend (application.properties)

```properties
spring.application.name=futurefinance
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/futurefinance_db
spring.datasource.username=futurefinance
spring.datasource.password=secure_password_123

# JWT
jwt.secret=your_secret_key
jwt.expiration=86400

# OpenAI
openai.api.key=sk-your-key-here
openai.model=gpt-4
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ML_URL=http://localhost:5000
REACT_APP_LANGUAGE=en
```

### ML Engine (.env)

```env
FLASK_ENV=development
PORT=5000
```

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
mvn test

# Run specific test
mvn test -Dtest=LoanAnalysisServiceTest

# Run with coverage
mvn clean test jacoco:report
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### ML Engine Tests

```bash
cd ml-engine

# Run tests
python -m pytest

# Run with coverage
python -m pytest --cov=services
```

---

## Building for Production

### Build Backend

```bash
cd backend
mvn clean install -DskipTests
```

### Build Frontend

```bash
cd frontend
npm run build
```

### Build Docker Images

```bash
# Backend
docker build -t futurefinance-backend:1.0.0 ./backend

# Frontend
docker build -t futurefinance-frontend:1.0.0 ./frontend

# ML Engine
docker build -t futurefinance-ml:1.0.0 ./ml-engine
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8080
lsof -i :8080
kill -9 <PID>

# Or change port in configuration
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check credentials in .env
# Verify connection
psql -U futurefinance -d futurefinance_db
```

### Frontend Can't Connect to Backend

```bash
# Check if backend is running
curl http://localhost:8080/api/health

# Check CORS configuration
# Verify API_URL in .env
```

### ML Engine Not Responding

```bash
# Check if service is running
curl http://localhost:5000/api/health

# Check logs
docker logs futurefinance_ml
```

---

## Support

For issues or questions:
- 📧 Email: support@futurefinance-ai.com
- 🐛 GitHub Issues: https://github.com/nandubodra/FutureFinance-AI/issues
- 💬 Discussions: https://github.com/nandubodra/FutureFinance-AI/discussions
