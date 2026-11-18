'use client'
import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import ComponentCard from '@/components/ComponentCard'
import { getBasicSlopeOptions, getMultiGroupSlopeOptions } from './data'

export const BasicSlopeChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Basic
            <span className="fw-light">
              <i>Slope</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getBasicSlopeOptions} series={getBasicSlopeOptions().series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const MultiGroupSlopeChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Multi group
            <span className="fw-light">
              <i>Slope</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getMultiGroupSlopeOptions} series={getMultiGroupSlopeOptions().series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>
  )
}
