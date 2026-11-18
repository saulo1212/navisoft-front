'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { useState } from 'react';
import { getDonutUpdateOptions, getGradientDonutOptions, getMonochromePieOptions, getPatternDonutOptions, getPieWithImageOptions, getRandomDonutSeries, getSemiDonutOptions, getSimplePieOptions, simpleDonutOptions } from './data';
export const SimplePieChart = () => {
  return <>
      <ComponentCard title={<h2>
            Simple Pie
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getSimplePieOptions} series={getSimplePieOptions().series} type="pie" height={380} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const DonutUpdate = () => {
  const [donutUpdateSeries, setDonutUpdateSeries] = useState([44, 55, 13, 33]);
  const updateDonut = () => {
    setDonutUpdateSeries(getRandomDonutSeries());
  };
  return <>
      <ComponentCard title={<h2>
            Donut Update
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <div onClick={updateDonut}>
              <ApexChartClient getOptions={getDonutUpdateOptions} series={donutUpdateSeries} width="100%" type="donut" height={380} />
            </div>
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const GradientDonut = () => {
  return <>
      <ComponentCard title={<h2>
            Gradient Donut
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getGradientDonutOptions} series={getGradientDonutOptions().series} type="donut" height={380} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const DonutWithPattern = () => {
  return <>
      <ComponentCard title={<h2>
            Donut with Pattern
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getPatternDonutOptions} series={getPatternDonutOptions().series} type="donut" height={380} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const SimpleDonut = () => {
  return <>
      <ComponentCard title={<h2>
            Simple Donut
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={simpleDonutOptions} series={simpleDonutOptions().series} type="donut" height={380} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const MonochromePie = () => {
  return <>
      <ComponentCard title={<h2>
            Monochrome Pie
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getMonochromePieOptions} series={getMonochromePieOptions().series} type="donut" height={380} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const SemiDonut = () => {
  return <>
      <ComponentCard title={<h2>
            Semi Donut
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getSemiDonutOptions} series={getSemiDonutOptions().series} type="donut" height={300} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const PieWithImageChart = () => {
  return <ComponentCard title={<h2>
          Pie with Image
          <span className="fw-light">
            <i>Chart</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getPieWithImageOptions} series={getPieWithImageOptions().series} type="donut" height={300} />
        </div>
      </div>
    </ComponentCard>;
};