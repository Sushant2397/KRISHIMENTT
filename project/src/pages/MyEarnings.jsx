import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import earningsService from '../services/earningsService';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard
} from 'lucide-react';

const MyEarnings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'labour') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryRes, earningsRes] = await Promise.all([
        earningsService.getEarningsSummary(),
        earningsService.getMyEarnings()
      ]);
      setSummary(summaryRes.data);
      setEarnings(earningsRes.data || []);
    } catch (e) {
      console.error('Failed to load earnings:', e);
      // Set default values if API fails
      setSummary({
        total_earnings: 0,
        total_jobs: 0,
        paid_earnings: 0,
        pending_earnings: 0,
        monthly_earnings: []
      });
      setEarnings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      disputed: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    if (status === 'paid') return <CheckCircle className="w-4 h-4" />;
    if (status === 'pending') return <Clock className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-border border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 flex items-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <DollarSign className="mr-3 h-8 w-8 text-primary" />
            {t('My Earnings')}
          </h1>
          <p className="text-muted-foreground">{t('Track your job earnings and payment history')}</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-primary/20 bg-primary p-6 text-primary-foreground shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <Wallet className="w-8 h-8 opacity-90" />
                <ArrowUpRight className="w-5 h-5 opacity-75" />
              </div>
              <p className="text-sm opacity-90 mb-1">{t('Total Earnings')}</p>
              <p className="text-3xl font-bold">{formatCurrency(summary.total_earnings)}</p>
              <p className="text-sm opacity-75 mt-2">{summary.total_jobs} {t('jobs completed')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8 opacity-90" />
                <ArrowUpRight className="w-5 h-5 opacity-75" />
              </div>
              <p className="text-sm opacity-90 mb-1">{t('Paid Earnings')}</p>
              <p className="text-3xl font-bold">{formatCurrency(summary.paid_earnings)}</p>
              <p className="text-sm opacity-75 mt-2">
                {summary.total_earnings > 0 ? ((summary.paid_earnings / summary.total_earnings) * 100).toFixed(0) : 0}% {t('of total')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-[#F1E8D8]/65 p-6 text-foreground shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 opacity-90" />
                <ArrowDownRight className="w-5 h-5 opacity-75" />
              </div>
              <p className="text-sm opacity-90 mb-1">{t('Pending Payments')}</p>
              <p className="text-3xl font-bold">{formatCurrency(summary.pending_earnings)}</p>
              <p className="text-sm opacity-75 mt-2">{t('Awaiting payment')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 opacity-90" />
                <ArrowUpRight className="w-5 h-5 opacity-75" />
              </div>
              <p className="text-sm opacity-90 mb-1">{t('Average per Job')}</p>
              <p className="text-3xl font-bold">
                {formatCurrency(summary.total_jobs > 0 ? summary.total_earnings / summary.total_jobs : 0)}
              </p>
              <p className="text-sm opacity-75 mt-2">{t('Based on all jobs')}</p>
            </motion.div>
          </div>
        )}

        {/* Monthly Earnings Chart */}
        {summary && summary.monthly_earnings && summary.monthly_earnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
          >
            <h2 className="mb-6 text-lg font-semibold text-foreground">{t('Monthly Earnings (Last 6 Months)')}</h2>
            <div className="space-y-4">
              {summary.monthly_earnings.map((month, index) => {
                const maxEarning = Math.max(...summary.monthly_earnings.map(m => m.total));
                const percentage = maxEarning > 0 ? (month.total / maxEarning) * 100 : 0;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 shrink-0 text-sm text-muted-foreground sm:w-32">{month.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(month.total)}
                        </span>
                        <span className="text-xs text-muted-foreground">{month.jobs} {t('jobs')}</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Earnings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">{t('Earnings History')}</h2>
            <span className="text-sm text-muted-foreground">{earnings.length} {t('records')}</span>
          </div>

          {earnings.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('No Earnings Yet')}</h3>
              <p className="text-gray-600">{t('Your earnings will appear here once you complete jobs')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{t('Job')}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{t('Farmer')}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{t('Duration')}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{t('Amount')}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{t('Status')}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{t('Date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((earning, index) => (
                    <motion.tr
                      key={earning.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/70 transition-colors hover:bg-[#F1E8D8]/25"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-foreground">{earning.job_title}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(earning.job_start_date)} - {formatDate(earning.job_end_date)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{earning.farmer_name}</td>
                      <td className="py-4 px-4">
                        <div className="text-foreground">{earning.days_worked} {t('days')}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(earning.wage_per_day)}/{t('day')}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-lg font-bold text-foreground">
                          {formatCurrency(earning.total_amount)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            earning.payment_status
                          )}`}
                        >
                          {getStatusIcon(earning.payment_status)}
                          {earning.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {earning.payment_date ? formatDate(earning.payment_date) : '-'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyEarnings;

