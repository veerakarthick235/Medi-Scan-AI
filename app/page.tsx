'use client';

import { useState } from 'react';
import { TriageForm } from '@/components/TriageForm';
import { TriageResults } from '@/components/TriageResults';
import { PatientHistory } from '@/components/PatientHistory';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assess">New Assessment</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>
              Results
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
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
        </Tabs>
      </main>
    </div>
  );
}
