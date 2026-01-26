// Medication Interaction Checker
// Checks for potential drug-drug and drug-condition interactions

export type DrugInteraction = {
  drug1: string;
  drug2: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendation: string;
};

export type ConditionInteraction = {
  medication: string;
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendation: string;
};

// Comprehensive drug interaction database
const DRUG_INTERACTIONS: Record<string, Record<string, DrugInteraction>> = {
  aspirin: {
    warfarin: {
      drug1: 'aspirin',
      drug2: 'warfarin',
      severity: 'severe',
      description: 'Increased bleeding risk when combined',
      recommendation: 'Use alternative pain reliever if possible. Monitor INR closely.',
    },
    ibuprofen: {
      drug1: 'aspirin',
      drug2: 'ibuprofen',
      severity: 'moderate',
      description: 'Increased GI bleeding risk',
      recommendation: 'Avoid combined use. Space doses if necessary.',
    },
  },
  metformin: {
    acarbose: {
      drug1: 'metformin',
      drug2: 'acarbose',
      severity: 'mild',
      description: 'May cause hypoglycemia',
      recommendation: 'Monitor blood glucose regularly.',
    },
  },
  lisinopril: {
    potassium: {
      drug1: 'lisinopril',
      drug2: 'potassium',
      severity: 'severe',
      description: 'Increased risk of hyperkalemia',
      recommendation: 'Monitor potassium levels. Limit potassium supplements.',
    },
  },
  simvastatin: {
    clarithromycin: {
      drug1: 'simvastatin',
      drug2: 'clarithromycin',
      severity: 'severe',
      description: 'Increased statin levels and myopathy risk',
      recommendation: 'Use alternative antibiotic. Monitor CK levels.',
    },
  },
  methotrexate: {
    ibuprofen: {
      drug1: 'methotrexate',
      drug2: 'ibuprofen',
      severity: 'severe',
      description: 'Increased methotrexate toxicity',
      recommendation: 'Use acetaminophen instead. Monitor renal function.',
    },
  },
};

// Drug-condition contraindications
const CONDITION_INTERACTIONS: Record<string, ConditionInteraction[]> = {
  asthma: [
    {
      medication: 'beta-blockers',
      condition: 'asthma',
      severity: 'severe',
      description: 'Beta-blockers can trigger bronchospasm',
      recommendation: 'Use alternative antihypertensive if possible.',
    },
    {
      medication: 'aspirin',
      condition: 'asthma',
      severity: 'moderate',
      description: 'May trigger asthma exacerbations in sensitive patients',
      recommendation: 'Use acetaminophen instead. Test with small dose first.',
    },
  ],
  renal_impairment: [
    {
      medication: 'aminoglycosides',
      condition: 'renal_impairment',
      severity: 'severe',
      description: 'High risk of further renal damage and ototoxicity',
      recommendation: 'Avoid if possible. If necessary, use lowest dose with monitoring.',
    },
    {
      medication: 'metformin',
      condition: 'renal_impairment',
      severity: 'moderate',
      description: 'Lactic acidosis risk with eGFR <30',
      recommendation: 'Adjust dose or discontinue if eGFR <30.',
    },
  ],
  liver_disease: [
    {
      medication: 'statins',
      condition: 'liver_disease',
      severity: 'moderate',
      description: 'Increased hepatotoxicity risk',
      recommendation: 'Monitor LFTs. Use lower doses. Consider alternatives.',
    },
  ],
  pregnancy: [
    {
      medication: 'acne-isotretinoin',
      condition: 'pregnancy',
      severity: 'severe',
      description: 'Severe teratogenic effects',
      recommendation: 'Absolutely contraindicated. Use alternative acne treatment.',
    },
    {
      medication: 'ace-inhibitors',
      condition: 'pregnancy',
      severity: 'severe',
      description: 'Risk of fetal renal dysfunction and oligohydramnios',
      recommendation: 'Avoid in 2nd and 3rd trimester. Use alternative antihypertensive.',
    },
  ],
};

export const checkDrugInteractions = (medications: string[]): DrugInteraction[] => {
  const interactions: DrugInteraction[] = [];
  const normalizedMeds = medications.map((m) => m.toLowerCase().trim());

  for (let i = 0; i < normalizedMeds.length; i++) {
    for (let j = i + 1; j < normalizedMeds.length; j++) {
      const drug1 = normalizedMeds[i];
      const drug2 = normalizedMeds[j];

      // Check both directions
      if (DRUG_INTERACTIONS[drug1]?.[drug2]) {
        interactions.push(DRUG_INTERACTIONS[drug1][drug2]);
      } else if (DRUG_INTERACTIONS[drug2]?.[drug1]) {
        interactions.push(DRUG_INTERACTIONS[drug2][drug1]);
      }
    }
  }

  return interactions;
};

export const checkConditionInteractions = (
  medications: string[],
  conditions: string[]
): ConditionInteraction[] => {
  const interactions: ConditionInteraction[] = [];
  const normalizedMeds = medications.map((m) => m.toLowerCase().trim());
  const normalizedConditions = conditions.map((c) => c.toLowerCase().trim());

  normalizedConditions.forEach((condition) => {
    if (CONDITION_INTERACTIONS[condition]) {
      normalizedMeds.forEach((med) => {
        const match = CONDITION_INTERACTIONS[condition].find((interaction) =>
          med.includes(interaction.medication.toLowerCase())
        );
        if (match) {
          interactions.push(match);
        }
      });
    }
  });

  return interactions;
};

export const getAllInteractions = (
  medications: string[],
  conditions: string[] = []
) => {
  return {
    drugInteractions: checkDrugInteractions(medications),
    conditionInteractions: checkConditionInteractions(medications, conditions),
  };
};
