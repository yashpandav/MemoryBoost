import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useAppContext } from '../../context/AppContext';
import { getTodayCards, getCardStatus } from '../../utils/spacedRepetition';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export const ProgressChart = () => {
  const { cards } = useAppContext();
  const [learningChartData, setLearningChartData] = useState({
    mastered: 0,
    learning: 0,
    new: 0
  });
  const [reviewChartData, setReviewChartData] = useState({
    pendingReview: 0,
    completedReview: 0
  });

  // Update chart data whenever cards change
  useEffect(() => {
    // Categorize cards based on their status
    const cardCategories = cards.reduce((acc, card) => {
      const status = getCardStatus(card);
      switch (status) {
        case 'Mastered':
          acc.mastered++;
          break;
        case 'Learning':
          acc.learning++;
          break;
        case 'New':
          acc.new++;
          break;
        default:
          break;
      }
      return acc;
    }, { mastered: 0, learning: 0, new: 0 });

    // Get cards due for review using the spaced repetition utility
    const dueCards = getTodayCards(cards);
    const reviewCategories = {
      pendingReview: dueCards.length,
      completedReview: cards.length - dueCards.length
    };

    setLearningChartData(cardCategories);
    setReviewChartData(reviewCategories);
  }, [cards]);

  const learningData = {
    labels: ['Mastered', 'Learning', 'New'],
    datasets: [
      {
        data: [learningChartData.mastered, learningChartData.learning, learningChartData.new],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',  // Emerald green for mastered
          'rgba(245, 158, 11, 0.8)',  // Amber for learning
          'rgba(20, 184, 166, 0.8)',  // Teal for new
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(20, 184, 166, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const reviewData = {
    labels: ['Due for Review', 'Review Completed'],
    datasets: [
      {
        data: [reviewChartData.pendingReview, reviewChartData.completedReview],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)', // Violet for due
          'rgba(59, 130, 246, 0.8)',  // Blue for completed
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif",
            weight: '500',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '75%',
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const totalCards = cards.length;
  const masteryPercentage = totalCards > 0 ? Math.round((learningChartData.mastered / totalCards) * 100) : 0;
  const learningPercentage = totalCards > 0 ? Math.round((learningChartData.learning / totalCards) * 100) : 0;
  const newPercentage = totalCards > 0 ? Math.round((learningChartData.new / totalCards) * 100) : 0;
  const reviewPercentage = totalCards > 0 ? Math.round((reviewChartData.completedReview / totalCards) * 100) : 0;
  const pendingReviewPercentage = totalCards > 0 ? Math.round((reviewChartData.pendingReview / totalCards) * 100) : 0;

  if (totalCards === 0) {
    return (
      <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6">
        <div className="text-center py-8">
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">No Cards Created Yet</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Create some cards to see your learning progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Learning Progress</h2>
        <div className="h-64">
          <Doughnut data={learningData} options={chartOptions} />
        </div>
        <div className="mt-6 text-center space-y-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">Mastered</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{learningChartData.mastered}</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">{masteryPercentage}%</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <p className="font-semibold text-amber-600 dark:text-amber-400">Learning</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{learningChartData.learning}</p>
              <p className="text-sm text-amber-600 dark:text-amber-400">{learningPercentage}%</p>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg relative group">
              <div className="absolute inset-0 bg-teal-100 dark:bg-teal-800/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <p className="font-semibold text-teal-600 dark:text-teal-400">New</p>
                <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{learningChartData.new}</p>
                <p className="text-sm text-teal-600 dark:text-teal-400">{newPercentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Review Status</h2>
        <div className="h-64">
          <Doughnut data={reviewData} options={chartOptions} />
        </div>
        <div className="mt-6 text-center space-y-2">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg">
              <p className="font-semibold text-violet-600 dark:text-violet-400">Due for Review</p>
              <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">{reviewChartData.pendingReview}</p>
              <p className="text-sm text-violet-600 dark:text-violet-400">{pendingReviewPercentage}%</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="font-semibold text-blue-600 dark:text-blue-400">Review Completed</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{reviewChartData.completedReview}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">{reviewPercentage}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};