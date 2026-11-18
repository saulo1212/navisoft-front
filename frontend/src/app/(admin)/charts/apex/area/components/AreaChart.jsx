'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { getBasicAreaChart, getDatetimeXAxisAreaChart, getGithubAreaChartBrushOptions, getGithubAreaChartOptions, getIrregularTimeseriesAreaChart, getNegativeAreaChartOptions, getNullValuesAreaChartOptions, getSplineAreaChartOptions, getStackedAreaChartOptions } from './data';
export const BasicArea = () => {
  return <ComponentCard title={<h2>
          Basic
          <span className="fw-light">
            <i>Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBasicAreaChart} series={getBasicAreaChart().series} type="area" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const DatetimeXAxis = () => {
  return <ComponentCard title={<h2>
          Datetime X-Axis
          <span className="fw-light">
            <i>Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content position-relative">
          <div className="d-flex justify-content-center gap-1">
            <button id="one_month" type="button" className="btn btn-xs btn-outline-default">
              1M
            </button>
            <button id="six_months" type="button" className="btn btn-xs btn-outline-default">
              6M
            </button>
            <button id="one_year" type="button" className="btn btn-xs btn-outline-default">
              1Y
            </button>
            <button id="ytd" type="button" className="btn btn-xs btn-outline-default">
              YTD
            </button>
            <button id="all" type="button" className="btn btn-xs btn-outline-default">
              All
            </button>
          </div>
          <ApexChartClient getOptions={getDatetimeXAxisAreaChart} series={getDatetimeXAxisAreaChart().series} type="area" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const GithubStyleArea = () => {
  return <ComponentCard title={<h2>
          Github Style
          <span className="fw-light">
            <i>Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getGithubAreaChartOptions} series={getGithubAreaChartOptions().series} type="area" height={180} />
          <ApexChartClient getOptions={getGithubAreaChartBrushOptions} series={getGithubAreaChartBrushOptions().series} type="area" height={130} />
        </div>
      </div>
    </ComponentCard>;
};
export const IrregularTimeseriesArea = () => {
  return <ComponentCard title={<h2>
          Irregular Timeseries
          <span className="fw-light">
            <i>Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getIrregularTimeseriesAreaChart} series={getIrregularTimeseriesAreaChart().series} type="area" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const SplineArea = () => {
  return <ComponentCard title={<h2>
          Spline
          <span className="fw-light">
            <i>Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getSplineAreaChartOptions} series={getSplineAreaChartOptions().series} type="area" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const NegativeArea = () => {
  return <ComponentCard title={<h2>
          Negative
          <span className="fw-light">
            <i>Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getNegativeAreaChartOptions} series={getNegativeAreaChartOptions().series} type="area" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const StackedArea = () => {
  return <ComponentCard title={<h2>
          Stacked
          <span className="fw-light">
            <i>Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getStackedAreaChartOptions} series={getStackedAreaChartOptions().series} type="area" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const MissingNullValues = () => {
  return <ComponentCard title={<h2>
          Missing/Null Values
          <span className="fw-light">
            <i>Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getNullValuesAreaChartOptions} series={getNullValuesAreaChartOptions().series} type="area" height={350} />
        </div>
      </div>
    </ComponentCard>;
};