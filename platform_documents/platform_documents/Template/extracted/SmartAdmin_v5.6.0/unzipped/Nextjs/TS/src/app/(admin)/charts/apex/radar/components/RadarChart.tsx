'use client'
import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import ComponentCard from '@/components/ComponentCard'
import { getBasicRadarOptions, getMultiSeriesRadarOptions, getPolygonFillRadarOptions } from './data'

export const BasicRadar = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Basic
          <span className="fw-light">
            <i>Radar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBasicRadarOptions} series={getBasicRadarOptions().series} type="polarArea" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const RadarWithPolygonFill = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Radar with Polygon-fill
          <span className="fw-light">
            <i>Radar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getPolygonFillRadarOptions} series={getPolygonFillRadarOptions().series} type="polarArea" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const RadarMultipleSeries = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Radar - Multiple Series
          <span className="fw-light">
            <i>Radar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getMultiSeriesRadarOptions} series={getMultiSeriesRadarOptions().series} type="radar" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}
