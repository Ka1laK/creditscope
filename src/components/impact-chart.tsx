'use client';

import { useCreditStore } from '@/store/credit-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart3, HelpCircle, TrendingDown, TrendingUp } from 'lucide-react';

export function ImpactChart() {
    const { prediction } = useCreditStore();

    if (!prediction) {
        return (
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center text-slate-400">
                    Cargando gráfico...
                </CardContent>
            </Card>
        );
    }

    const { contributions } = prediction;

    // Filter out intercept and sort by absolute contribution
    const sortedContributions = [...contributions]
        .filter(c => c.name !== 'Intercepto (Riesgo Base)')
        .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    // Find max absolute value for scaling
    const maxAbsValue = Math.max(...sortedContributions.map(c => Math.abs(c.contribution)));

    return (
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b border-slate-700/50 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-cyan-400" />
                        <div>
                            <CardTitle className="text-xl text-slate-100">
                                Factores de Impacto
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Contribución de cada variable al riesgo
                            </CardDescription>
                        </div>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="w-5 h-5 text-slate-500 hover:text-cyan-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs bg-slate-800 border-slate-700">
                                <p>Las barras verdes reducen la probabilidad de default (factores protectores). Las barras rojas aumentan la probabilidad de default (factores de riesgo).</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {/* Legend */}
                <div className="flex justify-center gap-6 mb-4 text-xs">
                    <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-400">Reduce Riesgo</span>
                        <div className="w-4 h-3 bg-emerald-500/50 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-red-400" />
                        <span className="text-slate-400">Aumenta Riesgo</span>
                        <div className="w-4 h-3 bg-red-500/50 rounded"></div>
                    </div>
                </div>

                {/* Center axis line */}
                <div className="relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600" />

                    <div className="space-y-3 py-2">
                        {sortedContributions.map((c, i) => {
                            const percentage = (c.contribution / maxAbsValue) * 45; // 45% max width on each side
                            const isPositive = c.contribution < 0; // Negative contribution = positive impact (reduces risk)

                            return (
                                <div key={i} className="relative flex items-center h-10">
                                    {/* Label on the left */}
                                    <div className="absolute left-0 w-[28%] text-right pr-2">
                                        <span className="text-xs text-slate-400 truncate block">{c.name}</span>
                                    </div>

                                    {/* Bar container */}
                                    <div className="absolute left-[30%] right-[5%] h-full flex items-center">
                                        {/* Left side (positive impact / reduces risk) */}
                                        <div className="w-1/2 flex justify-end pr-0.5">
                                            {isPositive && (
                                                <div
                                                    className="h-6 bg-gradient-to-l from-emerald-500/80 to-emerald-600/50 rounded-l transition-all duration-500 flex items-center justify-start pl-2"
                                                    style={{ width: `${Math.abs(percentage)}%` }}
                                                >
                                                    <span className="text-xs font-mono text-emerald-100 whitespace-nowrap">
                                                        {c.contribution.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {/* Center line indicator */}
                                        <div className="w-0.5 h-8 bg-slate-500" />
                                        {/* Right side (negative impact / increases risk) */}
                                        <div className="w-1/2 flex justify-start pl-0.5">
                                            {!isPositive && (
                                                <div
                                                    className="h-6 bg-gradient-to-r from-red-500/80 to-red-600/50 rounded-r transition-all duration-500 flex items-center justify-end pr-2"
                                                    style={{ width: `${Math.abs(percentage)}%` }}
                                                >
                                                    <span className="text-xs font-mono text-red-100 whitespace-nowrap">
                                                        +{c.contribution.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Intercept note */}
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Intercepto (Riesgo Base):</span>
                        <span className="font-mono text-amber-400">
                            {contributions.find(c => c.name === 'Intercepto (Riesgo Base)')?.contribution.toFixed(3)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
