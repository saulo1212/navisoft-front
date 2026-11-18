import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import { ApexOptions } from 'apexcharts'
import clsx from 'clsx'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6'
import { StatisticWidgetType } from './data'

const StatisticWidgetWithChart = ({ item }: { item: StatisticWidgetType }) => {
  const { color, badge2, badge1, lineSeries, title, progress, isPositive } = item
  const chartOptions = (): ApexOptions => ({
    series: [
      {
        name: title,
        data: lineSeries,
      },
    ],
    chart: {
      height: 34,
      type: 'line',
      sparkline: { enabled: true },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
    },
    tooltip: {
      enabled: false,
    },
    colors: [color],
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
  })

  const getCircleProgressOptions = (): ApexOptions => ({
    chart: {
      type: 'radialBar',
      height: 74,
      width: 74,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '70%' },
        track: { background: '#f5f5f5', strokeWidth: '100%', margin: 0 },

        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: '16px',
            fontWeight: 200,
            formatter: (value) => `${value}`,
            color: color,
            offsetY: 4,
          },
        },
      },
    },
    colors: [color],
    stroke: {
      lineCap: 'round',
      width: 5,
    },
    labels: ['Progress'],
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
  })
  return (
    <div className="p-3 d-flex align-items-center">
      <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
        <ApexChartClient getOptions={getCircleProgressOptions} series={[progress]} type={'radialBar'} width={75} />
      </div>
      <span className="d-inline-block ms-2 text-muted">
        {title}
        {isPositive ? <FaCaretUp className="ms-1" /> : <FaCaretDown className="text-danger ms-1" />}
      </span>
      <div className="ms-auto d-inline-flex align-items-center">
        <ApexChartClient getOptions={chartOptions} series={chartOptions().series} type={'line'} width={70} />
        <div className="d-inline-flex flex-column small ms-2">
          <span className={clsx('d-inline-block badge opacity-75 text-center p-1 width-6', badge1.class)}>{badge1.label}</span>
          <span className={clsx('d-inline-block badge opacity-75 text-center p-1 width-6 mt-1', badge2.class)}>{badge2.label}</span>
        </div>
      </div>
    </div>
  )
}

export default StatisticWidgetWithChart
