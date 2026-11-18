'use client'
import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import ComponentCard from '@/components/ComponentCard'
import { getBasicBoxOptions, getHorizontalBoxplotOptions } from './data'

export const BasicBoxAndWhisker = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Basic
          <span className="fw-light">
            <i>Box &amp; Whisker</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBasicBoxOptions} series={getBasicBoxOptions().series} type="boxPlot" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const HorizontalBoxplotChart = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Horizontal BoxPlot
          <span className="fw-light">
            <i>Box & Whisker</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getHorizontalBoxplotOptions} series={getHorizontalBoxplotOptions().series} type="boxPlot" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}
