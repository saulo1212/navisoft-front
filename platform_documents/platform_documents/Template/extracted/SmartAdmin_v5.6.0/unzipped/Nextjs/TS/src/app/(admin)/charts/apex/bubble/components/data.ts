import { getColor } from '@/utils/getColor'
import { ApexOptions } from 'apexcharts'

function generateBubbleData(baseval: number, count: number, yrange: { min: number; max: number }) {
  let i = 0
  const series = []
  while (i < count) {
    const x = Math.floor(Math.random() * (45 - 20 + 1)) + 20
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15

    series.push([x, y, z])
    baseval += 86400000
    i++
  }
  return series
}

function generateData(count: number, yrange: { min: number; max: number }) {
  let i = 0
  const series = []
  while (i < count) {
    const x = (Math.floor(Math.random() * 100) + 1).toString()
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    const z = Math.floor(Math.random() * 20) + 10

    series.push({
      x: x,
      y: y,
      z: z,
    })
    i++
  }
  return series
}

export const getSimpleBubbleOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Bubble 1',
      data: generateBubbleData(new Date('11 Feb 2022 GMT').getTime(), 20, {
        min: 10,
        max: 60,
      }),
    },
    {
      name: 'Bubble 2',
      data: generateBubbleData(new Date('11 Feb 2022 GMT').getTime(), 20, {
        min: 10,
        max: 60,
      }),
    },
    {
      name: 'Bubble 3',
      data: generateBubbleData(new Date('11 Feb 2022 GMT').getTime(), 20, {
        min: 10,
        max: 60,
      }),
    },
  ],
  chart: {
    height: 350,
    type: 'bubble',
    toolbar: {
      show: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 0.8,
  },
  xaxis: {
    tickAmount: 12,
    type: 'category',
  },
  yaxis: {
    max: 70,
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('primary', 200)],
  legend: {
    position: 'bottom',
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
})

export const getBubbleChart3dOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Product 1',
      data: generateData(30, {
        min: 10,
        max: 80,
      }),
    },
    {
      name: 'Product 2',
      data: generateData(30, {
        min: 10,
        max: 80,
      }),
    },
    {
      name: 'Product 3',
      data: generateData(30, {
        min: 10,
        max: 80,
      }),
    },
  ],
  chart: {
    height: 350,
    type: 'bubble',
    toolbar: {
      show: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      // gradientToColors: [getColor('bootstrapVars', 'bodyBg', 'hex')],
      opacityFrom: 0.8,
      opacityTo: 0.5,
    },
  },
  xaxis: {
    type: 'category',
    tickAmount: 10,
  },
  yaxis: {
    max: 90,
    tickAmount: 7,
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('primary', 200)],
  legend: {
    position: 'bottom',
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
})
