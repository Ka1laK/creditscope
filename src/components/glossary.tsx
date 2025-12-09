'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface GlossaryTerm {
    term: string;
    definition: string;
    formula?: string;
    relatedModule?: string;
}

const glossaryTerms: GlossaryTerm[] = [
    {
        term: 'Regresión Logística',
        definition: 'Modelo estadístico que predice la probabilidad de un evento binario (ej. default/no-default) basándose en una o más variables predictoras. Es el estándar en riesgo crediticio por su interpretabilidad y transparencia.',
        formula: 'P(Y=1) = 1 / (1 + e^(-z))',
        relatedModule: 'Motor de Caja Blanca'
    },
    {
        term: 'Intercepto (b₀)',
        definition: 'Constante del modelo que representa el riesgo base inherente a cualquier solicitante antes de evaluar sus características específicas. En términos de log-odds, es el valor cuando todas las variables son cero.',
        relatedModule: 'Motor de Caja Blanca'
    },
    {
        term: 'Coeficiente (bᵢ)',
        definition: 'Peso asignado a cada variable en el modelo. Un coeficiente positivo aumenta la probabilidad de default; uno negativo la disminuye. Representa el cambio en log-odds por cada unidad de cambio en la variable.',
        relatedModule: 'Factores de Impacto'
    },
    {
        term: 'Función Sigmoide',
        definition: 'Función matemática que transforma cualquier valor real en un número entre 0 y 1, ideal para representar probabilidades. También conocida como función logística.',
        formula: 'σ(z) = 1 / (1 + e^(-z))',
        relatedModule: 'Curva Sigmoide'
    },
    {
        term: 'Puntuación Lineal (z)',
        definition: 'Suma ponderada del intercepto más los productos de cada coeficiente por su variable correspondiente. Este valor se transforma mediante la función sigmoide para obtener la probabilidad.',
        formula: 'z = b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ',
        relatedModule: 'Motor de Caja Blanca'
    },
    {
        term: 'Umbral de Decisión',
        definition: 'Punto de corte que determina si un solicitante es aprobado o rechazado. Si la probabilidad de default supera este umbral, se rechaza la solicitud. Es ajustable según el apetito de riesgo.',
        relatedModule: 'Laboratorio de Calidad'
    },
    {
        term: 'Accuracy (Exactitud)',
        definition: 'Proporción de predicciones correctas sobre el total de casos. Mide qué tan acertado es el modelo en general, pero puede ser engañosa con clases desbalanceadas.',
        formula: '(TP + TN) / (TP + TN + FP + FN)'
    },
    {
        term: 'Precision (Precisión)',
        definition: 'De todos los casos que el modelo predijo como default, ¿cuántos realmente lo fueron? Alta precisión significa pocos falsos positivos (pocos buenos clientes rechazados).',
        formula: 'TP / (TP + FP)'
    },
    {
        term: 'Recall (Sensibilidad)',
        definition: 'De todos los casos que realmente fueron default, ¿cuántos identificó el modelo? Alto recall significa pocos falsos negativos (pocos malos clientes aprobados).',
        formula: 'TP / (TP + FN)'
    },
    {
        term: 'F1-Score',
        definition: 'Media armónica entre Precision y Recall. Proporciona un balance entre ambas métricas, útil cuando se busca equilibrar los dos tipos de error.',
        formula: '2 × (Precision × Recall) / (Precision + Recall)'
    },
    {
        term: 'Matriz de Confusión',
        definition: 'Tabla que compara las predicciones del modelo con los resultados reales. Muestra Verdaderos Positivos (TP), Verdaderos Negativos (TN), Falsos Positivos (FP) y Falsos Negativos (FN).',
        relatedModule: 'Matriz de Confusión'
    },
    {
        term: 'Curva ROC',
        definition: 'Gráfico que muestra el rendimiento del modelo clasificador en todos los umbrales posibles. Traza la Tasa de Verdaderos Positivos vs. la Tasa de Falsos Positivos.',
        relatedModule: 'Curva ROC'
    },
    {
        term: 'AUC (Area Under Curve)',
        definition: 'Área bajo la curva ROC. Mide la capacidad discriminativa del modelo: 1.0 = clasificador perfecto, 0.5 = clasificador aleatorio. Valores típicos en riesgo crediticio: 0.7-0.9.',
        relatedModule: 'Curva ROC'
    },
    {
        term: 'Ratio Deuda/Ingreso (DTI)',
        definition: 'Porcentaje del ingreso mensual comprometido en el pago de deudas. Un DTI alto (>40%) indica mayor estrés financiero y mayor probabilidad de incumplimiento.',
        relatedModule: 'Ficha del Solicitante'
    },
    {
        term: 'Modelo Caja Blanca',
        definition: 'Modelo de machine learning cuya lógica interna es completamente transparente e interpretable. Requerido por reguladores como la SBS para decisiones crediticias que afectan a personas.',
        relatedModule: 'Normativa SBS'
    }
];

function GlossaryItem({ item, isExpanded, onToggle }: { item: GlossaryTerm; isExpanded: boolean; onToggle: () => void }) {
    return (
        <div className="border-b border-slate-700/50 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800/30 transition-colors text-left"
            >
                <span className="font-medium text-slate-200">{item.term}</span>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
            </button>
            {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                    <p className="text-sm text-slate-400 leading-relaxed">{item.definition}</p>
                    {item.formula && (
                        <div className="bg-slate-800/50 rounded px-3 py-2 font-mono text-sm text-cyan-300">
                            {item.formula}
                        </div>
                    )}
                    {item.relatedModule && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <ExternalLink className="w-3 h-3" />
                            <span>Ver en: {item.relatedModule}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export function Glossary() {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleItem = (term: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(term)) {
            newExpanded.delete(term);
        } else {
            newExpanded.add(term);
        }
        setExpandedItems(newExpanded);
    };

    const expandAll = () => {
        setExpandedItems(new Set(glossaryTerms.map(t => t.term)));
    };

    const collapseAll = () => {
        setExpandedItems(new Set());
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                className="fixed bottom-4 right-4 bg-slate-900/90 border-slate-700 hover:bg-slate-800 text-slate-300 z-50"
            >
                <BookOpen className="w-4 h-4 mr-2" />
                Glosario
            </Button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-96 max-h-[80vh] z-50">
            <Card className="bg-slate-900/95 border-slate-700/50 backdrop-blur-sm shadow-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50 py-3 bg-slate-800/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-cyan-400" />
                            <div>
                                <CardTitle className="text-lg text-slate-100">Glosario</CardTitle>
                                <CardDescription className="text-slate-400 text-xs">
                                    Términos clave del análisis de riesgo
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={expandAll}
                                className="text-xs h-7 text-slate-400 hover:text-slate-200"
                            >
                                Expandir
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={collapseAll}
                                className="text-xs h-7 text-slate-400 hover:text-slate-200"
                            >
                                Colapsar
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="text-xs h-7 text-slate-400 hover:text-slate-200"
                            >
                                ✕
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
                    {glossaryTerms.map((item) => (
                        <GlossaryItem
                            key={item.term}
                            item={item}
                            isExpanded={expandedItems.has(item.term)}
                            onToggle={() => toggleItem(item.term)}
                        />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
