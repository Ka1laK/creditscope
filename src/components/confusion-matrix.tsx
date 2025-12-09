'use client';

import { useCreditStore } from '@/store/credit-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Grid3X3, HelpCircle, CheckCircle, XCircle } from 'lucide-react';

export function ConfusionMatrix() {
    const { metrics, threshold } = useCreditStore();

    if (!metrics) {
        return (
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center text-slate-400">
                    Cargando matriz...
                </CardContent>
            </Card>
        );
    }

    const { confusionMatrix: cm } = metrics;
    const total = cm.truePositives + cm.trueNegatives + cm.falsePositives + cm.falseNegatives;

    const cells = [
        {
            value: cm.trueNegatives,
            label: 'Verdaderos Negativos',
            description: 'Buenos clientes correctamente aprobados',
            color: 'bg-emerald-900/50 border-emerald-500/30',
            textColor: 'text-emerald-400',
            icon: CheckCircle,
            position: 'top-left'
        },
        {
            value: cm.falsePositives,
            label: 'Falsos Positivos',
            description: 'Buenos clientes incorrectamente rechazados (Error Tipo I)',
            color: 'bg-amber-900/50 border-amber-500/30',
            textColor: 'text-amber-400',
            icon: XCircle,
            position: 'top-right'
        },
        {
            value: cm.falseNegatives,
            label: 'Falsos Negativos',
            description: 'Malos clientes incorrectamente aprobados (Error Tipo II)',
            color: 'bg-red-900/50 border-red-500/30',
            textColor: 'text-red-400',
            icon: XCircle,
            position: 'bottom-left'
        },
        {
            value: cm.truePositives,
            label: 'Verdaderos Positivos',
            description: 'Malos clientes correctamente rechazados',
            color: 'bg-emerald-900/50 border-emerald-500/30',
            textColor: 'text-emerald-400',
            icon: CheckCircle,
            position: 'bottom-right'
        }
    ];

    return (
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b border-slate-700/50 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Grid3X3 className="w-5 h-5 text-cyan-400" />
                        <div>
                            <CardTitle className="text-xl text-slate-100">
                                Matriz de Confusión
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Umbral: {(threshold * 100).toFixed(0)}% | Muestra: {total} casos
                            </CardDescription>
                        </div>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="w-5 h-5 text-slate-500 hover:text-cyan-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs bg-slate-800 border-slate-700">
                                <p>Compara predicciones del modelo vs. resultados reales. Celdas verdes = aciertos, celdas coloreadas = errores.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                    {/* Column Headers */}
                    <div className="flex items-center mb-2 ml-20">
                        <div className="text-center w-28">
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Predicción</span>
                        </div>
                    </div>
                    <div className="flex items-center mb-2 ml-20">
                        <div className="text-center w-28 px-2">
                            <span className="text-xs text-emerald-400 font-medium">Aprobado</span>
                        </div>
                        <div className="text-center w-28 px-2">
                            <span className="text-xs text-red-400 font-medium">Rechazado</span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {/* Row Header */}
                        <div className="flex flex-col items-center justify-center w-20 h-56">
                            <span className="text-xs text-slate-500 uppercase tracking-wider transform -rotate-90 whitespace-nowrap mb-8">
                                Realidad
                            </span>
                        </div>

                        {/* Matrix Grid */}
                        <div className="relative">
                            {/* Row labels */}
                            <div className="absolute -left-12 top-0 h-28 flex items-center">
                                <span className="text-xs text-emerald-400 font-medium">Buen Cliente</span>
                            </div>
                            <div className="absolute -left-12 top-28 h-28 flex items-center">
                                <span className="text-xs text-red-400 font-medium">Mal Cliente</span>
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {cells.map((cell, i) => (
                                    <TooltipProvider key={i}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className={`w-28 h-28 ${cell.color} border-2 rounded-lg flex flex-col items-center justify-center cursor-help transition-all hover:scale-105`}
                                                >
                                                    <cell.icon className={`w-5 h-5 ${cell.textColor} mb-1`} />
                                                    <span className={`text-3xl font-mono font-bold ${cell.textColor}`}>
                                                        {cell.value}
                                                    </span>
                                                    <span className="text-xs text-slate-500 mt-1">
                                                        {((cell.value / total) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" className="max-w-xs bg-slate-800 border-slate-700">
                                                <p className="font-medium mb-1">{cell.label}</p>
                                                <p className="text-slate-400">{cell.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 bg-emerald-900/50 border-2 border-emerald-500/30 rounded"></div>
                        <span className="text-slate-400">Predicción Correcta</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 bg-amber-900/50 border-2 border-amber-500/30 rounded"></div>
                        <span className="text-slate-400">Error Tipo I (FP)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 bg-red-900/50 border-2 border-red-500/30 rounded"></div>
                        <span className="text-slate-400">Error Tipo II (FN)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
