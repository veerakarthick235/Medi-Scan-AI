'use client';

import { useEffect, useState } from 'react';
import { TriageForm } from '@/components/TriageForm';
import { TriageResults } from '@/components/TriageResults';
import { PatientHistory } from '@/components/PatientHistory';
import { Header } from '@/components/Header';
import { MedicationChecker } from '@/components/MedicationChecker';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveAssessment, initDB } from '@/lib/db';
import type { Assessment } from '@/lib/db';

type TriageResult = {
  preliminary_diagnosis: string;
  urgency_level: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence_score: number;
  reasoning: string;
  recommended_actions: string[];
  processing_time: number;
};

export default function Home() {
  const [result, setResult] = useState<TriageResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('assess');
  const [dbReady, setDbReady] = useState(false);

  // Initialize database and service worker
  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
        setDbReady(true);

        // Register service worker for offline mode
        if ('serviceWorker' in navigator) {
          try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('[v0] Service Worker registered for offline mode');
          } catch (err) {
            console.log('[v0] Service Worker registration failed:', err);
          }
        }
      } catch (err) {
        console.error('[v0] Failed to initialize app:', err);
      }
    };

    init();
  }, []);

  const handleTriageSubmit = async (formData: {
    symptoms: string;
    image?: File;
    audio?: File;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append('text_description', formData.symptoms);
      if (formData.image) data.append('image', formData.image);
      if (formData.audio) data.append('audio', formData.audio);

      // Call Next.js API route at /api/triage
      const response = await fetch('/api/triage', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Assessment failed');
      }
      const triageResult = await response.json();
      setResult(triageResult);

      // Save to database
      if (dbReady) {
        try {
          const assessment: Assessment = {
            id: `assessment_${Date.now()}`,
            patientName: 'Patient',
            date: new Date().toISOString(),
            symptoms: formData.symptoms,
            diagnosis: triageResult.preliminary_diagnosis,
            urgencyLevel: triageResult.urgency_level,
            confidenceScore: triageResult.confidence_score,
            reasoning: triageResult.reasoning,
            recommendedActions: triageResult.recommended_actions,
            processingTime: triageResult.processing_time,
          };
          await saveAssessment(assessment);
          console.log('[v0] Assessment saved to database');
        } catch (dbErr) {
          console.error('[v0] Failed to save assessment:', dbErr);
        }
      }

      setActiveTab('results');
    } catch (error) {
      console.error('[v0] Triage error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Assessment failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        )}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Language</h3>
          <LanguageSelector />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="assess">New Assessment</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>
              Results
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="assess" className="mt-6">
            <TriageForm
              onSubmit={handleTriageSubmit}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {result && (
              <TriageResults
                result={result}
                onNewAssessment={() => {
                  setResult(null);
                  setActiveTab('assess');
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <PatientHistory />
          </TabsContent>

          <TabsContent value="medications" className="mt-6">
            <MedicationChecker />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
