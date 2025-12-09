import { create } from 'zustand';
import {
    ApplicantData,
    PredictionResult,
    ModelMetrics,
    predict,
    calculateMetrics,
    generateTestDataset,
    generateROCCurve,
    calculateAUC,
    getModelInfo
} from '@/lib/logistic-regression';

interface CreditState {
    // Applicant data
    applicant: ApplicantData;

    // Decision threshold
    threshold: number;

    // Prediction results (derived)
    prediction: PredictionResult | null;

    // Test dataset for metrics
    testDataset: { applicants: ApplicantData[], actualDefaults: boolean[] } | null;

    // Model metrics (derived from threshold)
    metrics: ModelMetrics | null;

    // ROC curve data
    rocData: { fpr: number; tpr: number; threshold: number }[] | null;
    auc: number | null;

    // Model info
    modelInfo: ReturnType<typeof getModelInfo>;

    // Actions
    setApplicantField: <K extends keyof ApplicantData>(field: K, value: ApplicantData[K]) => void;
    setThreshold: (threshold: number) => void;
    initializeTestData: () => void;
    resetApplicant: () => void;
}

const defaultApplicant: ApplicantData = {
    age: 35,
    monthlyIncome: 5000,
    debtToIncomeRatio: 30,
    creditHistoryYears: 5,
    delinquencies: 0,
};

export const useCreditStore = create<CreditState>((set, get) => ({
    applicant: defaultApplicant,
    threshold: 0.4,
    prediction: null,
    testDataset: null,
    metrics: null,
    rocData: null,
    auc: null,
    modelInfo: getModelInfo(),

    setApplicantField: (field, value) => {
        const newApplicant = { ...get().applicant, [field]: value };
        const threshold = get().threshold;
        const prediction = predict(newApplicant, threshold);

        set({
            applicant: newApplicant,
            prediction
        });
    },

    setThreshold: (threshold) => {
        const applicant = get().applicant;
        const testDataset = get().testDataset;
        const prediction = predict(applicant, threshold);

        let metrics = get().metrics;
        if (testDataset) {
            metrics = calculateMetrics(testDataset.applicants, testDataset.actualDefaults, threshold);
        }

        set({
            threshold,
            prediction,
            metrics
        });
    },

    initializeTestData: () => {
        const testDataset = generateTestDataset(200);
        const threshold = get().threshold;
        const applicant = get().applicant;

        const metrics = calculateMetrics(testDataset.applicants, testDataset.actualDefaults, threshold);
        const rocData = generateROCCurve(testDataset.applicants, testDataset.actualDefaults, 50);
        const auc = calculateAUC(rocData);
        const prediction = predict(applicant, threshold);

        set({
            testDataset,
            metrics,
            rocData,
            auc,
            prediction
        });
    },

    resetApplicant: () => {
        const threshold = get().threshold;
        const prediction = predict(defaultApplicant, threshold);

        set({
            applicant: defaultApplicant,
            prediction
        });
    }
}));
