'use client';

import { useCreditStore } from '@/store/credit-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldAlert, CheckCircle, XCircle, TrendingDown, TrendingUp } from 'lucide-react';

export function DecisionPanel() {
    const { prediction, threshold } = useCreditStore();

    if (!prediction) {
        return (
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center text-slate-400">
                    Cargando decisión...
                </CardContent>
            </Card>
        );
    }

    const { probability, decision, contributions } = prediction;
    const isApproved = decision === 'approved';

    // Sort contributions by absolute impact (excluding intercept)
    const sortedContributions = [...contributions]
        .filter(c => c.name !== 'Intercepto (Riesgo Base)')
        .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    // Generate justification text
    const riskFactors = sortedContributions
        .filter(c => c.impact === 'negative')
        .slice(0, 2)
        .map(c => c.name);

    const protectiveFactors = sortedContributions
        .filter(c => c.impact === 'positive')
        .slice(0, 2)
        .map(c => c.name);

    let justificationText = '';
    if (isApproved) {
        if (protectiveFactors.length > 0) {
            justificationText = `El solicitante fue APROBADO principalmente gracias a: ${protectiveFactors.join(' y ')}`;
            if (riskFactors.length > 0) {
                justificationText += `, los cuales compensaron los factores de riesgo (${riskFactors.join(', ')}).`;
            } else {
                justificationText += '.';
            }
        } else {
            justificationText = 'El solicitante fue APROBADO debido a un perfil de riesgo bajo.';
        }
    } else {
        if (riskFactors.length > 0) {
            justificationText = `El solicitante fue RECHAZADO principalmente por: ${riskFactors.join(' y ')}`;
            if (protectiveFactors.length > 0) {
                justificationText += `, los cuales superaron los factores protectores (${protectiveFactors.join(', ')}).`;
            } else {
                justificationText += '.';
            }
        } else {
            justificationText = 'El solicitante fue RECHAZADO debido a un perfil de riesgo elevado.';
        }
    }

    return (
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-xl overflow-hidden">
            {/* Decision Banner */}
            <div className={`p-6 ${isApproved ? 'bg-gradient-to-r from-emerald-900/50 to-emerald-800/30' : 'bg-gradient-to-r from-red-900/50 to-red-800/30'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {isApproved ? (
                            <div className="p-3 bg-emerald-500/20 rounded-full">
                                <Shield className="w-8 h-8 text-emerald-400" />
                            </div>
                        ) : (
                            <div className="p-3 bg-red-500/20 rounded-full">
                                <ShieldAlert className="w-8 h-8 text-red-400" />
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className={`text-3xl font-bold ${isApproved ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {isApproved ? 'APROBADO' : 'RECHAZADO'}
                                </h2>
                                <Badge variant={isApproved ? 'default' : 'destructive'} className={isApproved ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}>
                                    {isApproved ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                    {isApproved ? 'Bajo Riesgo' : 'Alto Riesgo'}
                                </Badge>
                            </div>
                            <p className="text-slate-400 text-sm mt-1">
                                Umbral de decisión: {(threshold * 100).toFixed(0)}%
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-400">Probabilidad de Default</p>
                        <p className={`text-4xl font-mono font-bold ${isApproved ? 'text-emerald-400' : 'text-red-400'}`}>
                            {(probability * 100).toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>

            <CardContent className="pt-6">
                {/* Justification */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                        Justificación de la Decisión
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                        {justificationText}
                    </p>
                </div>

                {/* Factor Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-400">Factores Protectores</span>
                        </div>
                        <ul className="space-y-1">
                            {protectiveFactors.length > 0 ? (
                                protectiveFactors.map((f, i) => (
                                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                                        {f}
                                    </li>
                                ))
                            ) : (
                                <li className="text-xs text-slate-500 italic">Ninguno significativo</li>
                            )}
                        </ul>
                    </div>
                    <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-red-400">Factores de Riesgo</span>
                        </div>
                        <ul className="space-y-1">
                            {riskFactors.length > 0 ? (
                                riskFactors.map((f, i) => (
                                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                                        <XCircle className="w-3 h-3 text-red-500" />
                                        {f}
                                    </li>
                                ))
                            ) : (
                                <li className="text-xs text-slate-500 italic">Ninguno significativo</li>
                            )}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
