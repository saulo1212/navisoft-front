'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { getBasicTreemapOptions, getColorRangeOptions, getDistributedTreemapOptions, getMultiSeriesTreemapOptions } from './data';
export const BasicTimeLineChart = () => {
  return <ComponentCard title={<h2>
          Basic
          <span className="fw-light">
            <i>Treemap</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBasicTreemapOptions} series={getBasicTreemapOptions().series} type="treemap" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const ColorRangeTimeLineChart = () => {
  return <ComponentCard title={<h2>
          Color range
          <span className="fw-light">
            <i>Treemap</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getColorRangeOptions} series={getColorRangeOptions().series} type="treemap" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const MultipleSeriesTimeLineChart = () => {
  return <ComponentCard title={<h2>
          Multiple Series
          <span className="fw-light">
            <i>Treemap</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getMultiSeriesTreemapOptions} series={getMultiSeriesTreemapOptions().series} type="treemap" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const DistributedTimeLineChart = () => {
  return <ComponentCard title={<h2>
          Distributed
          <span className="fw-light">
            <i>Treemap</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getDistributedTreemapOptions} series={getDistributedTreemapOptions().series} type="treemap" height={350} />
        </div>
      </div>
    </ComponentCard>;
};