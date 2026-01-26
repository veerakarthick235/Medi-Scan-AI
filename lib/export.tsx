// Advanced Export Options for Assessment Reports
// Supports PDF, CSV, and JSON formats

import type { Assessment } from './db';

// Generate CSV format
export const exportToCSV = (assessments: Assessment[]): string => {
  const headers = [
    'ID',
    'Patient Name',
    'Date',
    'Symptoms',
    'Diagnosis',
    'Urgency Level',
    'Confidence Score',
    'Reasoning',
    'Actions',
    'Processing Time (s)',
  ];

  const rows = assessments.map((assessment) => [
    assessment.id,
    assessment.patientName,
    assessment.date,
    `"${assessment.symptoms.replace(/"/g, '""')}"`,
    `"${assessment.diagnosis.replace(/"/g, '""')}"`,
    assessment.urgencyLevel,
    assessment.confidenceScore.toFixed(2),
    `"${assessment.reasoning.replace(/"/g, '""')}"`,
    `"${assessment.recommendedActions.join('; ').replace(/"/g, '""')}"`,
    assessment.processingTime.toFixed(2),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csv;
};

// Generate JSON format
export const exportToJSON = (assessments: Assessment[]): string => {
  return JSON.stringify(assessments, null, 2);
};

// Generate plain text report
export const exportToText = (assessment: Assessment): string => {
  return `
================================================================================
                    MEDISCAN AI - TRIAGE ASSESSMENT REPORT
================================================================================

Generated: ${new Date(assessment.date).toLocaleString()}
Assessment ID: ${assessment.id}

PATIENT INFORMATION
-------------------
Name: ${assessment.patientName}
Date of Assessment: ${new Date(assessment.date).toLocaleDateString()}

ASSESSMENT DETAILS
------------------
Symptoms: ${assessment.symptoms}

Preliminary Diagnosis: ${assessment.diagnosis}

Urgency Level: ${assessment.urgencyLevel}

Confidence Score: ${(assessment.confidenceScore * 100).toFixed(1)}%

Clinical Reasoning:
${assessment.reasoning}

RECOMMENDED ACTIONS
-------------------
${assessment.recommendedActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

PROCESSING INFORMATION
---------------------
Processing Time: ${assessment.processingTime.toFixed(2)} seconds

================================================================================
CLINICAL DISCLAIMER
================================================================================
This assessment is a preliminary AI-assisted tool and should NOT replace clinical
judgment by qualified healthcare professionals. Always refer to a licensed 
physician for definitive diagnosis and treatment decisions.

MediScan AI is designed to support healthcare workers in resource-limited
settings by providing preliminary triage guidance. It is not a substitute for
proper clinical examination and professional medical judgment.

================================================================================
`;
};

// Download file helper
export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export single assessment
export const exportAssessmentAsCSV = (assessment: Assessment) => {
  const csv = exportToCSV([assessment]);
  const timestamp = new Date().getTime();
  downloadFile(csv, `Assessment_${timestamp}.csv`, 'text/csv');
};

export const exportAssessmentAsJSON = (assessment: Assessment) => {
  const json = exportToJSON([assessment]);
  const timestamp = new Date().getTime();
  downloadFile(json, `Assessment_${timestamp}.json`, 'application/json');
};

export const exportAssessmentAsText = (assessment: Assessment) => {
  const text = exportToText(assessment);
  const timestamp = new Date().getTime();
  downloadFile(text, `Assessment_${timestamp}.txt`, 'text/plain');
};

// Batch export multiple assessments
export const batchExportAsCSV = (assessments: Assessment[]) => {
  const csv = exportToCSV(assessments);
  const timestamp = new Date().getTime();
  downloadFile(csv, `Assessments_Batch_${timestamp}.csv`, 'text/csv');
};

export const batchExportAsJSON = (assessments: Assessment[]) => {
  const json = exportToJSON(assessments);
  const timestamp = new Date().getTime();
  downloadFile(json, `Assessments_Batch_${timestamp}.json`, 'application/json');
};

// Generate HTML report for printing
export const generateHTMLReport = (assessment: Assessment): string => {
  const urgencyColor = {
    LOW: '#10b981',
    MEDIUM: '#f59e0b',
    HIGH: '#ef4444',
  }[assessment.urgencyLevel];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MediScan AI Assessment Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .report {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #1f2937;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #1f2937;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .urgency-badge {
            display: inline-block;
            background: ${urgencyColor};
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 18px;
            margin: 10px 0;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            border-left: 4px solid #0369a1;
            padding-left: 12px;
            margin-bottom: 12px;
        }
        .info-row {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-label {
            font-weight: bold;
            width: 200px;
            color: #374151;
        }
        .info-value {
            flex: 1;
            color: #555;
        }
        .actions-list {
            list-style: none;
            padding: 0;
        }
        .actions-list li {
            padding: 8px 0;
            padding-left: 24px;
            position: relative;
        }
        .actions-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            font-weight: bold;
            color: #10b981;
        }
        .disclaimer {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin-top: 30px;
            border-radius: 4px;
        }
        .disclaimer h4 {
            margin-top: 0;
            color: #92400e;
        }
        .disclaimer p {
            margin: 5px 0;
            color: #78350f;
            font-size: 13px;
        }
        @media print {
            body {
                background: white;
            }
            .report {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="report">
        <div class="header">
            <h1>MediScan AI</h1>
            <p>Rural Clinic Triage Assessment Report</p>
            <p>Generated: ${new Date(assessment.date).toLocaleString()}</p>
        </div>

        <div class="section">
            <div class="section-title">Urgency Assessment</div>
            <div style="text-align: center;">
                <div class="urgency-badge">${assessment.urgencyLevel}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Confidence Score</div>
                <div class="info-value">${(assessment.confidenceScore * 100).toFixed(1)}%</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Patient Information</div>
            <div class="info-row">
                <div class="info-label">Patient Name</div>
                <div class="info-value">${assessment.patientName}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Assessment Date</div>
                <div class="info-value">${new Date(assessment.date).toLocaleDateString()}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Clinical Assessment</div>
            <div class="info-row">
                <div class="info-label">Symptoms</div>
                <div class="info-value">${assessment.symptoms}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Preliminary Diagnosis</div>
                <div class="info-value">${assessment.diagnosis}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Clinical Reasoning</div>
            <p>${assessment.reasoning}</p>
        </div>

        <div class="section">
            <div class="section-title">Recommended Actions</div>
            <ul class="actions-list">
                ${assessment.recommendedActions.map((action) => `<li>${action}</li>`).join('')}
            </ul>
        </div>

        <div class="disclaimer">
            <h4>Clinical Disclaimer</h4>
            <p>This assessment is a preliminary AI-assisted tool and should NOT replace clinical judgment by qualified healthcare professionals.</p>
            <p>Always refer to a licensed physician for definitive diagnosis and treatment decisions.</p>
        </div>
    </div>
</body>
</html>
  `;
};

// Print or save HTML report
export const printHTMLReport = (assessment: Assessment) => {
  const html = generateHTMLReport(assessment);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};
