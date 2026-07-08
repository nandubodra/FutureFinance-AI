import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiTrendingUp, FiCalendar } from 'react-icons/fi';

const RetirementPlannerModule: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    currentAge: '',
    retirementAge: '',
    currentSalary: '',
    monthlyInvestment: '',
    currentSavings: '',
  });
  const [projection, setProjection] = useState<any>(null);
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
      const currentAge = parseInt(formData.currentAge);
      const retirementAge = parseInt(formData.retirementAge);
      const yearsToRetire = retirementAge - currentAge;

      if (yearsToRetire <= 0) {
        alert('Retirement age must be greater than current age');
        return;
      }

      const currentSavings = parseFloat(formData.currentSavings);
      const monthlyInvestment = parseFloat(formData.monthlyInvestment);
      const annualReturn = 0.1; // 10% average

      // Calculate future value of current savings
      const futureSavings = currentSavings * Math.pow(1 + annualReturn, yearsToRetire);

      // Calculate future value of monthly investments
      const monthlyRate = annualReturn / 12;
      const months = yearsToRetire * 12;
      const futureInvestments =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

      const totalCorpus = futureSavings + futureInvestments;
      const monthlyIncome = (totalCorpus * 0.04) / 12; // 4% withdrawal rule

      setProjection({
        currentAge,
        retirementAge,
        yearsToRetire,
        currentCorpus: currentSavings,
        projectedCorpus: totalCorpus,
        monthlyIncomeAtRetirement: monthlyIncome,
        currentMonthlyInvestment: monthlyInvestment,
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
          <FiCalendar className="w-8 h-8 text-orange-600" />
          {t('retirementPlanner.title')}
        </h2>
        <p className="text-gray-600">{t('retirementPlanner.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <input
          type="number"
          name="currentAge"
          placeholder={t('retirementPlanner.currentAge')}
          value={formData.currentAge}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          name="retirementAge"
          placeholder={t('retirementPlanner.retirementAge')}
          value={formData.retirementAge}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          name="currentSalary"
          placeholder={t('retirementPlanner.currentSalary')}
          value={formData.currentSalary}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          name="monthlyInvestment"
          placeholder={t('retirementPlanner.monthlyInvestment')}
          value={formData.monthlyInvestment}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          name="currentSavings"
          placeholder="Current Savings"
          value={formData.currentSavings}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? 'Calculating...' : t('retirementPlanner.calculate')}
      </button>

      {projection && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <p className="text-gray-600 text-sm mb-2">Years to Retirement</p>
            <p className="text-4xl font-bold text-orange-600 mb-4">{projection.yearsToRetire}</p>
            <p className="text-gray-700">Age {projection.currentAge} → {projection.retirementAge}</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <p className="text-gray-600 text-sm mb-2">Projected Retirement Corpus</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{(projection.projectedCorpus / 10000000).toFixed(2)} Cr
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Monthly: ₹{Math.round(projection.monthlyIncomeAtRetirement).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <p className="text-gray-600 text-sm mb-2">Current Corpus</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{Math.round(projection.currentCorpus).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <p className="text-gray-600 text-sm mb-2">Monthly Investment</p>
            <p className="text-2xl font-bold text-purple-600">
              ₹{Math.round(projection.currentMonthlyInvestment).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetirementPlannerModule;
