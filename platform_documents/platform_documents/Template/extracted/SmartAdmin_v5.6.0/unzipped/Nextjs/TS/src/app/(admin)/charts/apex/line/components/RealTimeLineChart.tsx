'use client'
import ComponentCard from '@/components/ComponentCard'
import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import { useCallback, useEffect, useRef, useState } from 'react'
import { generateRealtimeInitialData, getRealtimeLineOptions } from './data'

const RealTimeLineChart = () => {
  const dataRef = useRef(generateRealtimeInitialData(20))
  const [series, setSeries] = useState([
    {
      name: 'Dynamic Series',
      data: dataRef.current,
    },
  ])

  useEffect(() => {
    const TICKINTERVAL = 1000

    const updateRealtimeChart = () => {
      const nextTime = new Date().getTime()
      const nextValue = Math.floor(Math.random() * (100 - 30 + 1)) + 30

      dataRef.current.push({ x: nextTime, y: nextValue })

      if (dataRef.current.length > 50) {
        dataRef.current.shift()
      }

      setSeries([
        {
          name: 'Dynamic Series',
          data: [...dataRef.current],
        },
      ])
    }

    const interval = setInterval(updateRealtimeChart, TICKINTERVAL)
    return () => clearInterval(interval)
  }, [])

  const handleGetOptions = useCallback(() => getRealtimeLineOptions(), [])

  return (
    <>
      <ComponentCard
        title={
          <h2>
            Realtime{' '}
            <span className="fw-light">
              <i>Line</i>
            </span>
          </h2>
        }
        simpleDots={true}>
        <div className="panel-container show">
          <div className="panel-content">
            <ApexChartClient getOptions={handleGetOptions} series={series} type="line" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export default RealTimeLineChart
