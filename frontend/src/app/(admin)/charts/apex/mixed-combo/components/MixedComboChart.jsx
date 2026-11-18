'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { generateScatterData, getLineAreaOptions, getLineColumnAreaOptions, getLineColumnOptions, getLineScatterOptions, getMultipleYAxisOptions } from './data';
export const LineColumn = () => {
  return <>
      <ComponentCard title={<h2>
            Line Column
            <span className="fw-light">
              <i>Mixed</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getLineColumnOptions} series={getLineColumnOptions().series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const LineAndArea = () => {
  return <>
      <ComponentCard title={<h2>
            Line &amp; Area
            <span className="fw-light">
              <i>Mixed</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getLineAreaOptions} series={getLineAreaOptions().series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
const scatterData = generateScatterData(100, 0, 100);
export const LineScatterMixed = () => {
  return <>
      <ComponentCard title={<h2>
            Line Scatter
            <span className="fw-light">
              <i>Mixed</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={() => getLineScatterOptions(scatterData)} series={getLineScatterOptions(scatterData).series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const MultipleYAxis = () => {
  return <>
      <ComponentCard title={<h2>
            Multiple Y-Axis
            <span className="fw-light">
              <i>Mixed</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getMultipleYAxisOptions} series={getMultipleYAxisOptions().series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const LineColumnArea = () => {
  return <>
      <ComponentCard title={<h2>
            Line Column Area
            <span className="fw-light">
              <i>Mixed</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getLineColumnAreaOptions} series={getLineColumnAreaOptions().series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};