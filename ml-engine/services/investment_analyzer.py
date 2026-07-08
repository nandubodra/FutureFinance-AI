from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


class InvestmentAnalyzer:
    """Analyzes and compares investment options"""

    def __init__(self):
        self.investment_options = {
            'fd': {'return': 0.065, 'risk': 'LOW', 'liquidity': 'MEDIUM', 'tax': 'SLAB'},
            'mutual_fund': {'return': 0.12, 'risk': 'MEDIUM', 'liquidity': 'HIGH', 'tax': 'LTCG'},
            'gold': {'return': 0.055, 'risk': 'LOW', 'liquidity': 'MEDIUM', 'tax': 'SLAB'},
            'stocks': {'return': 0.15, 'risk': 'HIGH', 'liquidity': 'HIGH', 'tax': 'LTCG'},
        }

    def analyze(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze investment options"""
        self._validate_input(data)

        amount = float(data.get('amount', 0))
        duration_years = int(data.get('duration_years', 5))
        language = data.get('language', 'en')
        investment_type = data.get('investment_type', 'all')

        # Calculate returns for each option
        comparisons = self._calculate_returns(amount, duration_years, investment_type)

        # Determine best option
        best_option = self._determine_best_option(comparisons, data.get('risk_appetite', 'medium'))

        # Generate recommendation
        recommendation = self._generate_recommendation(best_option, language)

        return {
            'investment_amount': amount,
            'duration_years': duration_years,
            'comparisons': comparisons,
            'best_option': best_option,
            'recommendation': recommendation,
        }

    def _validate_input(self, data: Dict[str, Any]) -> None:
        """Validate input data"""
        if 'amount' not in data or data['amount'] < 0:
            raise ValueError("Invalid or missing amount")

    def _calculate_returns(self, amount: float, years: int, investment_type: str) -> list:
        """Calculate returns for investment options"""
        comparisons = []

        types_to_check = [investment_type] if investment_type != 'all' else list(self.investment_options.keys())

        for inv_type in types_to_check:
            if inv_type not in self.investment_options:
                continue

            option = self.investment_options[inv_type]
            annual_return_rate = option['return']

            # Calculate future value
            future_value = amount * ((1 + annual_return_rate) ** years)
            gains = future_value - amount

            comparisons.append({
                'type': inv_type,
                'initial_amount': amount,
                'annual_return_rate': f"{annual_return_rate * 100:.1f}%",
                'future_value': round(future_value, 2),
                'gains': round(gains, 2),
                'risk': option['risk'],
                'liquidity': option['liquidity'],
                'tax_treatment': option['tax'],
            })

        # Sort by future value
        return sorted(comparisons, key=lambda x: x['future_value'], reverse=True)

    def _determine_best_option(self, comparisons: list, risk_appetite: str) -> str:
        """Determine best investment option based on risk appetite"""
        if risk_appetite == 'low':
            for comp in comparisons:
                if comp['risk'] == 'LOW':
                    return comp['type']
        elif risk_appetite == 'high':
            return comparisons[0]['type']  # Highest return
        else:  # medium
            for comp in comparisons:
                if comp['risk'] == 'MEDIUM':
                    return comp['type']

        return comparisons[0]['type']

    def _generate_recommendation(self, best_option: str, language: str) -> str:
        """Generate recommendation"""
        recommendations = {
            'hi': {
                'fd': '✅ सावधि जमा सुरक्षित विकल्प है। कम जोखिम, गारंटीकृत रिटर्न।',
                'mutual_fund': '✅ म्यूचुअल फंड अच्छा संतुलन प्रदान करता है। मध्यम जोखिम, अच्छा रिटर्न।',
                'gold': '✅ सोना परंपरागत सुरक्षित विकल्प है। महंगाई से रक्षा करता है।',
                'stocks': '✅ शेयर उच्च रिटर्न देते हैं पर अधिक जोखिम है। दीर्घकालीन निवेश के लिए।',
            },
            'en': {
                'fd': '✅ Fixed Deposit is a safe option. Low risk, guaranteed returns.',
                'mutual_fund': '✅ Mutual Fund offers good balance. Medium risk, good returns.',
                'gold': '✅ Gold is traditional safe option. Protects against inflation.',
                'stocks': '✅ Stocks offer high returns but with higher risk. Best for long-term.',
            }
        }

        return recommendations.get(language, recommendations['en']).get(best_option, 'Invest wisely.')
