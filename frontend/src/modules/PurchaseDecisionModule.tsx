import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiShoppingCart, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const PurchaseDecisionModule: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    itemName: '',
    itemPrice: '',
    currentSavings: '',
    monthlySavings: '',
  });
  const [decision, setDecision] = useState<any>(null);
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
      const itemPrice = parseFloat(formData.itemPrice);
      const currentSavings = parseFloat(formData.currentSavings);
      const monthlySavings = parseFloat(formData.monthlySavings);
      const emergencyFund = currentSavings * 0.3; // Assume 30% should stay as emergency fund

      const availableToSpend = currentSavings - emergencyFund;
      let recommendation = '';
      let decision_type = '';
      let monthsToWait = 0;

      if (availableToSpend >= itemPrice) {
        recommendation = t('purchaseDecision.buyNow');
        decision_type = 'BUY_NOW';
      } else {
        monthsToWait = Math.ceil((itemPrice - availableToSpend) / monthlySavings);
        recommendation = `${t('purchaseDecision.waitMonths')}: ${monthsToWait} ${t('purchaseDecision.months')}`;
        decision_type = 'WAIT';
      }

      setDecision({
        itemName: formData.itemName,
        itemPrice,
        currentSavings,
        savingsAfterPurchase: availableToSpend - itemPrice,
        emergencyFundRequired: currentSavings * 0.5,
        recommendation,
        decision: decision_type,
        monthsToWait,
        warning:
          availableToSpend - itemPrice < emergencyFund
            ? t('purchaseDecision.emergencyFundWarning')
            : null,
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
          <FiShoppingCart className="w-8 h-8 text-blue-600" />
          {t('purchaseDecision.title')}
        </h2>
        <p className="text-gray-600">{t('purchaseDecision.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <input
          type="text"
          name="itemName"
          placeholder={t('purchaseDecision.itemName')}
          value={formData.itemName}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="itemPrice"
          placeholder={t('purchaseDecision.itemPrice')}
          value={formData.itemPrice}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="currentSavings"
          placeholder={t('purchaseDecision.currentSavings')}
          value={formData.currentSavings}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="monthlySavings"
          placeholder="Monthly Savings"
          value={formData.monthlySavings}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : t('purchaseDecision.analyze')}
      </button>

      {decision && (
        <div className="mt-8 space-y-4">
          <div
            className={`p-6 rounded-lg ${
              decision.decision === 'BUY_NOW'
                ? 'bg-green-50 border-l-4 border-green-500'
                : 'bg-yellow-50 border-l-4 border-yellow-500'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {decision.decision === 'BUY_NOW' ? (
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
              )}
              <h3 className="text-xl font-semibold">{decision.recommendation}</h3>
            </div>
            <p className="text-gray-700 mb-4">
              <strong>Item:</strong> {decision.itemName} | <strong>Price:</strong> ₹{Math.round(decision.itemPrice).toLocaleString('en-IN')}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded">
                <p className="text-gray-600 text-sm">Current Savings</p>
                <p className="text-xl font-bold text-blue-600">
                  ₹{Math.round(decision.currentSavings).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 bg-white rounded">
                <p className="text-gray-600 text-sm">After Purchase</p>
                <p className={`text-xl font-bold ${
                  decision.savingsAfterPurchase >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{Math.round(decision.savingsAfterPurchase).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            {decision.warning && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-800">
                ⚠️ {decision.warning}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseDecisionModule;
