"""
Triage Scoring Engine for MediScan AI
Calculates urgency levels and generates clinical action recommendations
"""

import logging
from typing import Tuple, List, Dict, Optional

logger = logging.getLogger(__name__)


class TriageScorer:
    """
    Clinical decision rules engine for urgency assessment.
    Implements evidence-based triage protocols adapted for rural clinic settings.
    """
    
    # Urgency level definitions
    URGENCY_HIGH = "HIGH"
    URGENCY_MEDIUM = "MEDIUM"
    URGENCY_LOW = "LOW"
    
    # Red flag indicators
    RED_FLAGS = {
        "respiratory": [
            "severe respiratory distress",
            "stridor",
            "accessory muscle use",
            "inability to speak in sentences",
            "cyanosis",
            "severe hypoxia"
        ],
        "cardiovascular": [
            "severe hypotension",
            "shock",
            "uncontrolled arrhythmia",
            "acute coronary symptoms"
        ],
        "neurological": [
            "altered consciousness",
            "severe headache with fever",
            "meningeal signs",
            "seizures",
            "severe confusion"
        ],
        "infection": [
            "septic shock",
            "rapidly spreading cellulitis",
            "severe abscess",
            "necrotizing infection"
        ],
        "metabolic": [
            "severe dehydration",
            "diabetic emergency",
            "severe electrolyte imbalance"
        ],
        "hemorrhage": [
            "uncontrolled bleeding",
            "hemodynamic instability",
            "visible major vessel injury"
        ]
    }
    
    # Yellow flag indicators
    YELLOW_FLAGS = {
        "respiratory": [
            "persistent cough >2 weeks",
            "moderate respiratory distress",
            "significant hypoxia",
            "productive cough with fever"
        ],
        "infection": [
            "spreading cellulitis",
            "draining abscess",
            "lymphangitis",
            "signs of secondary infection"
        ],
        "wound": [
            "large or deep laceration",
            "contaminated wound",
            "animal bite",
            "signs of infection"
        ],
        "systemic": [
            "high fever with other symptoms",
            "severe dehydration",
            "significant malaise"
        ]
    }
    
    def __init__(self):
        """Initialize TriageScorer"""
        logger.info("TriageScorer initialized")
    
    def calculate_urgency_level(
        self,
        symptoms: str,
        visual_severity: Optional[Dict] = None,
        audio_indicators: Optional[Dict] = None,
        llm_assessment: Optional[Dict] = None
    ) -> Tuple[str, float]:
        """
        Calculate urgency level based on multimodal clinical data.
        
        Args:
            symptoms: Patient symptom description
            visual_severity: Visual examination findings
            audio_indicators: Audio examination findings
            llm_assessment: LLM-generated assessment
            
        Returns:
            Tuple of (urgency_level, urgency_score)
        """
        urgency_score = 0.0
        
        # 1. Check for red flags (HIGH urgency)
        red_flags_found = self._check_red_flags(
            symptoms,
            visual_severity,
            audio_indicators
        )
        if red_flags_found:
            urgency_score = 0.8 + (len(red_flags_found) * 0.05)
            logger.warning(f"Red flags detected: {red_flags_found}")
            return self.URGENCY_HIGH, min(urgency_score, 1.0)
        
        # 2. Check for yellow flags (MEDIUM urgency)
        yellow_flags_found = self._check_yellow_flags(
            symptoms,
            visual_severity,
            audio_indicators
        )
        if yellow_flags_found:
            urgency_score = 0.5
            logger.info(f"Yellow flags detected: {yellow_flags_found}")
            return self.URGENCY_MEDIUM, urgency_score
        
        # 3. Assess respiratory compromise
        if audio_indicators and self._has_respiratory_concern(audio_indicators):
            return self.URGENCY_MEDIUM, 0.55
        
        # 4. Assess wound/infection severity
        if visual_severity and self._has_infection_concern(visual_severity):
            return self.URGENCY_MEDIUM, 0.60
        
        # 5. Default to LOW urgency with routine follow-up
        return self.URGENCY_LOW, 0.2
    
    def _check_red_flags(
        self,
        symptoms: str,
        visual_severity: Optional[Dict] = None,
        audio_indicators: Optional[Dict] = None
    ) -> List[str]:
        """
        Check for red flag indicators requiring immediate attention.
        
        Returns:
            List of detected red flags
        """
        detected_flags = []
        symptoms_lower = symptoms.lower()
        
        # Check respiratory red flags
        for flag in self.RED_FLAGS["respiratory"]:
            if flag in symptoms_lower:
                detected_flags.append(f"respiratory: {flag}")
        
        # Check audio indicators
        if audio_indicators:
            if audio_indicators.get("requires_respiratory_support"):
                detected_flags.append("respiratory: labored breathing")
            
            respiratory_patterns = audio_indicators.get("respiratory_patterns", {})
            if respiratory_patterns.get("wheezing"):
                detected_flags.append("respiratory: wheezing")
            if respiratory_patterns.get("stridor"):
                detected_flags.append("respiratory: stridor")
        
        # Check visual severity
        if visual_severity:
            if visual_severity.get("requires_immediate_attention"):
                detected_flags.append("visual: immediate attention required")
        
        # Check neurological symptoms
        neuro_symptoms = ["loss of consciousness", "confusion", "severe headache", "seizure"]
        for symptom in neuro_symptoms:
            if symptom in symptoms_lower:
                detected_flags.append(f"neurological: {symptom}")
        
        # Check cardiovascular symptoms
        cardiac_symptoms = ["severe chest pain", "palpitations with syncope", "severe weakness"]
        for symptom in cardiac_symptoms:
            if symptom in symptoms_lower:
                detected_flags.append(f"cardiovascular: {symptom}")
        
        return detected_flags
    
    def _check_yellow_flags(
        self,
        symptoms: str,
        visual_severity: Optional[Dict] = None,
        audio_indicators: Optional[Dict] = None
    ) -> List[str]:
        """
        Check for yellow flag indicators requiring urgent follow-up.
        
        Returns:
            List of detected yellow flags
        """
        detected_flags = []
        symptoms_lower = symptoms.lower()
        
        # Check respiratory yellow flags
        for flag in self.YELLOW_FLAGS["respiratory"]:
            if flag in symptoms_lower:
                detected_flags.append(f"respiratory: {flag}")
        
        # Check infection yellow flags
        for flag in self.YELLOW_FLAGS["infection"]:
            if flag in symptoms_lower:
                detected_flags.append(f"infection: {flag}")
        
        # Check visual indicators
        if visual_severity:
            severity = visual_severity.get("severity", "").lower()
            if severity == "severe":
                detected_flags.append("visual: severe findings")
            
            if visual_severity.get("infection_indicators"):
                detected_flags.append("visual: signs of infection")
        
        # Check for systemic symptoms
        systemic_symptoms = ["high fever", "severe fatigue", "severe dehydration"]
        for symptom in systemic_symptoms:
            if symptom in symptoms_lower:
                detected_flags.append(f"systemic: {symptom}")
        
        return detected_flags
    
    def _has_respiratory_concern(self, audio_indicators: Dict) -> bool:
        """Check if respiratory findings indicate concern"""
        if not audio_indicators:
            return False
        
        patterns = audio_indicators.get("respiratory_patterns", {})
        
        # Respiratory distress indicators
        if patterns.get("labored_breathing"):
            return True
        if patterns.get("wheezing") or patterns.get("stridor"):
            return True
        
        # Abnormal breathing patterns
        if patterns.get("abnormal_patterns"):
            return True
        
        # Cough-related concerns
        cough_type = audio_indicators.get("cough_type", "").lower()
        if cough_type == "persistent" or cough_type == "severe":
            return True
        
        return False
    
    def _has_infection_concern(self, visual_severity: Dict) -> bool:
        """Check if visual findings indicate infection concern"""
        if not visual_severity:
            return False
        
        # Check for infection indicators
        if visual_severity.get("infection_indicators"):
            return True
        
        # Check severity
        severity = visual_severity.get("severity", "").lower()
        if severity in ["severe", "moderate"]:
            return True
        
        # Check affected area
        affected_area = visual_severity.get("affected_area_percent", 0)
        if affected_area > 20:  # More than 20% affected
            return True
        
        return False
    
    def generate_action_recommendations(
        self,
        urgency_level: str,
        diagnosis: str,
        clinical_flags: Optional[List[str]] = None
    ) -> List[str]:
        """
        Generate specific action recommendations based on urgency level.
        
        Args:
            urgency_level: HIGH, MEDIUM, or LOW
            diagnosis: Preliminary diagnosis
            clinical_flags: List of detected clinical flags
            
        Returns:
            List of recommended actions
        """
        actions = []
        
        if urgency_level == self.URGENCY_HIGH:
            actions = [
                "IMMEDIATE: Activate emergency protocols",
                "Ensure airway patency and monitor oxygen saturation",
                "Establish IV access if available",
                "Contact regional hospital for emergency referral",
                "Provide supportive care while arranging transport",
                "Document all findings and interventions",
                "Prepare for potential resuscitation"
            ]
        
        elif urgency_level == self.URGENCY_MEDIUM:
            actions = [
                "URGENT: Schedule follow-up within 24-48 hours",
                "Monitor vital signs at regular intervals",
                "Initiate empiric treatment based on clinical diagnosis",
                "Consider imaging if facilities available",
                "Educate patient on warning signs for escalation",
                "Plan for specialist referral if condition worsens",
                "Ensure medication compliance and follow-up arrangement"
            ]
        
        else:  # LOW urgency
            actions = [
                "ROUTINE: Schedule follow-up within 1 week",
                "Provide outpatient management and supportive care",
                "Prescribe home remedies and over-the-counter treatments",
                "Educate on hygiene and infection prevention",
                "Monitor for symptom progression",
                "Return precautions: fever >39°C or worsening symptoms",
                "Schedule routine follow-up visit in 3-5 days"
            ]
        
        # Add diagnosis-specific recommendations
        diagnosis_lower = diagnosis.lower()
        
        if "respiratory" in diagnosis_lower or "cough" in diagnosis_lower:
            actions.append("Monitor respiratory rate and pattern closely")
            actions.append("Ensure adequate hydration and rest")
        
        if "infection" in diagnosis_lower or "wound" in diagnosis_lower:
            actions.append("Maintain wound care with sterile technique")
            actions.append("Monitor for signs of spreading infection")
        
        if "fever" in diagnosis_lower:
            actions.append("Implement fever management (acetaminophen/ibuprofen)")
            actions.append("Ensure hydration to prevent dehydration")
        
        logger.info(f"Generated {len(actions)} action recommendations for {urgency_level} case")
        return actions
    
    def get_risk_stratification_score(
        self,
        urgency_level: str,
        confidence_score: float,
        complexity: str = "standard"
    ) -> Dict:
        """
        Calculate comprehensive risk stratification.
        
        Args:
            urgency_level: Triage urgency level
            confidence_score: Model confidence in diagnosis
            complexity: Case complexity (simple, standard, complex)
            
        Returns:
            Risk stratification summary
        """
        risk_score = {
            self.URGENCY_HIGH: 0.9,
            self.URGENCY_MEDIUM: 0.6,
            self.URGENCY_LOW: 0.2
        }.get(urgency_level, 0.5)
        
        # Adjust for confidence
        if confidence_score < 0.5:
            risk_score += 0.1
        
        # Adjust for complexity
        complexity_adjustment = {
            "simple": 0,
            "standard": 0.05,
            "complex": 0.15
        }.get(complexity, 0)
        risk_score += complexity_adjustment
        
        return {
            "urgency_level": urgency_level,
            "overall_risk_score": min(risk_score, 1.0),
            "complexity": complexity,
            "recommendation": self._get_recommendation(urgency_level),
            "monitoring_frequency": self._get_monitoring_frequency(urgency_level)
        }
    
    def _get_recommendation(self, urgency_level: str) -> str:
        """Get clinical recommendation based on urgency"""
        recommendations = {
            self.URGENCY_HIGH: "Emergency department or intensive care",
            self.URGENCY_MEDIUM: "Urgent clinic visit or hospital admission",
            self.URGENCY_LOW: "Routine outpatient follow-up"
        }
        return recommendations.get(urgency_level, "Standard care")
    
    def _get_monitoring_frequency(self, urgency_level: str) -> str:
        """Get recommended monitoring frequency"""
        frequencies = {
            self.URGENCY_HIGH: "Continuous",
            self.URGENCY_MEDIUM: "Every 2-4 hours",
            self.URGENCY_LOW: "Daily or as needed"
        }
        return frequencies.get(urgency_level, "As clinically indicated")
