'use client';

import { useCreditStore } from '@/store/credit-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Activity, Target, HelpCircle, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Gauge } from 'lucide-react';

function MetricCard({
    label,
    value,
    icon: Icon,
    description,
    color = 'cyan'
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    description: string;
    color?: 'cyan' | 'emerald' | 'amber' | 'purple';
}) {
    const colorClasses = {
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={`p-4 rounded-lg border ${colorClasses[color]} cursor-help transition-all hover:scale-[1.02]`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Icon className={`w-4 h-4 ${colorClasses[color].split(' ')[0]}`} />
                            <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
                        </div>
                        <div className={`text-2xl font-mono font-bold ${colorClasses[color].split(' ')[0]}`}>
                            {(value * 100).toFixed(1)}%
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs bg-slate-800 border-slate-700">
                    <p>{description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function MetricsDashboard() {
    const { metrics, threshold, setThreshold, auc } = useCreditStore();

    if (!metrics) {
        return (
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center text-slate-400">
                    Cargando métricas...
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b border-slate-700/50 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        <div>
                            <CardTitle className="text-xl text-slate-100">
                                Laboratorio de Calidad
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Métricas de rendimiento del modelo
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                        <Target className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-slate-300">AUC-ROC:</span>
                        <span className="font-mono font-bold text-amber-400">{auc?.toFixed(3) || '---'}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {/* Threshold Slider */}
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-slate-200">Umbral de Decisión</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-4 h-4 text-slate-500 hover:text-cyan-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs bg-slate-800 border-slate-700">
                                        <p>Si la probabilidad de default supera este umbral, el solicitante es rechazado. Ajústelo para ver el impacto en las métricas.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <span className="text-lg font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
                            {(threshold * 100).toFixed(0)}%
                        </span>
                    </div>
                    <Slider
                        value={[threshold * 100]}
                        min={10}
                        max={90}
                        step={5}
                        onValueChange={([v]) => setThreshold(v / 100)}
                        className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>Más Estricto (10%)</span>
                        <span>Más Permisivo (90%)</span>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricCard
                        label="Accuracy"
                        value={metrics.accuracy}
                        icon={Target}
                        description="Proporción de predicciones correctas sobre el total. ¿Qué tan acertado es el modelo en general?"
                        color="cyan"
                    />
                    <MetricCard
                        label="Precision"
                        value={metrics.precision}
                        icon={CheckCircle}
                        description="De los rechazados, ¿cuántos realmente eran malos clientes? Alta precisión = pocos buenos clientes rechazados."
                        color="emerald"
                    />
                    <MetricCard
                        label="Recall"
                        value={metrics.recall}
                        icon={AlertTriangle}
                        description="De los malos clientes reales, ¿cuántos identificamos? Alto recall = pocos malos clientes aprobados."
                        color="amber"
                    />
                    <MetricCard
                        label="F1-Score"
                        value={metrics.f1Score}
                        icon={Activity}
                        description="Media armónica entre Precision y Recall. Balance entre ambas métricas."
                        color="purple"
                    />
                </div>

                {/* Trade-off Explanation */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-medium text-slate-300">Umbral Bajo (Estricto)</span>
                        </div>
                        <p className="text-xs text-slate-500">
                            Más rechazos → Mayor Precision, Menor Recall. Riesgo: rechazar buenos clientes.
                        </p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-medium text-slate-300">Umbral Alto (Permisivo)</span>
                        </div>
                        <p className="text-xs text-slate-500">
                            Más aprobaciones → Menor Precision, Mayor Recall. Riesgo: aprobar malos clientes.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
