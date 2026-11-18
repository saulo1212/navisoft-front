'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { brushChartOptions, brushChartSmallOptions, generateBrushCategories, generateSyncData, getBasicLineOptions, getDashedLineOptions, getGradientLineOptions, getLineWithAnnotationsOptions, getLineWithDataLabelsOptions, getNullValuesOptions, getStepLineOptions, getSyncChartSmallOptions, getZoomableTimeseriesOptions, negativeValuesOptions, syncChartOptions } from './data';
export const BasicLine = () => {
  return <>
      <ComponentCard title={<h2>
            Basic
            <span className="fw-light">
              <i>Line</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getBasicLineOptions} series={getBasicLineOptions().series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const ZoomableTimeseries = () => {
  return <>
      <ComponentCard title={<h2>
            Zoomable Timeseries
            <span className="fw-light">
              <i>Line</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getZoomableTimeseriesOptions} series={getZoomableTimeseriesOptions().series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
const syncData = generateSyncData(20, 50, 80);
export const SynchronizedCharts = () => {
  return <>
      <ComponentCard title={<h2>
            Synchronized charts
            <span className="fw-light">
              <i>Line</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={() => syncChartOptions(syncData)} series={syncChartOptions(syncData).series} type="line" height={250} />
            <ApexChartClient getOptions={() => getSyncChartSmallOptions(syncData)} series={getSyncChartSmallOptions(syncData).series} type="line" height={250} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const SteplineLine = () => {
  return <>
      <ComponentCard title={<h2>
            Stepline
            <span className="fw-light">
              <i>Line</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getStepLineOptions} series={getStepLineOptions().series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const NegativeValuesWithDifferentColor = () => {
  return <>
      <ComponentCard title={<h2>
            Negative values with different color
            <span className="fw-light">
              <i>Line</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={negativeValuesOptions} series={negativeValuesOptions().series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const LineWithDataLabels = () => {
  return <ComponentCard title={<h2>
          Line with Data Labels
          <span className="fw-light">
            <i>Line</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getLineWithDataLabelsOptions} series={getLineWithDataLabelsOptions().series} type="line" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const LineChartWithAnnotations = () => {
  return <ComponentCard title={<h2>
          Line Chart with Annotations
          <span className="fw-light">
            <i>Line</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getLineWithAnnotationsOptions} series={getLineWithAnnotationsOptions().series} type="line" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
const brushCategories = generateBrushCategories(27);
export const BrushChart = () => {
  return <ComponentCard title={<h2>
          Brush chart
          <span className="fw-light">
            <i>Line</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={() => brushChartOptions(brushCategories)} series={brushChartOptions(brushCategories).series} type="line" height={230} />
          <ApexChartClient getOptions={() => brushChartSmallOptions(brushCategories)} series={brushChartSmallOptions(brushCategories).series} type="line" height={130} />
        </div>
      </div>
    </ComponentCard>;
};
export const GradientLine = () => {
  return <ComponentCard title={<h2>
          GradientLine
          <span className="fw-light">
            <i>Line</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getGradientLineOptions} series={getGradientLineOptions().series} type="line" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const MissingNullValues = () => {
  return <ComponentCard title={<h2>
          Missing/null values
          <span className="fw-light">
            <i>Line</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getNullValuesOptions} series={getNullValuesOptions().series} type="line" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const DashedLine = () => {
  return <ComponentCard title={<h2>
          Dashed
          <span className="fw-light">
            <i>Line</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getDashedLineOptions} series={getDashedLineOptions().series} type="line" height={350} />
        </div>
      </div>
    </ComponentCard>;
};