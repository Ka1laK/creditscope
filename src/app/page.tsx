'use client';

import { ApplicantCard } from '@/components/applicant-card';
import { EquationBreakdown } from '@/components/equation-breakdown';
import { SigmoidCurve } from '@/components/sigmoid-curve';
import { DecisionPanel } from '@/components/decision-panel';
import { ImpactChart } from '@/components/impact-chart';
import { MetricsDashboard } from '@/components/metrics-dashboard';
import { ConfusionMatrix } from '@/components/confusion-matrix';
import { ROCCurve } from '@/components/roc-curve';
import { Glossary } from '@/components/glossary';
import { Shield, Eye, Scale, BookOpen, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/20">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                  CreditScope
                </h1>
                <p className="text-xs text-slate-500">El Analista de Riesgo Transparente</p>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#simulador" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Simulador</a>
              <a href="#modelo" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Modelo</a>
              <a href="#decision" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Decisión</a>
              <a href="#laboratorio" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Laboratorio</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex justify-center gap-3 mb-6">
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-400 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              XAI - Explainable AI
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 flex items-center gap-1">
              <Scale className="w-3 h-3" />
              Normativa SBS
            </span>
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Modelo Caja Blanca
            </span>
          </div>
          <h2 className="text-4xl font-bold text-slate-100 mb-4">
            Transparencia Absoluta en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Riesgo Crediticio
            </span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Explora el funcionamiento interno de un modelo de Regresión Logística para evaluación de crédito.
            Comprende cada decisión, cada coeficiente, cada predicción.
          </p>
        </div>

        {/* Info Banner */}
        <div className="max-w-5xl mx-auto mb-12 p-4 bg-gradient-to-r from-cyan-900/20 via-slate-800/20 to-purple-900/20 rounded-xl border border-slate-700/50">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 flex-shrink-0">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-200 mb-1">¿Por qué &quot;Caja Blanca&quot;?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                La normativa SBS (Resolución N° 11356-2008) exige que los modelos utilizados en decisiones crediticias
                sean <strong className="text-cyan-400">interpretables y auditables</strong>. A diferencia de los modelos
                de &quot;caja negra&quot; (como redes neuronales profundas), la Regresión Logística permite explicar
                <strong className="text-emerald-400"> exactamente por qué</strong> se tomó cada decisión, cumpliendo
                con el principio de transparencia regulatoria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20 space-y-16">
        {/* Module 1: Applicant Simulator */}
        <section id="simulador">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Simulador de Solicitantes</h2>
              <p className="text-sm text-slate-500">Ajuste los parámetros y observe el impacto en tiempo real</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <ApplicantCard />
            <DecisionPanel />
          </div>
        </section>

        {/* Module 2: White Box Engine */}
        <section id="modelo">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
              <span className="text-emerald-400 font-bold">2</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Motor de Caja Blanca</h2>
              <p className="text-sm text-slate-500">Desglose transparente de la ecuación de Regresión Logística</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <EquationBreakdown />
            <SigmoidCurve />
          </div>
        </section>

        {/* Module 3: Decision Panel */}
        <section id="decision">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-lg flex items-center justify-center border border-amber-500/20">
              <span className="text-amber-400 font-bold">3</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Panel de Justificación</h2>
              <p className="text-sm text-slate-500">Visualización del impacto de cada variable en la decisión</p>
            </div>
          </div>
          <ImpactChart />
        </section>

        {/* Module 4: Quality Laboratory */}
        <section id="laboratorio">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg flex items-center justify-center border border-purple-500/20">
              <span className="text-purple-400 font-bold">4</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Laboratorio de Calidad</h2>
              <p className="text-sm text-slate-500">Métricas de rendimiento y análisis de trade-offs</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <MetricsDashboard />
            <ConfusionMatrix />
          </div>
          <ROCCurve />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950/80">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-slate-400 text-sm">CreditScope v1.0 - Modelo de Riesgo Explicable</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="https://www.sbs.gob.pe/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1">
                Normativa SBS <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500">Fines educativos y demostrativos</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Glossary */}
      <Glossary />
    </div>
  );
}
