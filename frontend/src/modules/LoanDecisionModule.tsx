import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiTrendingUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface LoanAnalysis {
  maxLoan: number;
  emiAmount: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  interestComparison: { amount: number; tenure: number; interest: number }[];
}

const LoanDecisionModule: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    salary: '',
    expenses: '',
    savings: '',
    existingEMI: '',
    creditScore: '',
    loanAmount: '',
  });
  const [analysis, setAnalysis] = useState<LoanAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async () => {
    if (!Object.values(formData).every((v) => v)) {
      alert(t('errors.fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      // Simulated analysis - replace with actual API call
      const salary = parseFloat(formData.salary);
      const loanAmount = parseFloat(formData.loanAmount);
      const emiAmount = (loanAmount / 60) * 1.1;
      const emiPercentage = (emiAmount / salary) * 100;

      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (emiPercentage > 50) riskLevel = 'high';
      else if (emiPercentage > 40) riskLevel = 'medium';

      const interestComparison = [
        { amount: loanAmount, tenure: 5, interest: loanAmount * 0.15 },
        { amount: loanAmount, tenure: 7, interest: loanAmount * 0.18 },
        { amount: loanAmount * 0.8, tenure: 5, interest: loanAmount * 0.8 * 0.15 },
      ];

      setAnalysis({
        maxLoan: salary * 3,
        emiAmount,
        riskLevel,
        recommendation: `${t('loanDecision.recommendation')}: Based on your profile, maximum safe loan is ₹${Math.round(salary * 3).toLocaleString('en-IN')}`,
        interestComparison,
      });
    } catch (error) {
      alert(t('errors.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FiTrendingUp className="w-8 h-8 text-blue-600" />
          {t('loanDecision.title')}
        </h2>
        <p className="text-gray-600">{t('loanDecision.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <input
          type="number"
          name="salary"
          placeholder={t('loanDecision.inputSalary')}
          value={formData.salary}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="expenses"
          placeholder={t('loanDecision.inputExpenses')}
          value={formData.expenses}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="savings"
          placeholder={t('loanDecision.inputSavings')}
          value={formData.savings}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="existingEMI"
          placeholder={t('loanDecision.inputEMI')}
          value={formData.existingEMI}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="creditScore"
          placeholder={t('loanDecision.inputCreditScore')}
          value={formData.creditScore}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="loanAmount"
          placeholder={t('loanDecision.loanAmount')}
          value={formData.loanAmount}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : t('loanDecision.analyze')}
      </button>

      {analysis && (
        <div className="mt-8 space-y-6">
          <div className={`p-6 rounded-lg ${
            analysis.riskLevel === 'high'
              ? 'bg-red-50 border-l-4 border-red-500'
              : analysis.riskLevel === 'medium'
              ? 'bg-yellow-50 border-l-4 border-yellow-500'
              : 'bg-green-50 border-l-4 border-green-500'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {analysis.riskLevel === 'high' ? (
                <FiAlertCircle className="w-6 h-6 text-red-600" />
              ) : (
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              )}
              <h3 className="text-xl font-semibold">{t(`loanDecision.${analysis.riskLevel}`)}</h3>
            </div>
            <p>{analysis.recommendation}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-600 text-sm">{t('loanDecision.maxLoan')}</p>
              <p className="text-2xl font-bold text-blue-600">₹{Math.round(analysis.maxLoan).toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-600 text-sm">{t('loanDecision.emiAffordability')}</p>
              <p className="text-2xl font-bold text-purple-600">₹{Math.round(analysis.emiAmount).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDecisionModule;
