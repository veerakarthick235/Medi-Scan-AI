// Analytics Module for Real-time Dashboards
// Tracks assessment metrics and generates insights

import type { Assessment } from './db';

export type AnalyticsMetrics = {
  totalAssessments: number;
  assessmentsTodayCount: number;
  highUrgencyCount: number;
  highUrgencyPercentage: number;
  averageConfidenceScore: number;
  medianConfidenceScore: number;
  averageProcessingTime: number;
  urgencyDistribution: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
  topDiagnoses: Array<{
    diagnosis: string;
    count: number;
    percentage: number;
  }>;
  diagnosticAccuracy: {
    date: string;
    count: number;
  }[];
};

export const calculateMetrics = (assessments: Assessment[]): AnalyticsMetrics => {
  if (assessments.length === 0) {
    return {
      totalAssessments: 0,
      assessmentsTodayCount: 0,
      highUrgencyCount: 0,
      highUrgencyPercentage: 0,
      averageConfidenceScore: 0,
      medianConfidenceScore: 0,
      averageProcessingTime: 0,
      urgencyDistribution: { LOW: 0, MEDIUM: 0, HIGH: 0 },
      topDiagnoses: [],
      diagnosticAccuracy: [],
    };
  }

  const today = new Date().toDateString();
  const todayAssessments = assessments.filter(
    (a) => new Date(a.date).toDateString() === today
  );

  // Urgency distribution
  const urgencyDistribution = {
    LOW: assessments.filter((a) => a.urgencyLevel === 'LOW').length,
    MEDIUM: assessments.filter((a) => a.urgencyLevel === 'MEDIUM').length,
    HIGH: assessments.filter((a) => a.urgencyLevel === 'HIGH').length,
  };

  // Confidence scores
  const confidenceScores = assessments.map((a) => a.confidenceScore).sort((a, b) => a - b);
  const averageConfidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;
  const medianConfidence =
    confidenceScores.length % 2 === 0
      ? (confidenceScores[confidenceScores.length / 2 - 1] +
          confidenceScores[confidenceScores.length / 2]) /
        2
      : confidenceScores[Math.floor(confidenceScores.length / 2)];

  // Top diagnoses
  const diagnosisMap = new Map<string, number>();
  assessments.forEach((a) => {
    const count = diagnosisMap.get(a.diagnosis) || 0;
    diagnosisMap.set(a.diagnosis, count + 1);
  });

  const topDiagnoses = Array.from(diagnosisMap.entries())
    .map(([diagnosis, count]) => ({
      diagnosis,
      count,
      percentage: (count / assessments.length) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Processing time average
  const averageProcessingTime =
    assessments.reduce((sum, a) => sum + a.processingTime, 0) / assessments.length;

  // Assessments over time
  const dateMap = new Map<string, number>();
  assessments.forEach((a) => {
    const date = new Date(a.date).toLocaleDateString();
    const count = dateMap.get(date) || 0;
    dateMap.set(date, count + 1);
  });

  const diagnosticAccuracy = Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30); // Last 30 days

  return {
    totalAssessments: assessments.length,
    assessmentsTodayCount: todayAssessments.length,
    highUrgencyCount: urgencyDistribution.HIGH,
    highUrgencyPercentage: (urgencyDistribution.HIGH / assessments.length) * 100,
    averageConfidenceScore: averageConfidence,
    medianConfidenceScore: medianConfidence,
    averageProcessingTime,
    urgencyDistribution,
    topDiagnoses,
    diagnosticAccuracy,
  };
};

export const getUrgencySummary = (metrics: AnalyticsMetrics) => {
  return {
    low: metrics.urgencyDistribution.LOW,
    medium: metrics.urgencyDistribution.MEDIUM,
    high: metrics.urgencyDistribution.HIGH,
  };
};

export const getTrendAnalysis = (assessments: Assessment[]): string => {
  if (assessments.length < 2) {
    return 'Insufficient data for trend analysis';
  }

  const recentAssessments = assessments.slice(-10);
  const olderAssessments = assessments.slice(0, 10);

  const recentHighUrgency =
    recentAssessments.filter((a) => a.urgencyLevel === 'HIGH').length /
    recentAssessments.length;
  const olderHighUrgency =
    olderAssessments.filter((a) => a.urgencyLevel === 'HIGH').length / olderAssessments.length;

  const trend = recentHighUrgency - olderHighUrgency;

  if (trend > 0.1) {
    return 'High urgency cases increasing - monitor closely';
  } else if (trend < -0.1) {
    return 'High urgency cases decreasing - positive trend';
  } else {
    return 'Stable urgency case distribution';
  }
};

export const getDailyStats = (assessments: Assessment[]): {
  date: string;
  total: number;
  high: number;
  medium: number;
  low: number;
}[] => {
  const dateMap = new Map<
    string,
    { total: number; high: number; medium: number; low: number }
  >();

  assessments.forEach((a) => {
    const date = new Date(a.date).toLocaleDateString();
    const stats = dateMap.get(date) || { total: 0, high: 0, medium: 0, low: 0 };

    stats.total += 1;
    if (a.urgencyLevel === 'HIGH') stats.high += 1;
    else if (a.urgencyLevel === 'MEDIUM') stats.medium += 1;
    else stats.low += 1;

    dateMap.set(date, stats);
  });

  return Array.from(dateMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
