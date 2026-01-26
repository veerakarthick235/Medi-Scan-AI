'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import {
  exportAssessmentAsCSV,
  exportAssessmentAsJSON,
  exportAssessmentAsText,
  printHTMLReport,
} from '@/lib/export';
import type { Assessment } from '@/lib/db';

interface TriageResult {
  preliminary_diagnosis: string;
  urgency_level: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence_score: number;
  reasoning: string;
  recommended_actions: string[];
  processing_time: number;
}

interface TriageResultsProps {
  result: TriageResult;
  onNewAssessment: () => void;
}

export function TriageResults({ result, onNewAssessment }: TriageResultsProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const assessment: Assessment = {
    id: `assessment_${Date.now()}`,
    patientName: 'Patient',
    date: new Date().toISOString(),
    symptoms: '',
    diagnosis: result.preliminary_diagnosis,
    urgencyLevel: result.urgency_level,
    confidenceScore: result.confidence_score,
    reasoning: result.reasoning,
    recommendedActions: result.recommended_actions,
    processingTime: result.processing_time,
  };

  const handleExportCSV = () => {
    exportAssessmentAsCSV(assessment);
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    exportAssessmentAsJSON(assessment);
    setShowExportMenu(false);
  };

  const handleExportText = () => {
    exportAssessmentAsText(assessment);
    setShowExportMenu(false);
  };

  const handlePrintHTML = () => {
    printHTMLReport(assessment);
    setShowExportMenu(false);
  };

  const handleSaveAndPrint = () => {
    // Placeholder for handleSaveAndPrint functionality
    console.log('Save and Print functionality not implemented');
  };

  const getUrgencyStyles = (level: string) => {
    switch (level) {
      case 'HIGH':
        return {
          badge: 'bg-destructive text-destructive-foreground',
          border: 'border-destructive',
          icon: AlertCircle,
        };
      case 'MEDIUM':
        return {
          badge: 'bg-accent text-accent-foreground',
          border: 'border-accent',
          icon: Clock,
        };
      case 'LOW':
        return {
          badge: 'bg-chart-3 text-white',
          border: 'border-chart-3',
          icon: CheckCircle,
        };
      default:
        return {
          badge: 'bg-muted text-muted-foreground',
          border: 'border-border',
          icon: AlertCircle,
        };
    }
  };

  const styles = getUrgencyStyles(result.urgency_level);
  const UrgencyIcon = styles.icon;
  const urgencyText = {
    HIGH: 'Immediate Attention Required',
    MEDIUM: 'Urgent Follow-up Needed',
    LOW: 'Routine Care',
  };

  return (
    <div className="space-y-6">
      {/* Urgency Alert */}
      <Card className={`border-2 border-l-8 ${styles.border} p-6`}>
        <div className="flex items-start gap-4">
          <UrgencyIcon className="mt-1 h-6 w-6 flex-shrink-0 text-accent" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">Triage Assessment</h2>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${styles.badge}`}>
                {result.urgency_level}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {urgencyText[result.urgency_level as keyof typeof urgencyText]}
            </p>
          </div>
        </div>
      </Card>

      {/* Diagnosis */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Preliminary Diagnosis
        </h3>
        <p className="mb-4 rounded-lg bg-secondary/20 p-4 text-base text-foreground">
          {result.preliminary_diagnosis}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Confidence Score:</span>
          <div className="flex-1 rounded-full bg-border h-2">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${result.confidence_score * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-primary">
            {(result.confidence_score * 100).toFixed(0)}%
          </span>
        </div>
      </Card>

      {/* Clinical Reasoning */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Clinical Reasoning
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {result.reasoning}
        </p>
      </Card>

      {/* Recommended Actions */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Recommended Actions
        </h3>
        <ul className="space-y-3">
          {result.recommended_actions.map((action, index) => (
            <li
              key={index}
              className="flex gap-3 rounded-lg border border-border p-3"
            >
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm text-foreground">{action}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Processing Info */}
      <div className="flex items-center justify-between rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        <span>Processing completed in {result.processing_time.toFixed(2)}s</span>
        <span className="text-xs">All analysis performed locally</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onNewAssessment}
          className="flex-1 bg-primary py-6 text-base font-semibold"
        >
          New Assessment
        </Button>
        <div className="relative flex-1">
          <Button
            onClick={() => setShowExportMenu(!showExportMenu)}
            variant="secondary"
            className="flex-1 py-6 text-base font-semibold"
          >
            <Download className="mr-2 h-4 w-4" />
            Save & Export
          </Button>
          {showExportMenu && (
            <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg">
              <button
                onClick={handlePrintHTML}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
              >
                Print as PDF
              </button>
              <button
                onClick={handleExportText}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
              >
                Export as Text
              </button>
              <button
                onClick={handleExportCSV}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
              >
                Export as CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
              >
                Export as JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-xs font-semibold text-destructive">⚠ Clinical Disclaimer</p>
        <p className="mt-2 text-xs text-muted-foreground">
          This assessment is a preliminary AI-assisted tool and should not replace clinical
          judgment by qualified healthcare professionals. Always refer to a licensed physician
          for definitive diagnosis and treatment decisions.
        </p>
      </div>
    </div>
  );
}
