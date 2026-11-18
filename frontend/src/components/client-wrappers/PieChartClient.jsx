'use client';

import { useEffect, useRef } from 'react';
export default function EasyPieChart({
  percent,
  piesize = 50,
  scalelength = 0,
  scalecolor,
  linewidth,
  linecap = 'butt',
  className = ''
}) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined' || !chartRef.current) return;
    const initChart = async () => {
      try {
        const EasyPieChartLib = (await import('easy-pie-chart')).default;
        const element = chartRef.current;
        if (!element) return;
        const existingCanvases = element.querySelectorAll('canvas');
        existingCanvases.forEach(canvas => canvas.remove());
        const computedStyle = window.getComputedStyle(element);
        const barcolor = computedStyle.color || 'var(--primary-700)';
        const finalScaleColor = scalecolor || computedStyle.color;
        let trackcolor = 'rgba(0,0,0,0.04)';
        try {
          const globalWin = window;
          if (globalWin.colorMap?.bootstrapVars?.bodyColorRgb) {
            trackcolor = globalWin.colorMap.bootstrapVars.bodyColorRgb.rgba(0.07);
          }
        } catch (e) {}
        const finalLineWidth = linewidth || Math.floor(piesize / 8.5);
        const chart = new EasyPieChartLib(element, {
          size: piesize,
          barColor: barcolor,
          trackColor: trackcolor,
          scaleColor: finalScaleColor,
          scaleLength: scalelength,
          lineCap: linecap,
          lineWidth: finalLineWidth,
          animate: {
            duration: 1500,
            enabled: true
          },
          easing: 'easeOutQuad',
          onStep: function (from, to, currentPercent) {
            const percentElement = element.querySelector('.js-percent');
            if (percentElement) {
              percentElement.textContent = String(Math.round(currentPercent));
            }
          }
        });
        chart.update(percent);
        chartInstanceRef.current = chart;
        const globalWin = window;
        if (!globalWin.easyPieChartRegistry) {
          globalWin.easyPieChartRegistry = {
            instances: [],
            elements: []
          };
        }
        globalWin.easyPieChartRegistry.instances.push(chart);
        globalWin.easyPieChartRegistry.elements.push(element);
      } catch (error) {
        console.error('Failed to initialize EasyPieChart:', error);
      }
    };
    initChart();
    return () => {
      if (chartInstanceRef.current && typeof window !== 'undefined') {
        const globalWin = window;
        if (globalWin.easyPieChartRegistry) {
          globalWin.easyPieChartRegistry.instances = globalWin.easyPieChartRegistry.instances.filter(i => i !== chartInstanceRef.current);
          globalWin.easyPieChartRegistry.elements = globalWin.easyPieChartRegistry.elements.filter(e => e !== chartRef.current);
        }
      }
    };
  }, [piesize, scalelength, scalecolor, linewidth, linecap]);
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.update(percent);
    }
  }, [percent]);
  return <div ref={chartRef} className={`js-easy-pie-chart ${className}`}>
      <span className="js-percent" style={{
      display: 'none'
    }}>
        {percent}
      </span>
    </div>;
}