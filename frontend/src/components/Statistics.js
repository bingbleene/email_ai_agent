/**
 * Statistics Component
 * Displays email statistics dashboard
 */
import React, { useState, useEffect } from 'react';
import { emailApi } from '../services/api';
import { BarChart2, PieChart, TrendingUp, Mail, Loader } from 'lucide-react';

const Statistics = ({ userId, refresh }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, [userId, refresh]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailApi.getStats(userId);
      setStats(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats-loading">
        <Loader className="spin" size={24} />
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const { total, important, by_category } = stats;

  // Calculate percentages for categories
  const categoryData = Object.entries(by_category || {}).map(([name, count]) => ({
    name,
    count,
    percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
  }));

  const getCategoryColor = (category) => {
    const colors = {
      Work: '#3B82F6',
      Personal: '#10B981',
      Spam: '#EF4444',
      Newsletter: '#8B5CF6',
      Announcement: '#F59E0B',
      Support: '#06B6D4',
      Financial: '#F59E0B',
    };
    return colors[category] || '#6B7280';
  };

  return (
    <div className="statistics-container">
      <div className="stats-header">
        <h2>
          <BarChart2 size={24} />
          Statistics
        </h2>
      </div>

      <div className="stats-grid">
        {/* Total Emails */}
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3B82F6' }}>
            <Mail size={24} color="white" />
          </div>
          <div className="stat-content">
            <h3>{total}</h3>
            <p>Total Emails</p>
          </div>
        </div>

        {/* Important Emails */}
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#EF4444' }}>
            <TrendingUp size={24} color="white" />
          </div>
          <div className="stat-content">
            <h3>{important}</h3>
            <p>Important</p>
          </div>
        </div>

        {/* Importance Ratio */}
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10B981' }}>
            <PieChart size={24} color="white" />
          </div>
          <div className="stat-content">
            <h3>{total > 0 ? ((important / total) * 100).toFixed(1) : 0}%</h3>
            <p>Important Ratio</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="category-breakdown">
          <h3>By Category</h3>
          <div className="category-bars">
            {categoryData
              .sort((a, b) => b.count - a.count)
              .map((cat) => (
                <div key={cat.name} className="category-bar-item">
                  <div className="category-info">
                    <span className="category-name">{cat.name}</span>
                    <span className="category-count">
                      {cat.count} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: getCategoryColor(cat.name),
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
