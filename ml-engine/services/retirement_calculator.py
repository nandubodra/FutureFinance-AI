from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


class RetirementCalculator:
    """Calculates retirement corpus and income"""

    def __init__(self):
        self.inflation_rate = 0.06  # 6% inflation
        self.investment_return = 0.10  # 10% average return

    def calculate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate retirement corpus"""
        self._validate_input(data)

        current_age = int(data.get('current_age', 25))
        retirement_age = int(data.get('retirement_age', 60))
        current_salary = float(data.get('current_salary', 0))
        monthly_investment = float(data.get('monthly_investment', 0))
        current_savings = float(data.get('current_savings', 0))
        language = data.get('language', 'en')

        years_to_retirement = retirement_age - current_age

        if years_to_retirement <= 0:
            raise ValueError("Retirement age must be greater than current age")

        # Calculate future value of current savings
        future_savings = self._calculate_future_value(current_savings, years_to_retirement)

        # Calculate future value of monthly investments
        future_investments = self._calculate_future_value_annuity(monthly_investment, years_to_retirement)

        # Total retirement corpus
        total_corpus = future_savings + future_investments

        # Calculate monthly income at retirement (4% rule)
        monthly_income = total_corpus * 0.04 / 12

        # Estimate required corpus for current lifestyle
        current_monthly_expenses = current_salary * 0.6  # Assume 60% of salary as expenses
        inflation_factor = (1 + self.inflation_rate) ** years_to_retirement
        required_corpus = (current_monthly_expenses * inflation_factor) * 12 * 25  # 25-year retirement

        # Gap analysis
        corpus_gap = required_corpus - total_corpus
        additional_monthly_investment = self._calculate_additional_investment(corpus_gap, years_to_retirement) if corpus_gap > 0 else 0

        recommendation = self._generate_recommendation(
            total_corpus, required_corpus, corpus_gap, monthly_investment, language
        )

        return {
            'current_age': current_age,
            'retirement_age': retirement_age,
            'years_to_retirement': years_to_retirement,
            'current_corpus': round(current_savings, 2),
            'projected_corpus': round(total_corpus, 2),
            'monthly_income_at_retirement': round(monthly_income, 2),
            'required_corpus': round(required_corpus, 2),
            'corpus_gap': round(corpus_gap, 2),
            'current_monthly_investment': round(monthly_investment, 2),
            'additional_monthly_investment_needed': round(additional_monthly_investment, 2),
            'recommendation': recommendation,
        }

    def _validate_input(self, data: Dict[str, Any]) -> None:
        """Validate input data"""
        if 'current_salary' not in data or data['current_salary'] < 0:
            raise ValueError("Invalid or missing current_salary")

    def _calculate_future_value(self, principal: float, years: int) -> float:
        """Calculate future value of lump sum"""
        return principal * ((1 + self.investment_return) ** years)

    def _calculate_future_value_annuity(self, monthly_amount: float, years: int) -> float:
        """Calculate future value of monthly investments"""
        months = years * 12
        monthly_rate = self.investment_return / 12

        if monthly_rate == 0:
            return monthly_amount * months

        fv = monthly_amount * (((1 + monthly_rate) ** months - 1) / monthly_rate)
        return fv

    def _calculate_additional_investment(self, gap: float, years: int) -> float:
        """Calculate additional monthly investment needed to bridge the gap"""
        months = years * 12
        monthly_rate = self.investment_return / 12

        if monthly_rate == 0:
            return gap / months

        additional = gap / (((1 + monthly_rate) ** months - 1) / monthly_rate)
        return additional

    def _generate_recommendation(self, projected: float, required: float, gap: float, 
                                 current_investment: float, language: str) -> str:
        """Generate retirement recommendation"""
        if language == 'hi':
            if gap <= 0:
                return f"✅ बहुत अच्छा! आप अपना लक्ष्य प्राप्त करेंगे। अनुमानित कोष ₹{projected/10**7:.1f} करोड़।"
            else:
                additional = (gap / ((1 + self.investment_return/12) ** (years_to_retirement * 12) - 1)) * (self.investment_return/12)
                return f"⚠️ अभी ₹{current_investment:.0f}/माह निवेश कर रहे हैं। लक्ष्य के लिए ₹{additional:.0f} और बढ़ाएं।"
        else:
            if gap <= 0:
                return f"✅ Excellent! You'll reach your goal. Projected corpus ₹{projected/10**7:.1f} crore."
            else:
                return f"⚠️ Currently investing ₹{current_investment:.0f}/month. Increase to bridge the gap."
