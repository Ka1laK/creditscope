# CreditScope 🛡️
## El Analista de Riesgo Transparente

**CreditScope** es una plataforma web interactiva que demuestra el funcionamiento interno de un modelo de **Regresión Logística** para evaluación de riesgo crediticio, cumpliendo con el principio de **"Caja Blanca"** exigido por la normativa regulatoria.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Educational-green)

---

## 📋 Contexto Regulatorio

### ¿Por qué "Caja Blanca"?

La **Superintendencia de Banca, Seguros y AFP del Perú (SBS)**, a través de la Resolución N° 11356-2008 y normativas relacionadas, establece que los modelos utilizados en decisiones crediticias que afectan a personas deben ser:

1. **Interpretables**: Cada factor que influye en la decisión debe ser explicable.
2. **Auditables**: Los supervisores deben poder revisar la lógica del modelo.
3. **Transparentes**: El solicitante tiene derecho a conocer las razones de una denegación.

Los modelos de "caja negra" (como redes neuronales profundas) dificultan el cumplimiento de estos requisitos. La **Regresión Logística**, en cambio, es el estándar de oro en el sector financiero regulado porque permite justificar cada decisión con claridad matemática.

### CreditScope y el Cumplimiento Normativo

Esta aplicación demuestra cómo la Regresión Logística satisface los requisitos regulatorios:

| Requisito SBS | Cómo lo cumple CreditScope |
|---------------|----------------------------|
| Interpretabilidad | Cada coeficiente tiene significado directo |
| Auditabilidad | Ecuación visible y verificable |
| Transparencia | Justificación automática de cada decisión |
| Validación | Métricas de rendimiento visibles |

---

## 🎯 Características

### Módulo 1: Simulador de Solicitantes
- Ficha de cliente interactiva con 5 variables de riesgo
- Sliders con actualización en tiempo real
- Tooltips con definiciones contextuales

### Módulo 2: Motor de Caja Blanca
- Visualización de la ecuación de Regresión Logística
- Desglose de contribución por variable
- Curva sigmoide animada con D3.js

### Módulo 3: Panel de Decisión
- Decisión final APROBADO/RECHAZADO
- Gráfico de factores de impacto (barras bidireccionales)
- Justificación textual automática

### Módulo 4: Laboratorio de Calidad
- Dashboard de métricas (Accuracy, Precision, Recall, F1)
- Simulador de umbral de decisión
- Matriz de confusión interactiva
- Curva ROC con punto dinámico

### Extras
- Glosario integrado con 15 términos clave
- Diseño de terminal financiero (tema oscuro premium)
- Totalmente responsivo

---

## 🚀 Instalación

### Requisitos Previos
- Node.js 18+ 
- npm 9+

### Pasos

```bash
# Clonar el repositorio (o navegar al directorio)
cd creditscope

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Comandos Disponibles

```bash
npm run dev      # Servidor de desarrollo (Turbopack)
npm run build    # Construir para producción (static export)
npm run start    # Iniciar servidor de producción
npm run lint     # Verificar código con ESLint
```

---

## 🚀 Despliegue con GitHub Actions

El proyecto incluye workflows de CI/CD preconfigurados para GitHub Pages.

### Pasos para desplegar:

1. **Crear repositorio en GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CreditScope"
   git remote add origin https://github.com/TU-USUARIO/creditscope.git
   git push -u origin main
   ```

2. **Configurar basePath** (si el repo no es `usuario.github.io`):
   
   Editar `next.config.ts` y descomentar la línea de `basePath`:
   ```typescript
   basePath: '/nombre-del-repo',
   ```

3. **Habilitar GitHub Pages**:
   - Ir a Settings → Pages
   - Source: "GitHub Actions"

4. **Push a main**: El workflow se ejecutará automáticamente

### Workflows incluidos:

| Archivo | Trigger | Acción |
|---------|---------|--------|
| `.github/workflows/ci.yml` | Push/PR a cualquier rama | Lint + TypeScript + Build |
| `.github/workflows/deploy.yml` | Push a main | Deploy a GitHub Pages |

### URL de producción:
```
https://TU-USUARIO.github.io/creditscope/
```

---

## 🏗️ Arquitectura

```
creditscope/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout con metadatos SEO
│   │   ├── page.tsx          # Página principal
│   │   └── globals.css       # Estilos globales Tailwind
│   ├── components/
│   │   ├── ui/               # Componentes ShadCN
│   │   ├── applicant-card.tsx
│   │   ├── equation-breakdown.tsx
│   │   ├── sigmoid-curve.tsx
│   │   ├── decision-panel.tsx
│   │   ├── impact-chart.tsx
│   │   ├── metrics-dashboard.tsx
│   │   ├── confusion-matrix.tsx
│   │   ├── roc-curve.tsx
│   │   └── glossary.tsx
│   ├── lib/
│   │   ├── model-coefficients.json  # Modelo pre-entrenado
│   │   ├── logistic-regression.ts   # Motor de predicción
│   │   └── utils.ts
│   └── store/
│       └── credit-store.ts   # Estado global (Zustand)
```

---

## 📊 Modelo Pre-entrenado

El archivo `model-coefficients.json` contiene coeficientes calibrados para el mercado peruano:

| Variable | Coeficiente | Interpretación |
|----------|-------------|----------------|
| Intercepto | +1.50 | Riesgo base |
| Edad | -0.025 | Mayor edad → menor riesgo |
| Ingreso Mensual | -0.00015 | Mayor ingreso → menor riesgo |
| Ratio Deuda/Ingreso | +0.045 | Mayor ratio → mayor riesgo |
| Antigüedad Crediticia | -0.12 | Mayor historial → menor riesgo |
| Morosidades | +0.65 | Más morosidades → mayor riesgo |

**Métricas del Modelo:**
- AUC-ROC: 0.891
- Accuracy: 84.7%
- F1-Score: 0.80

---

## 🛠️ Stack Técnico

| Tecnología | Uso |
|------------|-----|
| **Next.js 15** | Framework React con App Router |
| **React 19** | UI Components |
| **TypeScript** | Tipado estático (strict mode) |
| **Zustand** | Estado global reactivo |
| **Recharts** | Gráficos de barras y curva ROC |
| **D3.js** | Curva sigmoide animada |
| **Tailwind CSS v4** | Estilos utilitarios |
| **ShadCN/UI** | Componentes base (Radix) |
| **Lucide React** | Iconografía |

---

## 📚 Glosario de Términos

La aplicación incluye un glosario integrado con definiciones de:

- Regresión Logística
- Función Sigmoide
- Coeficientes e Intercepto
- Umbral de Decisión
- Matriz de Confusión
- Curva ROC y AUC
- Precision, Recall, F1-Score
- Modelo Caja Blanca
- Y más...

---

## ⚠️ Disclaimer

Esta aplicación es **exclusivamente educativa y demostrativa**. Los coeficientes del modelo son simulados y no deben utilizarse para decisiones crediticias reales. En un entorno productivo, los modelos deben:

1. Entrenarse con datos históricos reales
2. Validarse rigurosamente
3. Monitorearse continuamente
4. Cumplir con todas las regulaciones aplicables

---

## 📄 Licencia

Proyecto educativo - Libre uso para fines de aprendizaje y demostración.

---

## 🔗 Referencias

- [SBS - Superintendencia de Banca y Seguros](https://www.sbs.gob.pe/)
- [Resolución SBS N° 11356-2008](https://www.sbs.gob.pe/app/pp/preproyectos/default.aspx)
- [Explainable AI (XAI) - Google](https://cloud.google.com/explainable-ai)
- [Logistic Regression Explained](https://towardsdatascience.com/logistic-regression-detailed-overview-46c4da4303bc)
