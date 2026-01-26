import { NextRequest, NextResponse } from 'next/server';

// Mock triage assessment - replaces FastAPI backend for this deployment
function assessSymptoms(symptoms: string): {
  preliminary_diagnosis: string;
  urgency_level: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence_score: number;
  reasoning: string;
  recommended_actions: string[];
} {
  const lowerSymptoms = symptoms.toLowerCase();
  
  // Red flag conditions (HIGH urgency)
  const redFlags = [
    'chest pain',
    'difficulty breathing',
    'shortness of breath',
    'severe headache',
    'loss of consciousness',
    'bleeding',
    'severe bleeding',
    'choking',
    'unable to breathe',
    'severe abdominal pain',
    'stroke symptoms',
    'paralysis',
  ];
  
  // Yellow flag conditions (MEDIUM urgency)
  const yellowFlags = [
    'fever',
    'persistent cough',
    'severe symptoms',
    'vomiting',
    'abdominal pain',
    'severe pain',
    'dizziness',
    'confusion',
    'jaundice',
  ];
  
  // Check for red flags
  const hasRedFlag = redFlags.some(flag => lowerSymptoms.includes(flag));
  if (hasRedFlag) {
    return {
      preliminary_diagnosis: 'Emergency condition requiring immediate medical attention',
      urgency_level: 'HIGH',
      confidence_score: 0.95,
      reasoning: 'Critical red flag symptoms detected. Patient requires immediate referral to higher-level care facility.',
      recommended_actions: [
        'IMMEDIATE referral to hospital/emergency department',
        'Stabilize patient vital signs',
        'Monitor continuously',
        'Prepare for emergency transport',
      ],
    };
  }
  
  // Check for yellow flags
  const hasYellowFlag = yellowFlags.some(flag => lowerSymptoms.includes(flag));
  if (hasYellowFlag) {
    return {
      preliminary_diagnosis: 'Moderate condition requiring close monitoring',
      urgency_level: 'MEDIUM',
      confidence_score: 0.78,
      reasoning: 'Yellow flag symptoms detected. Patient requires thorough evaluation and may need referral.',
      recommended_actions: [
        'Perform detailed clinical examination',
        'Monitor vital signs regularly',
        'Consider referral to specialist if symptoms persist',
        'Provide symptomatic treatment',
        'Follow-up within 48-72 hours',
      ],
    };
  }
  
  // Default low urgency
  return {
    preliminary_diagnosis: 'Minor condition',
    urgency_level: 'LOW',
    confidence_score: 0.65,
    reasoning: 'No critical flags detected. Symptoms suggest non-urgent condition.',
    recommended_actions: [
      'Provide basic supportive care',
      'Recommend rest and hydration',
      'Monitor symptoms for progression',
      'Follow-up if symptoms worsen',
      'Patient education and discharge instructions',
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const symptoms = formData.get('text_description') as string;
    
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!symptoms || symptoms.trim().length === 0) {
      return NextResponse.json(
        { error: 'No symptoms provided' },
        { status: 400 }
      );
    }
    
    const assessment = assessSymptoms(symptoms);
    
    return NextResponse.json({
      ...assessment,
      processing_time: 1.23, // Mock processing time
    });
  } catch (error) {
    console.error('[v0] Triage API error:', error);
    return NextResponse.json(
      { error: 'Assessment failed' },
      { status: 500 }
    );
  }
}
