'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  checkDrugInteractions,
  checkConditionInteractions,
  type DrugInteraction,
  type ConditionInteraction,
} from '@/lib/medication-checker';
import { t } from '@/lib/i18n';

export function MedicationChecker() {
  const [medications, setMedications] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [drugInteractions, setDrugInteractions] = useState<DrugInteraction[]>([]);
  const [conditionInteractions, setConditionInteractions] = useState<ConditionInteraction[]>([]);
  const [checked, setChecked] = useState(false);

  const addMedication = () => {
    if (newMedication.trim()) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const checkInteractions = () => {
    const drugInters = checkDrugInteractions(medications);
    const condInters = checkConditionInteractions(medications, conditions);
    setDrugInteractions(drugInters);
    setConditionInteractions(condInters);
    setChecked(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'mild':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">{t('medications.title')}</h2>

        <div className="space-y-4">
          {/* Medications Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t('medications.addMedication')}
            </label>
            <div className="flex gap-2">
              <Input
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') addMedication();
                }}
                placeholder="e.g., Aspirin, Warfarin"
                className="flex-1"
              />
              <Button onClick={addMedication} variant="outline">
                Add
              </Button>
            </div>
          </div>

          {/* Medications List */}
          {medications.length > 0 && (
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-2 text-sm font-medium text-foreground">Current Medications:</p>
              <div className="flex flex-wrap gap-2">
                {medications.map((med, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground"
                  >
                    {med}
                    <button
                      onClick={() => removeMedication(index)}
                      className="font-bold hover:opacity-70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditions Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t('medications.addCondition')}
            </label>
            <div className="flex gap-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') addCondition();
                }}
                placeholder="e.g., Asthma, Renal Impairment"
                className="flex-1"
              />
              <Button onClick={addCondition} variant="outline">
                Add
              </Button>
            </div>
          </div>

          {/* Conditions List */}
          {conditions.length > 0 && (
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-2 text-sm font-medium text-foreground">Current Conditions:</p>
              <div className="flex flex-wrap gap-2">
                {conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground"
                  >
                    {condition}
                    <button
                      onClick={() => removeCondition(index)}
                      className="font-bold hover:opacity-70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Check Button */}
          <Button
            onClick={checkInteractions}
            disabled={medications.length < 2 && conditions.length === 0}
            className="w-full"
          >
            {t('medications.checkInteractions')}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {checked && (
        <>
          {/* Drug Interactions */}
          {drugInteractions.length > 0 ? (
            <Card className="border-red-300 bg-red-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-red-900">
                {t('medications.drugInteractions')}
              </h3>
              <div className="space-y-3">
                {drugInteractions.map((interaction, idx) => (
                  <div key={idx} className={`rounded-lg border p-4 ${getSeverityColor(interaction.severity)}`}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-semibold">
                        {interaction.drug1} + {interaction.drug2}
                      </p>
                      <span className="rounded px-2 py-1 text-xs font-bold capitalize">
                        {interaction.severity}
                      </span>
                    </div>
                    <p className="mb-2 text-sm">{interaction.description}</p>
                    <p className="text-sm font-medium">Recommendation: {interaction.recommendation}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            drugInteractions.length === 0 &&
            medications.length >= 2 && (
              <Card className="border-green-300 bg-green-50 p-6">
                <p className="text-sm font-medium text-green-900">
                  ✓ {t('medications.noInteractions')} between checked medications
                </p>
              </Card>
            )
          )}

          {/* Condition Interactions */}
          {conditionInteractions.length > 0 && (
            <Card className="border-yellow-300 bg-yellow-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-yellow-900">
                {t('medications.conditionInteractions')}
              </h3>
              <div className="space-y-3">
                {conditionInteractions.map((interaction, idx) => (
                  <div key={idx} className={`rounded-lg border p-4 ${getSeverityColor(interaction.severity)}`}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-semibold">
                        {interaction.medication} + {interaction.condition}
                      </p>
                      <span className="rounded px-2 py-1 text-xs font-bold capitalize">
                        {interaction.severity}
                      </span>
                    </div>
                    <p className="mb-2 text-sm">{interaction.description}</p>
                    <p className="text-sm font-medium">Recommendation: {interaction.recommendation}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
