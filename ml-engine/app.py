from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from datetime import datetime
import os
from dotenv import load_dotenv

from services.loan_predictor import LoanPredictor
from services.investment_analyzer import InvestmentAnalyzer
from services.retirement_calculator import RetirementCalculator
from services.cash_flow_analyzer import CashFlowAnalyzer

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services
loan_predictor = LoanPredictor()
investment_analyzer = InvestmentAnalyzer()
retirement_calculator = RetirementCalculator()
cash_flow_analyzer = CashFlowAnalyzer()


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'UP',
        'service': 'FutureFinance ML Engine',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/api/predict/loan', methods=['POST'])
def predict_loan():
    """Predict loan EMI and risk"""
    try:
        data = request.json
        logger.info(f"Loan prediction request: {data}")
        
        result = loan_predictor.predict(data)
        return jsonify(result), 200
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/predict/investment', methods=['POST'])
def predict_investment():
    """Analyze investment options"""
    try:
        data = request.json
        logger.info(f"Investment analysis request: {data}")
        
        result = investment_analyzer.analyze(data)
        return jsonify(result), 200
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/predict/retirement', methods=['POST'])
def predict_retirement():
    """Calculate retirement corpus"""
    try:
        data = request.json
        logger.info(f"Retirement calculation request: {data}")
        
        result = retirement_calculator.calculate(data)
        return jsonify(result), 200
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Calculation error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/analyze/cash-flow', methods=['POST'])
def analyze_cash_flow():
    """Analyze financial cash flow"""
    try:
        data = request.json
        logger.info(f"Cash flow analysis request: {data}")
        
        result = cash_flow_analyzer.analyze(data)
        return jsonify(result), 200
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
