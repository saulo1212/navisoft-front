'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { getBasicRangeAreaOptions, getComboRangeAreaOptions, getDatetimeRangeAreaOptions, getMultipleRangeAreaOptions } from './data';
export const BasicRangeArea = () => {
  return <ComponentCard title={<h2>
          Basic
          <span className="fw-light">
            <i>Range Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBasicRangeAreaOptions} series={getBasicRangeAreaOptions().series} type="rangeArea" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const DatetimeRangeArea = () => {
  return <ComponentCard title={<h2>
          Datetime
          <span className="fw-light">
            <i>Range Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getDatetimeRangeAreaOptions} series={getDatetimeRangeAreaOptions().series} type="rangeArea" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const ComboRangeArea = () => {
  return <ComponentCard title={<h2>
          Combo
          <span className="fw-light">
            <i>Range Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getComboRangeAreaOptions} series={getComboRangeAreaOptions().series} type="rangeArea" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const MultipleRangeArea = () => {
  return <ComponentCard title={<h2>
          Multiple
          <span className="fw-light">
            <i>Range Area</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getMultipleRangeAreaOptions} series={getMultipleRangeAreaOptions().series} type="rangeArea" height={350} />
        </div>
      </div>
    </ComponentCard>;
};