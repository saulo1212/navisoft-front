'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { getBubbleChart3dOptions, getSimpleBubbleOptions } from './data';
export const SimpleBubbleChart = () => {
  return <ComponentCard title={<h2>
          Simple
          <span className="fw-light">
            <i>Bubble</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getSimpleBubbleOptions} series={getSimpleBubbleOptions().series} type="bubble" height={350} />
        </div>
      </div>
    </ComponentCard>;
};
export const Bubble3DChart = () => {
  return <ComponentCard title={<h2>
          3D Bubble
          <span className="fw-light">
            <i>Chart</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBubbleChart3dOptions} series={getBubbleChart3dOptions().series} type="bubble" height={350} />
        </div>
      </div>
    </ComponentCard>;
};