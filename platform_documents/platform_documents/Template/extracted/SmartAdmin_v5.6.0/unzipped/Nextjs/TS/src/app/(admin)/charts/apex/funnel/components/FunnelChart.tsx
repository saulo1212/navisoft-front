'use client'
import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import ComponentCard from '@/components/ComponentCard'
import { getFunnelOptions, getPyramidOptions } from './data'

export const ApexFunnelChart = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Funnel
          <span className="fw-light">
            <i>Chart</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getFunnelOptions} series={getFunnelOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const PyramidChart = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Pyramid
          <span className="fw-light">
            <i>Chart</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getPyramidOptions} series={getPyramidOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}
