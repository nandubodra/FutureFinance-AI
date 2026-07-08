import numpy as np
import pandas as pd
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


class LoanPredictor:
    """Predicts loan EMI, risk level, and affordability"""

    def __init__(self):
        self.safe_emi_threshold = 0.40  # 40% of income
        self.medium_emi_threshold = 0.50  # 50% of income
        self.annual_interest_rate = 0.09  # 9% default

    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Main prediction method"""
        # Validate input
        self._validate_input(data)

        monthly_salary = float(data.get('monthly_salary', 0))
        monthly_expenses = float(data.get('monthly_expenses', 0))
        current_savings = float(data.get('current_savings', 0))
        existing_emi = float(data.get('existing_emi', 0))
        credit_score = float(data.get('credit_score', 750))
        loan_amount = float(data.get('loan_amount', 0))
        tenure_years = int(data.get('tenure_years', 5))

        # Calculate EMI
        emi = self._calculate_emi(loan_amount, self.annual_interest_rate, tenure_years)

        # Calculate available income
        available_income = monthly_salary - monthly_expenses - existing_emi

        # Calculate EMI as percentage of salary
        emi_percentage = (emi / monthly_salary) if monthly_salary > 0 else 0

        # Determine risk level
        risk_level = self._determine_risk_level(emi_percentage, credit_score)

        # Calculate max safe loan
        max_safe_loan = self._calculate_max_loan(
            available_income, self.safe_emi_threshold, self.annual_interest_rate, tenure_years
        )

        # Generate recommendation
        recommendation = self._generate_recommendation(risk_level, emi, loan_amount, data.get('language', 'en'))

        # Generate interest comparisons
        interest_comparisons = self._generate_comparisons(loan_amount, tenure_years)

        return {
            'emi_amount': round(emi, 2),
            'emi_percentage': round(emi_percentage * 100, 2),
            'max_safe_loan': round(max_safe_loan, 2),
            'risk_level': risk_level,
            'recommendation': recommendation,
            'available_income': round(available_income, 2),
            'interest_comparisons': interest_comparisons,
            'emergency_fund_safety': current_savings > (monthly_expenses * 6),
        }

    def _validate_input(self, data: Dict[str, Any]) -> None:
        """Validate input data"""
        required_fields = ['monthly_salary', 'monthly_expenses', 'loan_amount']
        for field in required_fields:
            if field not in data or data[field] < 0:
                raise ValueError(f"Invalid or missing field: {field}")

    def _calculate_emi(self, principal: float, annual_rate: float, years: int) -> float:
        """Calculate EMI using standard formula"""
        monthly_rate = annual_rate / 12
        num_months = years * 12

        if monthly_rate == 0:
            return principal / num_months

        factor = (1 + monthly_rate) ** num_months
        emi = principal * (monthly_rate * factor) / (factor - 1)
        return emi

    def _calculate_max_loan(self, available_income: float, threshold: float, 
                           annual_rate: float, years: int) -> float:
        """Calculate maximum safe loan amount"""
        max_emi = available_income * threshold
        monthly_rate = annual_rate / 12
        num_months = years * 12

        if monthly_rate == 0:
            return max_emi * num_months

        factor = (1 + monthly_rate) ** num_months
        max_loan = max_emi * (factor - 1) / (monthly_rate * factor)
        return max_loan

    def _determine_risk_level(self, emi_percentage: float, credit_score: float) -> str:
        """Determine risk level based on EMI percentage and credit score"""
        if emi_percentage > 0.50 or credit_score < 600:
            return "HIGH"
        elif emi_percentage > 0.40 or credit_score < 750:
            return "MEDIUM"
        else:
            return "LOW"

    def _generate_recommendation(self, risk_level: str, emi: float, 
                                 loan_amount: float, language: str) -> str:
        """Generate recommendation text"""
        if language == 'hi':
            if risk_level == "HIGH":
                return f"⚠️ जोखिम अधिक है। EMI ₹{emi:.0f} आपकी आय का 50% से अधिक है। ऋण राशि कम करने पर विचार करें।"
            elif risk_level == "MEDIUM":
                return f"⚡ जोखिम मध्यम है। EMI ₹{emi:.0f} संभालनीय है लेकिन सावधानी से आगे बढ़ें।"
            else:
                return f"✅ सुरक्षित है। EMI ₹{emi:.0f} आपकी आय का केवल 40% है। यह ऋण लेना सुरक्षित है।"
        else:
            if risk_level == "HIGH":
                return f"⚠️ Risk is HIGH. EMI ₹{emi:.0f} exceeds 50% of income. Consider reducing loan amount."
            elif risk_level == "MEDIUM":
                return f"⚡ Risk is MEDIUM. EMI ₹{emi:.0f} is manageable but proceed cautiously."
            else:
                return f"✅ Safe to take this loan. EMI ₹{emi:.0f} is only 40% of income."

    def _generate_comparisons(self, loan_amount: float, default_tenure: int) -> list:
        """Generate interest comparisons for different tenures"""
        comparisons = []
        for tenure in [3, 5, 7]:
            emi = self._calculate_emi(loan_amount, self.annual_interest_rate, tenure)
            total_paid = emi * tenure * 12
            total_interest = total_paid - loan_amount
            
            comparisons.append({
                'tenure_years': tenure,
                'emi_amount': round(emi, 2),
                'total_interest': round(total_interest, 2),
                'total_paid': round(total_paid, 2)
            })
        return comparisons
