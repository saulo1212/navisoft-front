'use client'
import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import ComponentCard from '@/components/ComponentCard'
import { getBasicCandlestickOptions, getCandlestickWithLineOptions, getCategoryXAxisOptions, getComboCandlestickOptions } from './data'

export const BasicCandlestick = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Basic
          <span className="fw-light">
            <i>Candlestick</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBasicCandlestickOptions} series={getBasicCandlestickOptions().series} type="candlestick" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const ComboCandlestick = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Combo
          <span className="fw-light">
            <i>Candlestick</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getComboCandlestickOptions} series={getComboCandlestickOptions().series} type="candlestick" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const CategoryXAxisCandlestick = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Category x-axis
          <span className="fw-light">
            <i>Candlestick</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getCategoryXAxisOptions} series={getCategoryXAxisOptions().series} type="candlestick" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const CandlestickWithLine = () => {
  return (
    <ComponentCard
      title={
        <h2>
          {' '}
          Candlestick with line{' '}
          <span className="fw-light">
            <i>Candlestick</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient
            getOptions={getCandlestickWithLineOptions}
            series={getCandlestickWithLineOptions().series}
            type="candlestick"
            height={350}
          />
        </div>
      </div>
    </ComponentCard>
  )
}
