'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCreditStore } from '@/store/credit-store';
import { HelpCircle, TrendingUp } from 'lucide-react';

export function SigmoidCurve() {
    const svgRef = useRef<SVGSVGElement>(null);
    const { prediction } = useCreditStore();

    useEffect(() => {
        if (!svgRef.current || !prediction) return;

        const svg = d3.select(svgRef.current);
        const width = 400;
        const height = 250;
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Clear previous content
        svg.selectAll('*').remove();

        // Create main group
        const g = svg
            .attr('viewBox', `0 0 ${width} ${height}`)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear().domain([-6, 6]).range([0, innerWidth]);
        const yScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

        // Sigmoid function
        const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

        // Generate curve data
        const curveData: [number, number][] = [];
        for (let x = -6; x <= 6; x += 0.1) {
            curveData.push([x, sigmoid(x)]);
        }

        // Create line generator
        const line = d3.line<[number, number]>()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
            .curve(d3.curveMonotoneX);

        // Draw gradient area under curve
        const area = d3.area<[number, number]>()
            .x(d => xScale(d[0]))
            .y0(innerHeight)
            .y1(d => yScale(d[1]))
            .curve(d3.curveMonotoneX);

        // Create gradient
        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', 'sigmoid-gradient')
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '100%').attr('y2', '0%');

        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#10b981').attr('stop-opacity', 0.3);
        gradient.append('stop').attr('offset', '50%').attr('stop-color', '#fbbf24').attr('stop-opacity', 0.3);
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#ef4444').attr('stop-opacity', 0.3);

        // Draw area
        g.append('path')
            .datum(curveData)
            .attr('fill', 'url(#sigmoid-gradient)')
            .attr('d', area);

        // Draw grid lines
        const xGridLines = d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(() => '');
        const yGridLines = d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => '');

        g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(xGridLines)
            .selectAll('line')
            .attr('stroke', '#334155')
            .attr('stroke-opacity', 0.5);

        g.append('g')
            .attr('class', 'grid')
            .call(yGridLines)
            .selectAll('line')
            .attr('stroke', '#334155')
            .attr('stroke-opacity', 0.5);

        // Draw sigmoid curve
        g.append('path')
            .datum(curveData)
            .attr('fill', 'none')
            .attr('stroke', '#22d3ee')
            .attr('stroke-width', 3)
            .attr('d', line);

        // Draw axes
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(6))
            .attr('color', '#94a3b8')
            .selectAll('text')
            .attr('fill', '#94a3b8');

        g.append('g')
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `${(+d * 100).toFixed(0)}%`))
            .attr('color', '#94a3b8')
            .selectAll('text')
            .attr('fill', '#94a3b8');

        // Axis labels
        g.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 35)
            .attr('text-anchor', 'middle')
            .attr('fill', '#64748b')
            .attr('font-size', '12px')
            .text('Puntuación Lineal (z)');

        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -innerHeight / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .attr('fill', '#64748b')
            .attr('font-size', '12px')
            .text('P(Default)');

        // Current point
        const z = Math.max(-6, Math.min(6, prediction.linearScore));
        const prob = prediction.probability;
        const pointColor = prob > 0.4 ? '#ef4444' : '#10b981';

        // Vertical line from point to x-axis
        g.append('line')
            .attr('x1', xScale(z))
            .attr('y1', yScale(prob))
            .attr('x2', xScale(z))
            .attr('y2', innerHeight)
            .attr('stroke', pointColor)
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.7);

        // Horizontal line from point to y-axis
        g.append('line')
            .attr('x1', 0)
            .attr('y1', yScale(prob))
            .attr('x2', xScale(z))
            .attr('y2', yScale(prob))
            .attr('stroke', pointColor)
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.7);

        // Draw the point with animation
        g.append('circle')
            .attr('cx', xScale(z))
            .attr('cy', yScale(prob))
            .attr('r', 0)
            .attr('fill', pointColor)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .transition()
            .duration(300)
            .attr('r', 8);

        // Threshold line at 40%
        g.append('line')
            .attr('x1', 0)
            .attr('y1', yScale(0.4))
            .attr('x2', innerWidth)
            .attr('y2', yScale(0.4))
            .attr('stroke', '#fbbf24')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '6,3')
            .attr('opacity', 0.8);

        g.append('text')
            .attr('x', innerWidth - 5)
            .attr('y', yScale(0.4) - 5)
            .attr('text-anchor', 'end')
            .attr('fill', '#fbbf24')
            .attr('font-size', '10px')
            .text('Umbral 40%');

    }, [prediction]);

    if (!prediction) return null;

    return (
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b border-slate-700/50 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                        <div>
                            <CardTitle className="text-xl text-slate-100">
                                Función Sigmoide
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Transformación de z → Probabilidad
                            </CardDescription>
                        </div>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="w-5 h-5 text-slate-500 hover:text-cyan-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs bg-slate-800 border-slate-700">
                                <p>La curva sigmoide convierte cualquier valor de z en una probabilidad entre 0% y 100%. El punto indica la posición actual del solicitante.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent className="pt-4 flex justify-center">
                <svg ref={svgRef} className="w-full max-w-md" />
            </CardContent>
        </Card>
    );
}
