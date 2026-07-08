import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiAward, FiTrendingUp } from 'react-icons/fi';

interface HealthMetric {
  name: string;
  score: number;
  maxScore: number;
}

const FinancialHealthScoreModule: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    monthlyInvestments: '',
    currentSavings: '',
    totalDebt: '',
    existingEMI: '',
  });
  const [healthScore, setHealthScore] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCalculate = async () => {
    if (!Object.values(formData).every((v) => v)) {
      alert(t('errors.fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const income = parseFloat(formData.monthlyIncome);
      const expenses = parseFloat(formData.monthlyExpenses);
      const investments = parseFloat(formData.monthlyInvestments);
      const savings = parseFloat(formData.currentSavings);
      const debt = parseFloat(formData.totalDebt);
      const emi = parseFloat(formData.existingEMI);

      // Calculate individual scores
      const savingsRate = (investments / income) * 100;
      const expenseRatio = (expenses / income) * 100;
      const emergencyFundMonths = savings / expenses;
      const debtToIncome = debt / (income * 12);
      const emiRatio = (emi / income) * 100;

      // Score calculations (0-100)
      let scores = {
        incomeStability: 75, // Default
        savingsHabit: Math.min((savingsRate / 0.3) * 100, 100),
        investment: Math.min(savingsRate * 1.5, 100),
        debtManagement: Math.max(100 - debtToIncome * 100, 0),
        emergencyFund: Math.min((emergencyFundMonths / 6) * 100, 100),
      };

      const overallScore = Object.values(scores).reduce((a, b) => a + b) / Object.keys(scores).length;

      const tips = generateTips(savingsRate, expenseRatio, emergencyFundMonths, emiRatio);

      setHealthScore({
        overallScore: Math.round(overallScore),
        ...scores,
        tips,
        recommendation: getRecommendation(overallScore),
      });
    } catch (error) {
      alert(t('errors.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const generateTips = (savingsRate: number, expenseRatio: number, emergencyFunds: number, emiRatio: number) => {
    const tips = [];
    if (savingsRate < 20) tips.push('💡 Increase your savings rate to at least 20%');
    if (expenseRatio > 60) tips.push('💡 Reduce your monthly expenses');
    if (emergencyFunds < 3) tips.push('💡 Build an emergency fund for 6 months');
    if (emiRatio > 40) tips.push('💡 Reduce your EMI burden');
    return tips.length > 0 ? tips : ['✅ Your finances are in great shape!'];
  };

  const getRecommendation = (score: number) => {
    if (score >= 80) return 'Excellent financial health';
    if (score >= 60) return 'Good financial health';
    if (score >= 40) return 'Fair financial health';
    return 'Poor financial health - Needs improvement';
  };

  const ScoreCard = ({ label, score }: { label: string; score: number }) => (
    <div className="p-4 bg-white rounded-lg border">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            score >= 80
              ? 'bg-green-600'
              : score >= 60
              ? 'bg-yellow-600'
              : 'bg-red-600'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-right text-lg font-bold mt-2 text-gray-800">{Math.round(score)}/100</p>
    </div>
  );

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FiAward className="w-8 h-8 text-indigo-600" />
          {t('healthScore.title')}
        </h2>
        <p className="text-gray-600">{t('healthScore.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <input
          type="number"
          name="monthlyIncome"
          placeholder="Monthly Income"
          value={formData.monthlyIncome}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          name="monthlyExpenses"
          placeholder="Monthly Expenses"
          value={formData.monthlyExpenses}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          name="monthlyInvestments"
          placeholder="Monthly Investments"
          value={formData.monthlyInvestments}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          name="currentSavings"
          placeholder="Current Savings"
          value={formData.currentSavings}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          name="totalDebt"
          placeholder="Total Debt"
          value={formData.totalDebt}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          name="existingEMI"
          placeholder="Existing EMI"
          value={formData.existingEMI}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? 'Calculating...' : 'Calculate Health Score'}
      </button>

      {healthScore && (
        <div className="mt-8 space-y-6">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-lg">
            <p className="text-indigo-100 mb-2">Your Overall Financial Health</p>
            <p className="text-5xl font-bold mb-2">{healthScore.overallScore}/100</p>
            <p className="text-lg">{healthScore.recommendation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreCard label="Income Stability" score={healthScore.incomeStability} />
            <ScoreCard label="Savings Habit" score={healthScore.savingsHabit} />
            <ScoreCard label="Investment" score={healthScore.investment} />
            <ScoreCard label="Debt Management" score={healthScore.debtManagement} />
            <ScoreCard label="Emergency Fund" score={healthScore.emergencyFund} />
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Improvement Tips:</h3>
            <ul className="space-y-1">
              {healthScore.tips.map((tip: string, idx: number) => (
                <li key={idx} className="text-blue-800">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialHealthScoreModule;
