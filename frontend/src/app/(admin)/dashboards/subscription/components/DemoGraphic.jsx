'use client';

import ComponentCard from '@/components/ComponentCard';
import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import { demoGraphicChartOptions } from './data';
const DemoGraphic = () => {
  return <ComponentCard title={<h2>
          {' '}
          Demographic{' '}
          <span className="fw-light">
            <i>Marketing</i>
          </span>
        </h2>}>
      <div className="panel-content">
        <ApexChartClient getOptions={demoGraphicChartOptions} series={[25, 30, 15, 10, 20]} type={'pie'} />
      </div>
    </ComponentCard>;
};
export default DemoGraphic;