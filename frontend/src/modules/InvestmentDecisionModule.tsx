import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiTrendingUp, FiBarChart2 } from 'react-icons/fi';

interface InvestmentOption {
  type: string;
  initialAmount: number;
  annualReturnRate: string;
  futureValue: number;
  gains: number;
  risk: string;
  liquidity: string;
  taxTreatment: string;
}

const InvestmentDecisionModule: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    amount: '',
    duration: '',
    riskAppetite: 'medium',
    investmentType: 'all',
  });
  const [comparisons, setComparisons] = useState<InvestmentOption[] | null>(null);
  const [bestOption, setBestOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompare = async () => {
    if (!formData.amount || !formData.duration) {
      alert(t('errors.fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      // Simulated API call - replace with actual API
      const mockComparisons: InvestmentOption[] = [
        {
          type: 'mutual_fund',
          initialAmount: parseFloat(formData.amount),
          annualReturnRate: '12.0%',
          futureValue: parseFloat(formData.amount) * 1.76,
          gains: parseFloat(formData.amount) * 0.76,
          risk: 'MEDIUM',
          liquidity: 'HIGH',
          taxTreatment: 'LTCG',
        },
        {
          type: 'fd',
          initialAmount: parseFloat(formData.amount),
          annualReturnRate: '6.5%',
          futureValue: parseFloat(formData.amount) * 1.37,
          gains: parseFloat(formData.amount) * 0.37,
          risk: 'LOW',
          liquidity: 'MEDIUM',
          taxTreatment: 'SLAB',
        },
        {
          type: 'gold',
          initialAmount: parseFloat(formData.amount),
          annualReturnRate: '5.5%',
          futureValue: parseFloat(formData.amount) * 1.31,
          gains: parseFloat(formData.amount) * 0.31,
          risk: 'LOW',
          liquidity: 'MEDIUM',
          taxTreatment: 'SLAB',
        },
        {
          type: 'stocks',
          initialAmount: parseFloat(formData.amount),
          annualReturnRate: '15.0%',
          futureValue: parseFloat(formData.amount) * 2.03,
          gains: parseFloat(formData.amount) * 1.03,
          risk: 'HIGH',
          liquidity: 'HIGH',
          taxTreatment: 'LTCG',
        },
      ];

      setComparisons(mockComparisons.sort((a, b) => b.futureValue - a.futureValue));
      setBestOption(mockComparisons[0].type);
    } catch (error) {
      alert(t('errors.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'text-green-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'HIGH':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FiBarChart2 className="w-8 h-8 text-purple-600" />
          {t('investmentDecision.title')}
        </h2>
        <p className="text-gray-600">{t('investmentDecision.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <input
          type="number"
          name="amount"
          placeholder={t('investmentDecision.amount')}
          value={formData.amount}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="number"
          name="duration"
          placeholder={t('investmentDecision.duration')}
          value={formData.duration}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          name="riskAppetite"
          value={formData.riskAppetite}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>
        <select
          name="investmentType"
          value={formData.investmentType}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Options</option>
          <option value="fd">Fixed Deposit</option>
          <option value="mutual_fund">Mutual Fund</option>
          <option value="gold">Gold</option>
          <option value="stocks">Stocks</option>
        </select>
      </div>

      <button
        onClick={handleCompare}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? 'Comparing...' : t('investmentDecision.compare')}
      </button>

      {comparisons && (
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {comparisons.map((option) => (
              <div
                key={option.type}
                className={`p-4 rounded-lg border-2 transition ${
                  bestOption === option.type
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <h3 className="font-semibold mb-2 capitalize">{option.type}</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Return Rate:</span>
                    <span className="font-bold ml-2">{option.annualReturnRate}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Risk:</span>
                    <span className={`font-bold ml-2 ${getRiskColor(option.risk)}`}>
                      {option.risk}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Liquidity:</span>
                    <span className="font-bold ml-2">{option.liquidity}</span>
                  </p>
                  <div className="pt-2 border-t mt-2">
                    <p className="text-gray-600">Future Value</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{Math.round(option.futureValue).toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                      Gain: ₹{Math.round(option.gains).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {bestOption && (
            <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded">
              <p className="text-purple-800">
                <strong>✨ {t('investmentDecision.recommendation')}:</strong> Invest in{' '}
                <strong className="capitalize">{bestOption}</strong> for optimal returns based on your risk appetite.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvestmentDecisionModule;
