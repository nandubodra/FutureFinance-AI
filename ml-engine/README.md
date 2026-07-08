# ML Engine - FutureFinance AI

Flask-based ML service for financial predictions and analysis.

## Installation

```bash
pip install -r requirements.txt
python app.py
```

The service runs on `http://localhost:5000`

## Endpoints

- `POST /api/predict/loan` - Loan EMI and risk prediction
- `POST /api/predict/investment` - Investment recommendation
- `POST /api/predict/retirement` - Retirement corpus calculation
- `POST /api/analyze/cash-flow` - Cash flow analysis
- `GET /api/health` - Health check
