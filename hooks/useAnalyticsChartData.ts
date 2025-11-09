// hooks/useAnalyticsChartData.ts

import { useMemo } from 'react';
import type { ChartOptions } from 'chart.js';
import { AppContextType } from '../types/global.d'; 

// Define la interfaz de propiedades para el hook (extraído del contexto y estados locales)
interface UseAnalyticsChartDataProps {
  historicalData: AppContextType['historicalData'];
  liveMetrics: AppContextType['liveMetrics'];
  theme: AppContextType['theme'];
  t: AppContextType['t'];
  eventLog: AppContextType['eventLog'];
  selectedTimeframe: 'week' | 'month' | 'semester';
  selectedMetric: string;
}

export const useAnalyticsChartData = ({
    historicalData,
    liveMetrics,
    theme,
    t,
    eventLog,
    selectedTimeframe,
    selectedMetric
}: UseAnalyticsChartDataProps) => {

    const tickColor = theme === 'dark' ? "#d1d5db" : "#374151";
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // 1. Opciones de Gráfico de Líneas (Line Chart Options)
    const lineChartOptions: ChartOptions<'line'> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: tickColor } }, title: { display: false } },
        scales: {
            x: { ticks: { color: tickColor }, grid: { color: gridColor } },
            y: { beginAtZero: true, max: 100, ticks: { color: tickColor }, grid: { color: gridColor } },
        },
    }), [theme]);

    // 2. Opciones de Gráfico de Barras (Bar Chart Options)
    const barChartOptions: ChartOptions<'bar'> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: tickColor } }, title: { display: false } },
        scales: {
            x: { ticks: { color: tickColor }, grid: { color: gridColor } },
            y: { beginAtZero: true, max: 20, ticks: { color: tickColor, precision: 0 }, grid: { color: gridColor } },
        },
    }), [theme]);
    
    // 3. Datos Filtrados para Gráfico de Tendencia Histórica (Line)
    const historicalChartData = useMemo(() => {
        const timeframes = {
            week: 7, month: 30, semester: 180
        };
        const days = timeframes[selectedTimeframe];
        const filteredData = historicalData.slice(-days); 

        const labels = filteredData.map(d => new Date(d.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }));
        
        const getMetricData = (data: any, metric: string) => {
            if (metric === 'global') {
                return data.map((d: any) => d.globalPercent);
            } else {
                return data.map((d: any) => d.rooms[metric] ? d.rooms[metric].percentage : 0);
            }
        };

        return {
            labels,
            datasets: [{
                label: selectedMetric === 'global' ? t('analytics.globalAttendance') : selectedMetric,
                data: getMetricData(filteredData, selectedMetric),
                fill: true,
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                tension: 0.3,
            }],
        };
    }, [historicalData, selectedTimeframe, selectedMetric, t]);

    // 4. Datos para Gráfico de Ocupación Promedio (Doughnut)
    const doughnutData = useMemo(() => {
        const totalMetrics = historicalData.reduce((acc, dailyData) => {
            for (const room in dailyData.rooms) {
                acc[room] = (acc[room] || 0) + dailyData.rooms[room].percentage;
            }
            return acc;
        }, {} as Record<string, number>);
        
        const roomNames = Object.keys(totalMetrics);
        const avgPercentages = roomNames.map(room => Math.round(totalMetrics[room] / (historicalData.length || 1))); 

        return {
            labels: roomNames,
            datasets: [{
                data: avgPercentages,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
                hoverOffset: 4,
            }],
        };
    }, [historicalData]);

    // 5. Datos para Gráfico de Alertas por Aula (Bar) - Lógica de consumo de logs real
    const barAlertsData = useMemo(() => {
        const alertEvents = eventLog.filter(e => e.level === 'alert'); 
        
        const alertCounts = alertEvents.reduce((acc, e) => {
            const room = e.messageArgs?.room; 
            if (room) {
                acc[room] = (acc[room] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const labels = liveMetrics.map(m => m.room);
        const data = labels.map(room => alertCounts[room] || 0);
        
        return {
            labels: labels,
            datasets: [{
                label: t('analytics.alerts'),
                data: data,
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1,
                borderRadius: 4,
            }],
        };
    }, [liveMetrics, t, eventLog]);
    
    // 6. Opciones para Doughnut Chart
    const doughnutOptions: ChartOptions<'doughnut'> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { color: tickColor, padding: 20 } } },
    }), [theme]);


    return {
        lineChartOptions,
        barChartOptions,
        historicalChartData,
        doughnutData,
        barAlertsData,
        doughnutOptions
    };
}