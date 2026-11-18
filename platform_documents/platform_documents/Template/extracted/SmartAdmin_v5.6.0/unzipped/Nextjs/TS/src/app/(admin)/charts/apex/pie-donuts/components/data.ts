import { getColor } from '@/utils/getColor'
import type { ApexOptions } from 'apexcharts'

import gallery10 from '@/assets/img/demo/gallery/10.jpg'
import gallery15 from '@/assets/img/demo/gallery/15.jpg'
import gallery20 from '@/assets/img/demo/gallery/20.jpg'
import gallery7 from '@/assets/img/demo/gallery/7.jpg'

export function getRandomDonutSeries() {
  return [
    Math.floor(Math.random() * 91) + 10,
    Math.floor(Math.random() * 91) + 10,
    Math.floor(Math.random() * 91) + 10,
    Math.floor(Math.random() * 91) + 10,
  ]
}

type FormatterOpts = {
  seriesIndex: number
  dataPointIndex: number
  w: {
    config: {
      series: number[]
    }
    globals: {
      seriesTotals: number[]
    }
  }
}

type TotalFormatterW = {
  globals: {
    seriesTotals: number[]
  }
}

export const getSimplePieOptions = (): ApexOptions => ({
  series: [44, 55, 13, 43, 22],
  chart: {
    width: '100%',
    height: 380,
    type: 'pie',
  },
  title: {
    text: 'Simple Pie Chart',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  legend: {
    position: 'right',
    offsetY: 0,
    height: 230,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
  colors: [getColor('primary', 500), getColor('primary', 400), getColor('primary', 300), getColor('primary', 200), getColor('primary', 600)],
})

export const simpleDonutOptions = (): ApexOptions => ({
  series: [44, 55, 41, 17, 15],
  chart: {
    width: '100%',
    height: 380,
    type: 'donut',
  },
  title: {
    text: 'Simple Donut Chart',
    align: 'left',
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  legend: {
    position: 'right',
    offsetY: 0,
    height: 230,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
  colors: [getColor('primary', 500), getColor('primary', 400), getColor('primary', 300), getColor('primary', 200), getColor('primary', 600)],
})

export const getDonutUpdateOptions = (): ApexOptions => ({
  chart: {
    width: '100%',
    height: 380,
    type: 'donut',
  },
  title: {
    text: 'Donut Update Chart (Click to Update)',
    align: 'left',
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D'],
  dataLabels: {
    enabled: true,
    formatter: (val: string | number | number[], opts?: FormatterOpts) => {
      return opts?.w.config.series[opts.seriesIndex] + '%'
    },
  },
  legend: {
    position: 'right',
    offsetY: 0,
    height: 230,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
  colors: [getColor('primary', 500), getColor('primary', 400), getColor('primary', 300), getColor('primary', 200)],
})

export const getMonochromePieOptions = (): ApexOptions => ({
  series: [12.7, 7.6, 22.3, 27.9, 20.8, 8.5],
  chart: {
    width: '100%',
    height: 380,
    type: 'pie',
  },
  title: {
    text: 'Monochrome Pie Chart',
    align: 'left',
  },
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  theme: {
    monochrome: {
      enabled: true,
      color: getColor('primary', 300),
      shadeTo: 'dark',
      shadeIntensity: 0.65,
    },
  },
  legend: {
    position: 'right',
    offsetY: 0,
    height: 230,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  dataLabels: {
    formatter: (val: number) => {
      return val.toFixed(1) + '%'
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
})

export const getGradientDonutOptions = (): ApexOptions => ({
  series: [25.5, 32, 21.8, 9.9, 8.7],
  chart: {
    width: '100%',
    height: 380,
    type: 'donut',
  },
  plotOptions: {
    pie: {
      startAngle: 0,
      endAngle: 360,
      donut: {
        size: '65%',
        labels: {
          show: true,
          name: {
            show: true,
          },
          value: {
            show: true,
            color: getColor('bootstrapVars', 'bodyColor', 'hex'),
            formatter: (val: string | number) => {
              return parseFloat(String(val)).toFixed(1) + '%'
            },
          },
          total: {
            show: true,
            label: 'Total',
            color: getColor('bootstrapVars', 'bodyColor', 'hex'),
            formatter: (w: TotalFormatterW) => {
              return (
                w.globals.seriesTotals
                  .reduce((a: number, b: number) => {
                    return a + b
                  }, 0)
                  .toFixed(1) + '%'
              )
            },
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    type: 'gradient',
    gradient: {
      gradientToColors: ['var(--primary-900)', 'var(--success-900)', 'var(--info-900)', 'var(--danger-900)', 'var(--warning-900)'],
      shade: 'dark',
      type: 'vertical',
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 0.6,
      stops: [0, 100],
    },
  },
  stroke: {
    width: 0,
  },
  legend: {
    position: 'right',
    offsetY: 0,
    height: 230,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  title: {
    text: 'Gradient Donut Chart',
    align: 'left',
  },
  labels: ['Products', 'Services', 'Support', 'Marketing', 'R&D'],
  colors: [getColor('primary', 500), getColor('success', 500), getColor('info', 500), getColor('danger', 500), getColor('warning', 500)],
})

export const getPatternDonutOptions = (): ApexOptions => ({
  series: [44, 55, 41, 17, 15],
  chart: {
    width: '100%',
    height: 380,
    type: 'donut',
    dropShadow: {
      enabled: true,
      color: '#111',
      top: -1,
      left: 3,
      blur: 3,
      opacity: 0.2,
    },
  },
  stroke: {
    width: 0,
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            color: getColor('bootstrapVars', 'bodyColor', 'hex'),
            fontSize: '14px',
          },
          value: {
            show: true,
            fontSize: '16px',
            formatter: (val: string) => {
              return val + '%'
            },
            color: getColor('bootstrapVars', 'bodyColor', 'hex'),
          },
          total: {
            show: true,
            showAlways: true,
            label: 'Total',
            fontSize: '16px',
            fontWeight: 600,
            color: getColor('bootstrapVars', 'bodyColor', 'hex'),
            formatter: (w: TotalFormatterW) => {
              return String(
                w.globals.seriesTotals.reduce((a: number, b: number) => {
                  return a + b
                }, 0),
              )
            },
          },
        },
      },
    },
  },
  labels: ['Comedy', 'Action', 'SciFi', 'Drama', 'Horror'],
  dataLabels: {
    enabled: true,
    dropShadow: {
      blur: 3,
      opacity: 0.8,
    },
    background: {
      enabled: true,
      foreColor: '#000',
      padding: 4,
      borderRadius: 2,
      borderWidth: 1,
      opacity: 0.9,
    },
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      colors: ['#fff'],
    },
  },
  fill: {
    type: 'pattern',
    opacity: 1,
    pattern: {
      style: ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'],
    },
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
  },
  theme: {
    palette: 'palette2',
  },
  colors: [getColor('primary', 500), getColor('info', 500), getColor('success', 500), getColor('danger', 500), getColor('warning', 500)],
  title: {
    text: 'Favorite Movie Genre',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  legend: {
    position: 'right',
    offsetY: 0,
    height: 230,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
})

export const getSemiDonutOptions = (): ApexOptions => ({
  series: [44, 55, 41, 17, 15],
  chart: {
    width: '100%',
    height: 300,
    type: 'donut',
  },
  title: {
    text: 'Semi Donut Chart',
    align: 'left',
  },
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 90,
      offsetY: -20,
      donut: {
        size: '65%',
        labels: {
          show: true,
          name: {
            show: true,
          },
          value: {
            show: true,
            formatter: (val: string) => {
              return val + '%'
            },
          },
        },
      },
    },
  },
  grid: {
    padding: {
      bottom: -100,
    },
  },
  legend: {
    position: 'right',
    offsetY: 40,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  colors: [getColor('primary', 500), getColor('primary', 400), getColor('primary', 300), getColor('primary', 200), getColor('primary', 600)],
 
})

export const getPieWithImageOptions = (): ApexOptions => ({
  series: [44, 33, 54, 45],
  chart: {
    width: '100%',
    height: 380,
    type: 'pie',
  },
  colors: [getColor('primary', 500), getColor('primary', 400), getColor('primary', 300), getColor('primary', 200)],
  fill: {
    type: 'image',
    opacity: 0.85,
    image: {
      src: [gallery15.src, gallery7.src, gallery10.src, gallery20.src],
    },
  },
  stroke: {
    width: 4,
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#111'],
    },
    background: {
      enabled: true,
      foreColor: '#fff',
      borderWidth: 0,
    },
  },
  legend: {
    position: 'right',
    offsetY: 0,
    height: 230,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  title: {
    text: 'Image Fill Pie Chart',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
})
