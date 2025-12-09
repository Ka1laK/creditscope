'use client';

import { useCreditStore } from '@/store/credit-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Calculator, ArrowRight, Plus, Equal } from 'lucide-react';

function ContributionBlock({
    label,
    coefficient,
    value,
    contribution,
    impact
}: {
    label: string;
    coefficient: number;
    value: number;
    contribution: number;
    impact: 'positive' | 'negative' | 'neutral';
}) {
    const bgColor = impact === 'positive'
        ? 'bg-emerald-900/30 border-emerald-500/30'
        : impact === 'negative'
            ? 'bg-red-900/30 border-red-500/30'
            : 'bg-slate-800/50 border-slate-600/30';

    const textColor = impact === 'positive'
        ? 'text-emerald-400'
        : impact === 'negative'
            ? 'text-red-400'
            : 'text-slate-400';

    return (
        <div className={`p-3 rounded-lg border ${bgColor} transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">{label}</span>
                <span className={`text-xs font-mono ${textColor}`}>
                    {impact === 'positive' ? '↓ Riesgo' : impact === 'negative' ? '↑ Riesgo' : ''}
                </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-sm">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-slate-400 cursor-help">b={coefficient.toFixed(4)}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-800 border-slate-700">
                            <p>Coeficiente del modelo</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <span className="text-slate-500">×</span>
                <span className="text-cyan-300">x={typeof value === 'number' && value !== 1 ? value.toLocaleString() : '1'}</span>
                <span className="text-slate-500">=</span>
                <span className={`font-bold ${textColor}`}>
                    {contribution >= 0 ? '+' : ''}{contribution.toFixed(3)}
                </span>
            </div>
        </div>
    );
}

export function EquationBreakdown() {
    const { prediction } = useCreditStore();

    if (!prediction) {
        return (
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center text-slate-400">
                    Cargando modelo...
                </CardContent>
            </Card>
        );
    }

    const { linearScore, probability, contributions } = prediction;

    return (
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b border-slate-700/50 pb-4">
                <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-cyan-400" />
                    <div>
                        <CardTitle className="text-xl text-slate-100">
                            Motor de Caja Blanca
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Desglose transparente de la ecuación de Regresión Logística
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {/* Formula Display */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Fórmula de Regresión Logística</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-slate-500 hover:text-cyan-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="left" className="max-w-sm bg-slate-800 border-slate-700">
                                    <p>La función sigmoide convierte la suma ponderada (z) en una probabilidad entre 0 y 1.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="font-mono text-lg text-center text-cyan-300 overflow-x-auto">
                        <span className="text-amber-400">P(Default)</span>
                        <span className="text-slate-400"> = </span>
                        <span className="text-slate-300">1 / (1 + e</span>
                        <sup className="text-slate-300">-z</sup>
                        <span className="text-slate-300">)</span>
                    </div>
                </div>

                {/* Linear Combination */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-slate-300">Combinación Lineal (z = b₀ + Σbᵢxᵢ)</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-slate-500 hover:text-cyan-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="right" className="max-w-xs bg-slate-800 border-slate-700">
                                    <p>Suma ponderada de todas las variables. Valores positivos aumentan la probabilidad de default.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="grid gap-2">
                        {contributions.map((c, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {i > 0 && <Plus className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                                <div className="flex-1">
                                    <ContributionBlock
                                        label={c.name}
                                        coefficient={c.coefficient}
                                        value={c.value}
                                        contribution={c.contribution}
                                        impact={c.impact}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-1">
                            <Equal className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-400">Puntuación Lineal (z)</span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-cyan-300">
                            {linearScore.toFixed(3)}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-1">
                            <ArrowRight className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-400">Probabilidad de Default</span>
                        </div>
                        <div className={`text-2xl font-mono font-bold ${probability > 0.4 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {(probability * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
