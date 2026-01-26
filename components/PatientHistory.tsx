'use client';

import { Card } from '@/components/ui/card';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

export function PatientHistory() {
  // This will be populated with actual data from local storage/IndexedDB
  const assessments = [
    {
      id: '1',
      date: '2024-01-15 14:30',
      symptoms: 'Persistent cough, fever, fatigue',
      diagnosis: 'Suspected Pneumonia',
      urgency: 'HIGH' as const,
      confidence: 0.87,
    },
    {
      id: '2',
      date: '2024-01-14 10:15',
      symptoms: 'Localized rash, itching',
      diagnosis: 'Possible Fungal Infection',
      urgency: 'LOW' as const,
      confidence: 0.72,
    },
  ];

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'HIGH':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'MEDIUM':
        return <Clock className="h-5 w-5 text-accent" />;
      case 'LOW':
        return <CheckCircle className="h-5 w-5 text-chart-3" />;
      default:
        return null;
    }
  };

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-destructive text-destructive-foreground';
      case 'MEDIUM':
        return 'bg-accent text-accent-foreground';
      case 'LOW':
        return 'bg-chart-3 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (assessments.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="mb-4 flex justify-center">
          <Clock className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          No Assessments Yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Patient assessment history will appear here. All data is stored locally on
          this device.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Assessment History
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          All assessments are stored locally and never transmitted
        </p>
      </div>

      {assessments.map((assessment) => (
        <Card
          key={assessment.id}
          className="border border-border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-sm font-semibold text-foreground">
                  {assessment.diagnosis}
                </p>
                <span className={`rounded px-2 py-1 text-xs font-medium ${getUrgencyBadge(assessment.urgency)}`}>
                  {assessment.urgency}
                </span>
              </div>
              <p className="mb-2 text-xs text-muted-foreground">{assessment.date}</p>
              <p className="text-sm text-foreground">{assessment.symptoms}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Confidence:</span>
                <div className="flex-1 max-w-32 rounded-full bg-border h-1.5">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${assessment.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-primary">
                  {(assessment.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              {getUrgencyIcon(assessment.urgency)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
