'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { getBasicColumnOptions, getColumnWithDataLabelsOptions, getColumnWithGroupLabelOptions, getColumnWithMarkersOptions, getColumnWithNegativeValuesOptions, getColumnWithRotatedLabelsOptions, getDistributedColumnOptions, getDumbbellColumnOptions, getGroupedStackedColumnOptions, getStacked100ColumnOptions, getStackedColumnOptions } from './data';
export const BasicColumn = () => {
  return <ComponentCard title={<h2>
          Basic
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBasicColumnOptions} series={getBasicColumnOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const StackedColumn = () => {
  return <ComponentCard title={<h2>
          Stacked Columns
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getStackedColumnOptions} series={getStackedColumnOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const GroupedStackedColumn = () => {
  return <ComponentCard title={<h2>
          Grouped Stacked Columns
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getGroupedStackedColumnOptions} series={getGroupedStackedColumnOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const ColumnWithMarkers = () => {
  return <ComponentCard title={<h2>
          Column with Markers
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getColumnWithMarkersOptions} series={getColumnWithMarkersOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const ColumnWithRotatedLabels = () => {
  return <ComponentCard title={<h2>
          Column with Rotated Labels
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getColumnWithRotatedLabelsOptions} series={getColumnWithRotatedLabelsOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const ColumnWithDataLabels = () => {
  return <ComponentCard title={<h2>
          Column with Data Labels
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getColumnWithDataLabelsOptions} series={getColumnWithDataLabelsOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const StackedColumns100 = () => {
  return <ComponentCard title={<h2>
          Stacked Columns 100
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getStacked100ColumnOptions} series={getStacked100ColumnOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const DumbbellChart = () => {
  return <ComponentCard title={<h2>
          Dumbbell Chart
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getDumbbellColumnOptions} series={getDumbbellColumnOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const ColumnWithGroupLabel = () => {
  return <ComponentCard title={<h2>
          Column with Group Label
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getColumnWithGroupLabelOptions} series={getColumnWithGroupLabelOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const ColumnWithNegativeValues = () => {
  return <ComponentCard title={<h2>
          Column with Negative Values
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getColumnWithNegativeValuesOptions} series={getColumnWithNegativeValuesOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const DistributedColumns = () => {
  return <ComponentCard title={<h2>
          Distributed Columns
          <span className="fw-light">
            <i>Column</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getDistributedColumnOptions} series={getDistributedColumnOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};