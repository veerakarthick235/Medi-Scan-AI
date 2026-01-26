'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getAllAssessments, type Assessment } from '@/lib/db';
import { calculateMetrics, getTrendAnalysis, getDailyStats, type AnalyticsMetrics } from '@/lib/analytics';
import { t } from '@/lib/i18n';

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllAssessments();
        setAssessments(data);
        const calculatedMetrics = calculateMetrics(data);
        setMetrics(calculatedMetrics);
      } catch (error) {
        console.error('[v0] Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (!metrics || metrics.totalAssessments === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">{t('analytics.title')} - No data yet</p>
      </Card>
    );
  }

  const dailyStats = getDailyStats(assessments);
  const trend = getTrendAnalysis(assessments);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">{t('analytics.totalAssessments')}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{metrics.totalAssessments}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">{t('analytics.assessmentsToday')}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{metrics.assessmentsTodayCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">{t('analytics.avgConfidence')}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {(metrics.averageConfidenceScore * 100).toFixed(1)}%
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">{t('analytics.highUrgencyRate')}</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {metrics.highUrgencyPercentage.toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Urgency Distribution */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">{t('analytics.urgencyDistribution')}</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-green-300 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-900">Low Priority</p>
            <p className="mt-2 text-2xl font-bold text-green-700">
              {metrics.urgencyDistribution.LOW}
            </p>
            <p className="mt-1 text-xs text-green-700">
              {((metrics.urgencyDistribution.LOW / metrics.totalAssessments) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
            <p className="text-sm font-medium text-yellow-900">Medium Priority</p>
            <p className="mt-2 text-2xl font-bold text-yellow-700">
              {metrics.urgencyDistribution.MEDIUM}
            </p>
            <p className="mt-1 text-xs text-yellow-700">
              {((metrics.urgencyDistribution.MEDIUM / metrics.totalAssessments) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg border border-red-300 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">High Priority</p>
            <p className="mt-2 text-2xl font-bold text-red-700">{metrics.urgencyDistribution.HIGH}</p>
            <p className="mt-1 text-xs text-red-700">
              {((metrics.urgencyDistribution.HIGH / metrics.totalAssessments) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      {/* Top Diagnoses */}
      {metrics.topDiagnoses.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">{t('analytics.commonDiagnoses')}</h3>
          <div className="space-y-3">
            {metrics.topDiagnoses.map((diagnosis, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{diagnosis.diagnosis}</p>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${diagnosis.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="font-semibold text-foreground">{diagnosis.count}</p>
                  <p className="text-xs text-muted-foreground">{diagnosis.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Trend Analysis */}
      <Card className="border-blue-300 bg-blue-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-blue-900">Trend Analysis</h3>
        <p className="text-sm text-blue-900">{trend}</p>
      </Card>

      {/* Processing Statistics */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Processing Performance</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Average Processing Time</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {metrics.averageProcessingTime.toFixed(2)}s
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Median Confidence Score</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {(metrics.medianConfidenceScore * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      {/* Daily Assessment Trend */}
      {dailyStats.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Daily Assessments (Last 30 Days)</h3>
          <div className="space-y-2">
            {dailyStats.slice(-7).map((day, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{day.date}</p>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <div className="h-6 w-12 rounded bg-green-200" />
                    <span className="text-xs text-muted-foreground">{day.low}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-6 w-12 rounded bg-yellow-200" />
                    <span className="text-xs text-muted-foreground">{day.medium}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-6 w-12 rounded bg-red-200" />
                    <span className="text-xs text-muted-foreground">{day.high}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
