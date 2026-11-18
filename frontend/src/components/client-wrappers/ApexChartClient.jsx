'use client';

import { useLayoutContext } from '@/context/useLayoutContext';
import { initializeColorMap } from '@/utils/colorInit';
import { getColor } from '@/utils/getColor';
import merge from 'lodash.merge';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false
});
const ApexChart = ({
  type,
  height,
  width,
  getOptions,
  series,
  className,
  ...rest
}) => {
  const {
    theme,
    selectedTheme
  } = useLayoutContext();
  const [options, setOptions] = useState();
  const getDefaultChartOptions = () => ({
    chart: {
      fontFamily: 'inherit'
    },
    title: {
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
    subtitle: {
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.5)
      }
    },
    grid: {
      borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.2)
    },
    xaxis: {
      labels: {
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex')
        }
      },
      title: {
        style: {
          color: getColor('bootstrapVars', 'bodyColor', 'hex')
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex')
        }
      },
      title: {
        style: {
          color: getColor('bootstrapVars', 'bodyColor', 'hex')
        }
      }
    },
    tooltip: {
      theme: theme
    },
    legend: {
      labels: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      initializeColorMap();
      const mergedOptions = merge({}, getDefaultChartOptions(), getOptions());
      window.requestAnimationFrame(() => {
        setOptions(mergedOptions);
      });
    }, 1);
    return () => clearTimeout(timer);
  }, [theme, selectedTheme]);
  if (!options?.chart?.height) return null;
  return <ReactApexChart type={options.chart.type ?? type} height={height ?? options.chart.height} width={width ?? options.chart.width} options={{
    ...options
  }} series={options.series ?? series ?? []} className={className} {...rest} />;
};
export default ApexChart;