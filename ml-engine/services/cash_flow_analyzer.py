from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


class CashFlowAnalyzer:
    """Analyzes financial cash flow and patterns"""

    def __init__(self):
        pass

    def analyze(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze cash flow"""
        self._validate_input(data)

        monthly_income = float(data.get('monthly_income', 0))
        monthly_expenses = float(data.get('monthly_expenses', 0))
        monthly_investments = float(data.get('monthly_investments', 0))
        monthly_debt_payment = float(data.get('monthly_debt_payment', 0))
        language = data.get('language', 'en')

        # Calculate cash flow
        total_outflow = monthly_expenses + monthly_investments + monthly_debt_payment
        net_cash_flow = monthly_income - total_outflow
        savings_rate = (monthly_investments / monthly_income * 100) if monthly_income > 0 else 0
        expense_ratio = (monthly_expenses / monthly_income * 100) if monthly_income > 0 else 0

        # Health score
        health_score = self._calculate_health_score(savings_rate, expense_ratio, net_cash_flow, monthly_income)

        # Recommendations
        recommendations = self._generate_recommendations(savings_rate, expense_ratio, health_score, language)

        return {
            'monthly_income': round(monthly_income, 2),
            'monthly_expenses': round(monthly_expenses, 2),
            'monthly_investments': round(monthly_investments, 2),
            'monthly_debt_payment': round(monthly_debt_payment, 2),
            'total_outflow': round(total_outflow, 2),
            'net_cash_flow': round(net_cash_flow, 2),
            'savings_rate_percentage': round(savings_rate, 2),
            'expense_ratio_percentage': round(expense_ratio, 2),
            'financial_health_score': round(health_score, 2),
            'recommendations': recommendations,
        }

    def _validate_input(self, data: Dict[str, Any]) -> None:
        """Validate input data"""
        if 'monthly_income' not in data or data['monthly_income'] < 0:
            raise ValueError("Invalid or missing monthly_income")

    def _calculate_health_score(self, savings_rate: float, expense_ratio: float, 
                                net_cash_flow: float, income: float) -> float:
        """Calculate financial health score (0-100)"""
        score = 0

        # Savings rate (40 points max)
        if savings_rate >= 30:
            score += 40
        elif savings_rate >= 20:
            score += 30
        elif savings_rate >= 10:
            score += 20
        elif savings_rate > 0:
            score += 10

        # Expense ratio (30 points max)
        if expense_ratio <= 50:
            score += 30
        elif expense_ratio <= 60:
            score += 20
        elif expense_ratio <= 70:
            score += 10

        # Net cash flow (30 points max)
        if net_cash_flow > 0:
            ratio = min(net_cash_flow / income, 1.0)
            score += 30 * ratio

        return min(score, 100)

    def _generate_recommendations(self, savings_rate: float, expense_ratio: float, 
                                  health_score: float, language: str) -> list:
        """Generate recommendations"""
        recommendations = []

        if language == 'hi':
            if savings_rate < 10:
                recommendations.append("💡 आप बहुत कम बचा रहे हैं। बचत दर को कम से कम 20% तक बढ़ाने का प्रयास करें।")
            elif savings_rate < 20:
                recommendations.append("💡 अच्छा है, लेकिन बचत बढ़ाने की गुंजाइश है। 30% तक पहुंचने का प्रयास करें।")
            else:
                recommendations.append("✅ उत्तम! आपकी बचत दर अच्छी है।")

            if expense_ratio > 70:
                recommendations.append("📊 आपका व्यय अनुपात अधिक है। गैर-आवश्यक खर्च कम करने का प्रयास करें।")
            elif expense_ratio > 60:
                recommendations.append("📊 व्यय नियंत्रण में रखें। 50% के नीचे लाने की कोशिश करें।")

            if health_score >= 80:
                recommendations.append("🌟 आप वित्तीय रूप से स्वस्थ हैं। इसी तरह जारी रखें।")
            elif health_score >= 60:
                recommendations.append("⚠️ आप ठीक-ठाक हैं, लेकिन सुधार की गुंजाइश है।")
            else:
                recommendations.append("❌ अपने वित्त पर ध्यान दें। कुछ बदलाव करें।")
        else:
            if savings_rate < 10:
                recommendations.append("💡 You're saving very little. Try to increase savings rate to at least 20%.")
            elif savings_rate < 20:
                recommendations.append("💡 Good, but room for improvement. Try to reach 30%.")
            else:
                recommendations.append("✅ Excellent! Your savings rate is good.")

            if expense_ratio > 70:
                recommendations.append("📊 Your expense ratio is high. Try reducing non-essential expenses.")
            elif expense_ratio > 60:
                recommendations.append("📊 Keep expenses in check. Try to bring it below 50%.")

            if health_score >= 80:
                recommendations.append("🌟 You're financially healthy. Keep it up.")
            elif health_score >= 60:
                recommendations.append("⚠️ You're okay, but there's room for improvement.")
            else:
                recommendations.append("❌ Focus on your finances. Make some changes.")

        return recommendations
