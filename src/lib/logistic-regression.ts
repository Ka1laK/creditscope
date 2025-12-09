import modelData from './model-coefficients.json';

export interface ApplicantData {
  age: number;
  monthlyIncome: number;
  debtToIncomeRatio: number;
  creditHistoryYears: number;
  delinquencies: number;
}

export interface VariableContribution {
  name: string;
  coefficient: number;
  value: number;
  contribution: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface PredictionResult {
  linearScore: number; // z value
  probability: number; // P(default)
  decision: 'approved' | 'rejected';
  contributions: VariableContribution[];
  threshold: number;
}

export interface ConfusionMatrix {
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: ConfusionMatrix;
}

// Get coefficients from JSON
const coefficients = modelData.coefficients;

/**
 * Calculate the linear combination (z) for logistic regression
 * z = b₀ + b₁x₁ + b₂x₂ + ...
 */
export function calculateLinearScore(applicant: ApplicantData): number {
  const z = 
    coefficients.intercept +
    coefficients.age * applicant.age +
    coefficients.monthly_income * applicant.monthlyIncome +
    coefficients.debt_to_income_ratio * applicant.debtToIncomeRatio +
    coefficients.credit_history_years * applicant.creditHistoryYears +
    coefficients.delinquencies * applicant.delinquencies;
  
  return z;
}

/**
 * Sigmoid function: converts linear score to probability
 * P = 1 / (1 + e^(-z))
 */
export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Calculate individual variable contributions
 */
export function calculateContributions(applicant: ApplicantData): VariableContribution[] {
  const featureDescriptions = modelData.feature_descriptions;
  
  const contributions: VariableContribution[] = [
    {
      name: 'Intercepto (Riesgo Base)',
      coefficient: coefficients.intercept,
      value: 1,
      contribution: coefficients.intercept,
      impact: coefficients.intercept > 0 ? 'negative' : 'positive'
    },
    {
      name: featureDescriptions.age.name,
      coefficient: coefficients.age,
      value: applicant.age,
      contribution: coefficients.age * applicant.age,
      impact: coefficients.age * applicant.age < 0 ? 'positive' : 'negative'
    },
    {
      name: featureDescriptions.monthly_income.name,
      coefficient: coefficients.monthly_income,
      value: applicant.monthlyIncome,
      contribution: coefficients.monthly_income * applicant.monthlyIncome,
      impact: coefficients.monthly_income * applicant.monthlyIncome < 0 ? 'positive' : 'negative'
    },
    {
      name: featureDescriptions.debt_to_income_ratio.name,
      coefficient: coefficients.debt_to_income_ratio,
      value: applicant.debtToIncomeRatio,
      contribution: coefficients.debt_to_income_ratio * applicant.debtToIncomeRatio,
      impact: coefficients.debt_to_income_ratio * applicant.debtToIncomeRatio > 0 ? 'negative' : 'positive'
    },
    {
      name: featureDescriptions.credit_history_years.name,
      coefficient: coefficients.credit_history_years,
      value: applicant.creditHistoryYears,
      contribution: coefficients.credit_history_years * applicant.creditHistoryYears,
      impact: coefficients.credit_history_years * applicant.creditHistoryYears < 0 ? 'positive' : 'negative'
    },
    {
      name: featureDescriptions.delinquencies.name,
      coefficient: coefficients.delinquencies,
      value: applicant.delinquencies,
      contribution: coefficients.delinquencies * applicant.delinquencies,
      impact: coefficients.delinquencies * applicant.delinquencies > 0 ? 'negative' : 'positive'
    }
  ];

  return contributions;
}

/**
 * Full prediction with all details
 */
export function predict(applicant: ApplicantData, threshold: number = 0.4): PredictionResult {
  const linearScore = calculateLinearScore(applicant);
  const probability = sigmoid(linearScore);
  const decision = probability > threshold ? 'rejected' : 'approved';
  const contributions = calculateContributions(applicant);

  return {
    linearScore,
    probability,
    decision,
    contributions,
    threshold
  };
}

/**
 * Generate synthetic test dataset for metrics calculation
 */
export function generateTestDataset(size: number = 200): { applicants: ApplicantData[], actualDefaults: boolean[] } {
  const applicants: ApplicantData[] = [];
  const actualDefaults: boolean[] = [];
  
  for (let i = 0; i < size; i++) {
    const applicant: ApplicantData = {
      age: Math.floor(Math.random() * 52) + 18, // 18-70
      monthlyIncome: Math.floor(Math.random() * 19000) + 1000, // 1000-20000
      debtToIncomeRatio: Math.random() * 60, // 0-60
      creditHistoryYears: Math.random() * 30, // 0-30
      delinquencies: Math.floor(Math.random() * 11), // 0-10
    };
    
    // Simulate actual default based on model probability + noise
    const prob = sigmoid(calculateLinearScore(applicant));
    const noise = (Math.random() - 0.5) * 0.2; // ±10% noise
    const actualDefault = (prob + noise) > 0.5;
    
    applicants.push(applicant);
    actualDefaults.push(actualDefault);
  }
  
  return { applicants, actualDefaults };
}

/**
 * Calculate metrics for a given threshold
 */
export function calculateMetrics(
  applicants: ApplicantData[],
  actualDefaults: boolean[],
  threshold: number
): ModelMetrics {
  let tp = 0, tn = 0, fp = 0, fn = 0;
  
  for (let i = 0; i < applicants.length; i++) {
    const prediction = predict(applicants[i], threshold);
    const predictedDefault = prediction.decision === 'rejected';
    const actualDefault = actualDefaults[i];
    
    if (predictedDefault && actualDefault) tp++;
    else if (!predictedDefault && !actualDefault) tn++;
    else if (predictedDefault && !actualDefault) fp++;
    else fn++;
  }
  
  const accuracy = (tp + tn) / (tp + tn + fp + fn);
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
  
  return {
    accuracy,
    precision,
    recall,
    f1Score,
    confusionMatrix: {
      truePositives: tp,
      trueNegatives: tn,
      falsePositives: fp,
      falseNegatives: fn
    }
  };
}

/**
 * Generate ROC curve data points
 */
export function generateROCCurve(
  applicants: ApplicantData[],
  actualDefaults: boolean[],
  steps: number = 50
): { fpr: number; tpr: number; threshold: number }[] {
  const rocData: { fpr: number; tpr: number; threshold: number }[] = [];
  
  for (let i = 0; i <= steps; i++) {
    const threshold = i / steps;
    const metrics = calculateMetrics(applicants, actualDefaults, threshold);
    const cm = metrics.confusionMatrix;
    
    const tpr = cm.truePositives / (cm.truePositives + cm.falseNegatives) || 0; // Sensitivity
    const fpr = cm.falsePositives / (cm.falsePositives + cm.trueNegatives) || 0; // 1 - Specificity
    
    rocData.push({ fpr, tpr, threshold });
  }
  
  return rocData.sort((a, b) => a.fpr - b.fpr);
}

/**
 * Calculate AUC using trapezoidal rule
 */
export function calculateAUC(rocData: { fpr: number; tpr: number }[]): number {
  let auc = 0;
  const sorted = [...rocData].sort((a, b) => a.fpr - b.fpr);
  
  for (let i = 1; i < sorted.length; i++) {
    const width = sorted[i].fpr - sorted[i - 1].fpr;
    const height = (sorted[i].tpr + sorted[i - 1].tpr) / 2;
    auc += width * height;
  }
  
  return Math.min(1, Math.max(0, auc));
}

export function getModelInfo() {
  return {
    name: modelData.model_name,
    description: modelData.description,
    features: modelData.feature_descriptions,
    coefficientInterpretations: modelData.coefficient_interpretations,
    validationMetrics: modelData.validation_metrics,
    regulatoryCompliance: modelData.regulatory_compliance,
    defaultThreshold: modelData.threshold_default
  };
}
