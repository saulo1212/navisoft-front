'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { getAdvancedTimelineOptions, getBasicTimelineOptions, getCustomColorsTimelineOptions, getDumbbellTimelineOptions, getMultipleSeriesGroupTimelineOptions, getMultiSeriesTimelineOptions } from './data';
export const BasicTimeLineChart = () => {
  return <ComponentCard title={<h2>
          Basic
          <span className="fw-light">
            <i>Timeline</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBasicTimelineOptions} series={getBasicTimelineOptions().series} type="rangeBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const MultiSeries = () => {
  return <ComponentCard title={<h2>
          Multi-series
          <span className="fw-light">
            <i>Timeline</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getMultiSeriesTimelineOptions} series={getMultiSeriesTimelineOptions().series} type="rangeBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const MultiSeriesGroupRows = () => {
  return <ComponentCard title={<h2>
          Multi-series
          <span className="fw-light">
            <i>Timeline</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getMultipleSeriesGroupTimelineOptions} series={getMultipleSeriesGroupTimelineOptions().series} type="rangeBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const CustomColorsTimeLine = () => {
  return <ComponentCard title={<h2>
          Custom Colors
          <span className="fw-light">
            <i>Timeline</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getCustomColorsTimelineOptions} series={getCustomColorsTimelineOptions().series} type="rangeBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const AdvancedTimeLine = () => {
  return <ComponentCard title={<h2>
          Advanced (Multiple ranges)
          <span className="fw-light">
            <i>Timeline</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getAdvancedTimelineOptions} series={getAdvancedTimelineOptions().series} type="rangeBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const DumbbellChartTimeLine = () => {
  return <ComponentCard title={<h2>
          Advanced (Multiple ranges)
          <span className="fw-light">
            <i>Timeline</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getDumbbellTimelineOptions} series={getDumbbellTimelineOptions().series} type="rangeBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};