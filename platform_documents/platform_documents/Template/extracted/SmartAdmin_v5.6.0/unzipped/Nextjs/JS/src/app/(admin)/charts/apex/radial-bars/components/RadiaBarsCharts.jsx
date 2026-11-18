'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { getBasicRadialbarOptions, getCustomAngleOptions, getGradientRadialbarOptions, getMultipleRadialbarOptions, getSemiCircleGaugeOptions, getStrokedGaugeOptions, radialbarWithImageOptions } from './data';
export const BasicRadialBars = () => {
  return <ComponentCard title={<h2>
          Basic
          <span className="fw-light">
            <i>RadialBars</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBasicRadialbarOptions} series={getBasicRadialbarOptions().series} type="radialBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const CustomAngleCircle = () => {
  return <ComponentCard title={<h2>
          Basic
          <span className="fw-light">
            <i>RadialBars</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getCustomAngleOptions} series={getCustomAngleOptions().series} type="radialBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const RadialbarsWithImage = () => {
  return <ComponentCard title={<h2>
          Radialbars with Image
          <span className="fw-light">
            <i>RadialBars</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={radialbarWithImageOptions} series={radialbarWithImageOptions().series} type="radialBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const SemiCircleGauge = () => {
  return <ComponentCard title={<h2>
          Semi Circle Gauge
          <span className="fw-light">
            <i>RadialBars</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getSemiCircleGaugeOptions} series={getSemiCircleGaugeOptions().series} type="radialBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const MultipleRadialBars = () => {
  return <ComponentCard title={<h2>
          Multiple
          <span className="fw-light">
            <i>RadialBars</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getMultipleRadialbarOptions} series={getMultipleRadialbarOptions().series} type="radialBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const GradientRadialBars = () => {
  return <ComponentCard title={<h2>
          Gradient
          <span className="fw-light">
            <i>RadialBars</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getGradientRadialbarOptions} series={getGradientRadialbarOptions().series} type="radialBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const StrokedGauge = () => {
  return <ComponentCard title={<h2>
          {' '}
          Stroked Gauge{' '}
          <span className="fw-light">
            <i>RadialBars</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getStrokedGaugeOptions} series={getStrokedGaugeOptions().series} type="radialBar" height={350} />
        </div>
      </div>
    </ComponentCard>;
};