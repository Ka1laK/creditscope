'use client';

import { useMemo } from 'react';
import { useCreditStore } from '@/store/credit-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, ReferenceDot, Area, ComposedChart, Line } from 'recharts';
import { TrendingUp, HelpCircle, Target } from 'lucide-react';

export function ROCCurve() {
    const { rocData, auc, threshold } = useCreditStore();

    const currentPoint = useMemo(() => {
        if (!rocData) return null;
        // Find the point closest to current threshold
        return rocData.reduce((closest, point) => {
            const currentDiff = Math.abs(point.threshold - threshold);
            const closestDiff = Math.abs(closest.threshold - threshold);
            return currentDiff < closestDiff ? point : closest;
        }, rocData[0]);
    }, [rocData, threshold]);

    if (!rocData || rocData.length === 0) {
        return (
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center text-slate-400">
                    Cargando curva ROC...
                </CardContent>
            </Card>
        );
    }

    // Sort data for proper line rendering
    const sortedData = [...rocData].sort((a, b) => a.fpr - b.fpr);

    return (
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b border-slate-700/50 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                        <div>
                            <CardTitle className="text-xl text-slate-100">
                                Curva ROC
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Receiver Operating Characteristic
                            </CardDescription>
                        </div>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="w-5 h-5 text-slate-500 hover:text-cyan-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs bg-slate-800 border-slate-700">
                                <p>La curva ROC muestra el rendimiento del modelo en todos los umbrales posibles. El área bajo la curva (AUC) mide la capacidad discriminativa: 1.0 = perfecto, 0.5 = aleatorio.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {/* AUC Badge */}
                <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 px-4 py-2 rounded-full border border-cyan-500/20">
                        <Target className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-slate-300">Área Bajo la Curva (AUC):</span>
                        <span className="font-mono font-bold text-lg text-cyan-400">{auc?.toFixed(3)}</span>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={sortedData} margin={{ top: 10, right: 20, bottom: 40, left: 40 }}>
                            <defs>
                                <linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis
                                dataKey="fpr"
                                type="number"
                                domain={[0, 1]}
                                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                                stroke="#64748b"
                                fontSize={11}
                                label={{ value: 'Tasa de Falsos Positivos (1 - Especificidad)', position: 'bottom', offset: 20, fill: '#64748b', fontSize: 11 }}
                            />
                            <YAxis
                                dataKey="tpr"
                                type="number"
                                domain={[0, 1]}
                                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                                stroke="#64748b"
                                fontSize={11}
                                label={{ value: 'Tasa de Verdaderos Positivos (Sensibilidad)', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 11 }}
                            />
                            {/* Random classifier line */}
                            <ReferenceLine
                                stroke="#ef4444"
                                strokeDasharray="5 5"
                                strokeOpacity={0.5}
                                segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                            />
                            {/* Area under curve */}
                            <Area
                                type="monotone"
                                dataKey="tpr"
                                stroke="none"
                                fill="url(#rocGradient)"
                            />
                            {/* ROC curve */}
                            <Line
                                type="monotone"
                                dataKey="tpr"
                                stroke="#22d3ee"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 4, fill: '#22d3ee' }}
                            />
                            {/* Current threshold point */}
                            {currentPoint && (
                                <ReferenceDot
                                    x={currentPoint.fpr}
                                    y={currentPoint.tpr}
                                    r={8}
                                    fill="#fbbf24"
                                    stroke="#fff"
                                    strokeWidth={2}
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Current point info */}
                {currentPoint && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                            <span className="text-sm text-slate-300">Punto del Umbral Actual ({(threshold * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-slate-800/30 rounded-lg p-2 border border-slate-700/50">
                                <span className="text-xs text-slate-500">Sensibilidad (TPR)</span>
                                <p className="font-mono font-bold text-emerald-400">{(currentPoint.tpr * 100).toFixed(1)}%</p>
                            </div>
                            <div className="bg-slate-800/30 rounded-lg p-2 border border-slate-700/50">
                                <span className="text-xs text-slate-500">1 - Especificidad (FPR)</span>
                                <p className="font-mono font-bold text-red-400">{(currentPoint.fpr * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-0.5 bg-cyan-400"></div>
                        <span className="text-slate-400">Curva ROC del Modelo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-0.5 bg-red-400 border-dashed" style={{ borderTop: '2px dashed #ef4444' }}></div>
                        <span className="text-slate-400">Clasificador Aleatorio</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
