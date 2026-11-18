'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { useCallback, useEffect, useState } from 'react';
import { getDynamicLoadedColumnOptions } from './data';
export const DynamicLoadedChart = () => {
  const [chartOptions, setChartOptions] = useState(() => getDynamicLoadedColumnOptions());
  const [chartSeries, setChartSeries] = useState([{
    name: 'Load',
    data: []
  }]);
  const updateDynamicChart = useCallback(() => {
    const newData = [];
    const newCategories = [];
    for (let i = 1; i <= 10; i++) {
      newData.push(Math.floor(Math.random() * 90) + 10);
      newCategories.push('Item ' + i);
    }
    setChartSeries([{
      name: 'Load',
      data: newData
    }]);
    setChartOptions(prevOptions => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: newCategories
      }
    }));
  }, []);
  useEffect(() => {
    const initialTimeout = setTimeout(updateDynamicChart, 1000);
    const intervalId = setInterval(updateDynamicChart, 5000);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [updateDynamicChart]);
  const handleGetOptions = useCallback(() => chartOptions, [chartOptions]);
  return <ComponentCard title={<h2>
          Dynamic Loaded Chart{' '}
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <ApexChartClient getOptions={handleGetOptions} series={chartSeries} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};