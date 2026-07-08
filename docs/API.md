# FutureFinance AI - API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer <jwt_token>
```

---

## Loan Decision AI

### Analyze Loan
**POST** `/analysis/loan/analyze`

Request Body:
```json
{
  "monthly_salary": 70000,
  "monthly_expenses": 30000,
  "current_savings": 500000,
  "existing_emi": 8000,
  "credit_score": 750,
  "loan_amount": 1000000,
  "tenure_years": 5
}
```

Response:
```json
{
  "emi_amount": 21812.50,
  "emi_percentage": 31.16,
  "max_safe_loan": 1500000,
  "risk_level": "MEDIUM",
  "recommendation": "Safe to take this loan. EMI ₹21,812 is 31% of income.",
  "available_income": 32000,
  "interest_comparisons": [
    {
      "tenure_years": 3,
      "emi_amount": 32145.00,
      "total_interest": 157420,
      "total_paid": 1157420
    },
    {
      "tenure_years": 5,
      "emi_amount": 21812.50,
      "total_interest": 309750,
      "total_paid": 1309750
    },
    {
      "tenure_years": 7,
      "emi_amount": 17235.80,
      "total_interest": 449545,
      "total_paid": 1449545
    }
  ],
  "emergency_fund_safety": true
}
```

---

## Investment Decision AI

### Compare Investments
**POST** `/analysis/investment/compare`

Request Body:
```json
{
  "amount": 500000,
  "duration_years": 5,
  "investment_type": "all",
  "risk_appetite": "medium",
  "language": "en"
}
```

Response:
```json
{
  "investment_amount": 500000,
  "duration_years": 5,
  "comparisons": [
    {
      "type": "mutual_fund",
      "initial_amount": 500000,
      "annual_return_rate": "12.0%",
      "future_value": 881169,
      "gains": 381169,
      "risk": "MEDIUM",
      "liquidity": "HIGH",
      "tax_treatment": "LTCG"
    },
    {
      "type": "stocks",
      "initial_amount": 500000,
      "annual_return_rate": "15.0%",
      "future_value": 1013065,
      "gains": 513065,
      "risk": "HIGH",
      "liquidity": "HIGH",
      "tax_treatment": "LTCG"
    }
  ],
  "best_option": "mutual_fund",
  "recommendation": "✅ Mutual Fund offers good balance. Medium risk, good returns."
}
```

---

## Purchase Decision AI

### Analyze Purchase
**POST** `/analysis/purchase/analyze`

Request Body:
```json
{
  "item_name": "iPhone 15 Pro",
  "item_price": 90000,
  "current_savings": 120000,
  "monthly_savings": 15000,
  "emergency_fund_required": 180000,
  "language": "en"
}
```

Response:
```json
{
  "item_name": "iPhone 15 Pro",
  "item_price": 90000,
  "current_savings": 120000,
  "savings_after_purchase": 30000,
  "emergency_fund_required": 180000,
  "recommendation": "Wait 4 months",
  "decision": "WAIT",
  "months_to_wait": 4,
  "emi_option_available": true,
  "emi_amount": 18000,
  "warning": "Emergency fund will drop below safe level"
}
```

---

## Retirement Planner

### Calculate Retirement Corpus
**POST** `/analysis/retirement/calculate`

Request Body:
```json
{
  "current_age": 30,
  "retirement_age": 60,
  "current_salary": 50000,
  "monthly_investment": 10000,
  "current_savings": 500000,
  "language": "en"
}
```

Response:
```json
{
  "current_age": 30,
  "retirement_age": 60,
  "years_to_retirement": 30,
  "current_corpus": 500000,
  "projected_corpus": 18500000,
  "monthly_income_at_retirement": 61666,
  "required_corpus": 20000000,
  "corpus_gap": 1500000,
  "current_monthly_investment": 10000,
  "additional_monthly_investment_needed": 500,
  "recommendation": "⚠️ Currently investing ₹10,000/month. Increase to bridge the gap."
}
```

---

## Goal Planner

### Calculate Goal Requirements
**POST** `/analysis/goal/calculate`

Request Body:
```json
{
  "goal_name": "House Down Payment",
  "goal_amount": 5000000,
  "timeline_years": 5,
  "current_savings": 1000000,
  "expected_annual_return": 10,
  "language": "en"
}
```

Response:
```json
{
  "goal_name": "House Down Payment",
  "goal_amount": 5000000,
  "timeline_years": 5,
  "current_savings": 1000000,
  "monthly_investment_required": 58000,
  "projected_corpus_fd": 4800000,
  "projected_corpus_mutual_fund": 5200000,
  "recommendation": "Invest ₹58,000/month in Mutual Fund to achieve your goal."
}
```

---

## Financial Health Score

### Get Financial Health Score
**GET** `/health-score/user/{userId}`

Response:
```json
{
  "user_id": 1,
  "overall_score": 75,
  "income_stability_score": 85,
  "savings_habit_score": 70,
  "investment_score": 65,
  "debt_management_score": 80,
  "emergency_fund_score": 60,
  "assessment": "Good financial health. Keep improving savings and investment.",
  "improvement_tips": [
    "Increase monthly savings by 10%",
    "Build emergency fund to 6 months of expenses",
    "Diversify investments"
  ]
}
```

---

## Emergency Risk Detector

### Detect Emergency Fund Risk
**POST** `/analysis/emergency/detect`

Request Body:
```json
{
  "monthly_expenses": 30000,
  "current_savings": 100000,
  "language": "en"
}
```

Response:
```json
{
  "monthly_expenses": 30000,
  "current_savings": 100000,
  "months_covered": 3.33,
  "safe_level_months": 6,
  "required_fund": 180000,
  "fund_gap": 80000,
  "risk_level": "MEDIUM",
  "recommendation": "⚠️ Your emergency fund covers only 3.3 months. Build it to 6 months.",
  "monthly_saving_to_reach_safe_level": 13333
}
```

---

## What-If Simulator

### Simulate Financial Scenarios
**POST** `/analysis/simulator/simulate`

Request Body:
```json
{
  "base_salary": 50000,
  "current_age": 30,
  "retirement_age": 60,
  "scenarios": [
    {
      "name": "Conservative",
      "salary": 50000,
      "monthly_investment": 10000,
      "loan_amount": 0
    },
    {
      "name": "Aggressive",
      "salary": 60000,
      "monthly_investment": 20000,
      "loan_amount": 1000000
    }
  ]
}
```

Response:
```json
{
  "scenarios": [
    {
      "name": "Conservative",
      "projected_wealth": 12000000,
      "retirement_corpus": 10000000,
      "total_savings": 3600000,
      "risk_score": 25
    },
    {
      "name": "Aggressive",
      "projected_wealth": 18000000,
      "retirement_corpus": 15000000,
      "total_savings": 7200000,
      "risk_score": 65
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "monthly_salary is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Please try again later"
}
```

---

## Rate Limiting
- 100 requests per minute per user
- 1000 requests per hour per user

## Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```
