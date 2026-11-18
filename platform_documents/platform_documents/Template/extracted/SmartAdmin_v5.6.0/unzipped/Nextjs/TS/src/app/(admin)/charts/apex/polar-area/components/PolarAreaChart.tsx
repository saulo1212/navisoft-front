'use client'
import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import ComponentCard from '@/components/ComponentCard'
import { getBasicPolarAreaOptions, getMonochromePolarAreaOptions } from './data'

export const BasicPolarArea = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Simple Pie
          <span className="fw-light">
            <i>Chart</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBasicPolarAreaOptions} series={getBasicPolarAreaOptions().series} type="polarArea" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const MonochromePolarArea = () => {
  return (
    <ComponentCard
      title={
        <h2>
          {' '}
          Monochrome{' '}
          <span className="fw-light">
            <i>Polar Area</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getMonochromePolarAreaOptions} series={getMonochromePolarAreaOptions().series} type="polarArea" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}
