# FutureFinance AI - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│                   (React + TypeScript)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Loan Decision Module          • Investment Analyzer    │  │
│  │ • Purchase Decision Module      • Retirement Planner     │  │
│  │ • Goal Planner                  • Financial Health Score │  │
│  │ • What-If Simulator             • Emergency Detector     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┼────────────┐
                 │            │            │
        ┌────────▼────┐  ┌───▼────────┐  │
        │ REST API    │  │ WebSocket  │  │
        │ (Port 8080) │  │ (Port 8080)│  │
        └────────┬────┘  └───┬────────┘  │
                 │            │          │
┌────────────────┴────────────┴──────────┴────────────────────────┐
│                      Backend Layer                              │
│                    (Spring Boot)                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Controllers                                              │  │
│  │ • LoanAnalysisController                                 │  │
│  │ • InvestmentController                                   │  │
│  │ • RetirementController                                   │  │
│  │ • AuthController                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────▼──────────────────────────────┐  │
│  │ Services                                                 │  │
│  │ • LoanAnalysisService      • InvestmentService           │  │
│  │ • RetirementService        • HealthScoreService          │  │
│  │ • UserService              • AnalysisService             │  │
│  └──────────────────────────┬──────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────▼──────────────────────────────┐  │
│  │ Repositories (JPA)                                       │  │
│  │ • UserRepository           • AnalysisResultRepository    │  │
│  │ • FinancialDataRepository  • GoalRepository              │  │
│  └──────────────────────────┬──────────────────────────────┘  │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐   ┌─────────▼──────────┐  ┌─────┐ │
│   PostgreSQL   │   │   ML Engine (Flask)   │  │Redis│ │
│   Database     │   │   (Port 5000)         │  └─────┘ │
│  (Port 5432)   │   │                       │          │
└────────────────┘   │ • LoanPredictor       │          │
                     │ • InvestmentAnalyzer  │          │
                     │ • RetirementCalculator│          │
                     │ • CashFlowAnalyzer    │          │
                     └───────────────────────┘          │
                                                        │
                        External APIs                  │
                    ┌───────────────────────┬──────────┘
                    │                       │
            ┌───────▼─────┐        ┌───────▼──────┐
            │ OpenAI GPT-4│        │ Bank APIs    │
            │ (Insights)  │        │ (IDBI)       │
            └─────────────┘        └──────────────┘
```

## Component Details

### Frontend (React + TypeScript)
- **Vite** for fast development
- **Zustand** for state management
- **React Router** for navigation
- **i18next** for bilingual support (English/Hindi)
- **Chart.js** & **D3.js** for visualizations
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend (Spring Boot)
- **Spring Web** for REST APIs
- **Spring Data JPA** for database access
- **Spring Security** for authentication/authorization
- **JWT** for token-based auth
- **Lombok** for reducing boilerplate
- **PostgreSQL** for data persistence

### ML Engine (Python/Flask)
- **NumPy** & **Pandas** for data processing
- **Scikit-learn** for ML models
- **Flask** for REST endpoints
- **Gunicorn** for production deployment

### Database (PostgreSQL)
- **Users** - User account information
- **FinancialData** - User financial metrics
- **AnalysisResults** - Cached analysis results
- **Loans** - Loan information
- **Goals** - Financial goals
- **HealthScoreHistory** - Score trends
- **AuditLogs** - Compliance logs

## Data Flow

### Loan Analysis Flow
```
1. User fills loan details in frontend
2. Frontend calls POST /api/analysis/loan/analyze
3. Backend validates input
4. Backend calls ML Engine /api/predict/loan
5. ML Engine calculates EMI, risk, max loan
6. Backend saves result to database
7. Backend returns analysis to frontend
8. Frontend displays visualization
```

### What-If Simulator Flow
```
1. User adjusts sliders (salary, loan, investment)
2. Frontend sends WebSocket message to backend
3. Backend calls ML Engine with new parameters
4. ML Engine returns predictions
5. Backend broadcasts update via WebSocket
6. Frontend updates charts in real-time
```

## Security Architecture

### Authentication
- JWT tokens with 24-hour expiration
- Refresh tokens for extended sessions
- OAuth 2.0 integration for social login

### Authorization
- Role-based access control (RBAC)
- Users can only access their own data
- Admin panel for support staff

### Data Protection
- All passwords hashed with bcrypt
- TLS/SSL for encrypted communication
- Data encrypted at rest
- PII data masked in logs

### API Security
- Rate limiting (100 req/min per user)
- Input validation on all endpoints
- CORS enabled only for trusted origins
- SQL injection prevention via parameterized queries
- CSRF tokens for state-changing operations

## Deployment Architecture

### Docker Compose Setup
```yaml
Services:
- PostgreSQL (5432)
- Spring Boot Backend (8080)
- Python ML Engine (5000)
- React Frontend (3000)
- Redis Cache (6379)
```

### Production Deployment
```
Load Balancer (Nginx)
    ├── Frontend Container (Nginx)
    ├── Backend Container (Gunicorn)
    ├── ML Engine Container (Gunicorn)
    └── Database (Managed RDS)

Cache Layer: Redis
Queue: RabbitMQ (for async tasks)
Monitoring: Prometheus + Grafana
Logging: ELK Stack
```

## Scalability Considerations

### Horizontal Scaling
- Stateless backend services
- Redis for distributed caching
- Database read replicas
- Message queue for async processing

### Performance Optimizations
- Query result caching (Redis)
- Database indexing on frequently queried columns
- Connection pooling (HikariCP)
- Lazy loading of related entities
- API response pagination

## Error Handling Strategy

### Validation
- Input validation at controller level
- Business logic validation at service level
- Database constraint validation

### Exception Handling
- Global exception handler
- Custom exception classes
- Detailed error messages in dev, generic in prod
- Error logging with stack traces

## Monitoring & Logging

### Metrics
- API response times
- ML prediction latency
- Database query performance
- Cache hit/miss ratio
- User session statistics

### Logging
- Structured logging (JSON format)
- Log levels: DEBUG, INFO, WARN, ERROR
- Request/response logging with unique request IDs
- Audit trail for compliance

## Disaster Recovery

### Backup Strategy
- Daily database backups
- Point-in-time recovery capability
- Backup retention: 30 days
- Automated backup testing

### High Availability
- Database replication
- Load balancing across instances
- Automatic failover
- Health checks every 5 seconds
