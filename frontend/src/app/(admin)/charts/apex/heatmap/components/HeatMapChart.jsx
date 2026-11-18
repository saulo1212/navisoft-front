'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { colorRangeHeatmapOptions, getBasicHeatmapOptions, multipleSeriesHeatmapOptions } from './data';
export const BasicHeatMapChart = () => {
  return <>
      <ComponentCard title={<h2>
            Basic
            <span className="fw-light">
              <i>Heatmap</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getBasicHeatmapOptions} series={getBasicHeatmapOptions().series} type="bar" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const ColorRangeHeatmap = () => {
  return <>
      <ComponentCard title={<h2>
            Color Range
            <span className="fw-light">
              <i>Heatmap</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={colorRangeHeatmapOptions} series={colorRangeHeatmapOptions().series} type="bar" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const MultipleSeriesHeatmap = () => {
  return <>
      <ComponentCard title={<h2>
            Multiple Series
            <span className="fw-light">
              <i>Heatmap</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={multipleSeriesHeatmapOptions} series={multipleSeriesHeatmapOptions().series} type="bar" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};