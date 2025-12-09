'use client';

import { useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCreditStore } from '@/store/credit-store';
import { HelpCircle, User, DollarSign, Percent, Clock, AlertTriangle } from 'lucide-react';

interface SliderFieldProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit: string;
    tooltip: string;
    icon: React.ReactNode;
    onChange: (value: number) => void;
    formatValue?: (value: number) => string;
}

function SliderField({ label, value, min, max, step = 1, unit, tooltip, icon, onChange, formatValue }: SliderFieldProps) {
    const displayValue = formatValue ? formatValue(value) : `${value} ${unit}`;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-cyan-400">{icon}</span>
                    <span className="text-sm font-medium text-slate-200">{label}</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-slate-500 hover:text-cyan-400 cursor-help transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs bg-slate-800 border-slate-700 text-slate-200">
                                <p>{tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <span className="text-sm font-mono font-bold text-cyan-300 bg-slate-800/50 px-2 py-1 rounded">
                    {displayValue}
                </span>
            </div>
            <Slider
                value={[value]}
                min={min}
                max={max}
                step={step}
                onValueChange={([v]) => onChange(v)}
                className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>{min} {unit}</span>
                <span>{max} {unit}</span>
            </div>
        </div>
    );
}

export function ApplicantCard() {
    const { applicant, setApplicantField, modelInfo, resetApplicant, initializeTestData } = useCreditStore();
    const features = modelInfo.features;

    useEffect(() => {
        initializeTestData();
    }, [initializeTestData]);

    return (
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b border-slate-700/50 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
                            <User className="w-5 h-5 text-cyan-400" />
                            Ficha del Solicitante
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                            Ajuste los parámetros del solicitante de crédito
                        </CardDescription>
                    </div>
                    <button
                        onClick={resetApplicant}
                        className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors border border-slate-600"
                    >
                        Restablecer
                    </button>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <SliderField
                    label={features.age.name}
                    value={applicant.age}
                    min={features.age.min}
                    max={features.age.max}
                    unit={features.age.unit}
                    tooltip={features.age.tooltip}
                    icon={<User className="w-4 h-4" />}
                    onChange={(v) => setApplicantField('age', v)}
                />

                <SliderField
                    label={features.monthly_income.name}
                    value={applicant.monthlyIncome}
                    min={features.monthly_income.min}
                    max={features.monthly_income.max}
                    step={100}
                    unit=""
                    tooltip={features.monthly_income.tooltip}
                    icon={<DollarSign className="w-4 h-4" />}
                    onChange={(v) => setApplicantField('monthlyIncome', v)}
                    formatValue={(v) => `S/ ${v.toLocaleString()}`}
                />

                <SliderField
                    label={features.debt_to_income_ratio.name}
                    value={applicant.debtToIncomeRatio}
                    min={features.debt_to_income_ratio.min}
                    max={features.debt_to_income_ratio.max}
                    step={1}
                    unit={features.debt_to_income_ratio.unit}
                    tooltip={features.debt_to_income_ratio.tooltip}
                    icon={<Percent className="w-4 h-4" />}
                    onChange={(v) => setApplicantField('debtToIncomeRatio', v)}
                />

                <SliderField
                    label={features.credit_history_years.name}
                    value={applicant.creditHistoryYears}
                    min={features.credit_history_years.min}
                    max={features.credit_history_years.max}
                    step={0.5}
                    unit={features.credit_history_years.unit}
                    tooltip={features.credit_history_years.tooltip}
                    icon={<Clock className="w-4 h-4" />}
                    onChange={(v) => setApplicantField('creditHistoryYears', v)}
                />

                <SliderField
                    label={features.delinquencies.name}
                    value={applicant.delinquencies}
                    min={features.delinquencies.min}
                    max={features.delinquencies.max}
                    unit={features.delinquencies.unit}
                    tooltip={features.delinquencies.tooltip}
                    icon={<AlertTriangle className="w-4 h-4" />}
                    onChange={(v) => setApplicantField('delinquencies', v)}
                />
            </CardContent>
        </Card>
    );
}
