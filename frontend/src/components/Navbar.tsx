import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { FiHome, FiBarChart3, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiDollarSign className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{t('common.appName')}</h1>
        </div>
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <FiHome className="w-5 h-5" />
            {t('common.home')}
          </a>
          <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            <FiBarChart3 className="w-5 h-5" />
            {t('common.dashboard')}
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
