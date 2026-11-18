import { getColor } from '@/utils/getColor'
import { ApexOptions } from 'apexcharts'

type TotalFormatterW = {
  globals: {
    seriesTotals: number[]
    series: number[][]
  }
}

type LegendFormatterOpts = {
  seriesIndex: number
  w: {
    globals: {
      series: number[]
    }
  }
}

export const getBasicRadialbarOptions = (): ApexOptions => ({
  series: [70],
  chart: {
    height: 350,
    type: 'radialBar',
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '70%',
      },
    },
  },
  labels: ['Progress'],
  colors: [getColor('success', 500)],
})

export const getMultipleRadialbarOptions = (): ApexOptions => ({
  series: [44, 55, 67, 83],
  chart: {
    height: 350,
    type: 'radialBar',
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '22px',
        },
        value: {
          fontSize: '16px',
        },
        total: {
          show: true,
          label: 'Total',
          formatter: (w: TotalFormatterW) => {
            return Math.round(w.globals.seriesTotals.reduce((a, b) => a + b, 0) / w.globals.series.length) + '%'
          },
        },
      },
    },
  },
  labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
  colors: [getColor('primary', 500), getColor('info', 500), getColor('success', 500), getColor('warning', 500)],
})

export const getCustomAngleOptions = (): ApexOptions => ({
  series: [76, 67, 61, 90],
  chart: {
    height: 350,
    type: 'radialBar',
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: 0,
      endAngle: 270,
      hollow: {
        margin: 5,
        size: '30%',
        background: 'transparent',
        image: undefined,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: false,
        },
      },
    },
  },
  colors: [getColor('primary', 500), getColor('info', 500), getColor('success', 500), getColor('warning', 500)],
  labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
  legend: {
    show: true,
    floating: true,
    fontSize: '16px',
    position: 'left',
    offsetX: 160,
    offsetY: 15,
    labels: {
      useSeriesColors: true,
    },
    markers: {
      size: 0,
    } as unknown as NonNullable<ApexOptions['legend']>['markers'],
    formatter: (seriesName: string, opts?: LegendFormatterOpts) => {
      return seriesName + ':  ' + (opts ? opts.w.globals.series[opts.seriesIndex] : '') + '%'
    },
    itemMargin: {
      vertical: 3,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          show: false,
        },
      },
    },
  ],
})

export const getGradientRadialbarOptions = (): ApexOptions => ({
  series: [75],
  chart: {
    height: 350,
    type: 'radialBar',
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 225,
      hollow: {
        margin: 0,
        size: '70%',
        background: '#fff',
        image: undefined,
        imageOffsetX: 0,
        imageOffsetY: 0,
        position: 'front',
        dropShadow: {
          enabled: true,
          top: 3,
          left: 0,
          blur: 4,
          opacity: 0.24,
        },
      },
      track: {
        background: '#fff',
        strokeWidth: '67%',
        margin: 0,
        dropShadow: {
          enabled: true,
          top: -3,
          left: 0,
          blur: 4,
          opacity: 0.35,
        },
      },
      dataLabels: {
        show: true,
        name: {
          offsetY: -10,
          show: true,
          color: '#888',
          fontSize: '17px',
        },
        value: {
          formatter: (val: string | number) => {
            return parseInt(String(val), 10) + '%'
          },
          color: '#111',
          fontSize: '36px',
          show: true,
        },
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: [getColor('primary', 500)],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['Percent'],
})

export const radialbarWithImageOptions = (): ApexOptions => ({
  series: [67],
  chart: {
    height: 350,
    type: 'radialBar',
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 225,
      hollow: {
        margin: 0,
        size: '70%',
        background: '#fff',
        image: 'assets/images/logo-sm.png',
        imageWidth: 150,
        imageHeight: 150,
        imageClipped: false,
        position: 'front',
        dropShadow: {
          enabled: true,
          top: 3,
          left: 0,
          blur: 4,
          opacity: 0.24,
        },
      },
      track: {
        background: '#fff',
        strokeWidth: '67%',
        margin: 0,
        dropShadow: {
          enabled: true,
          top: -3,
          left: 0,
          blur: 4,
          opacity: 0.35,
        },
      },
      dataLabels: {
        show: true,
        name: {
          offsetY: -10,
          show: true,
          color: '#888',
          fontSize: '17px',
        },
        value: {
          formatter: (val: string | number) => {
            return parseInt(String(val), 10) + '%'
          },
          color: '#111',
          fontSize: '36px',
          show: true,
        },
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: [getColor('primary', 600)],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['Performance'],
})

export const getStrokedGaugeOptions = (): ApexOptions => ({
  series: [67],
  chart: {
    height: 350,
    type: 'radialBar',
    offsetY: -10,
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      dataLabels: {
        name: {
          fontSize: '16px',
          color: undefined,
          offsetY: 120,
        },
        value: {
          offsetY: 76,
          fontSize: '22px',
          color: undefined,
          formatter: (val: string | number) => {
            return val + '%'
          },
        },
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      shadeIntensity: 0.15,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91],
    },
  },
  stroke: {
    dashArray: 4,
  },
  colors: [getColor('primary', 500)],
  labels: ['Performance'],
})

export const getSemiCircleGaugeOptions = (): ApexOptions => ({
  series: [76],
  chart: {
    type: 'radialBar',
    height: 350,
    offsetY: -20,
    sparkline: {
      enabled: true,
    },
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: '#e7e7e7',
        strokeWidth: '97%',
        margin: 5,
        dropShadow: {
          enabled: true,
          top: 2,
          left: 0,
          color: '#999',
          opacity: 1,
          blur: 2,
        },
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          offsetY: -2,
          fontSize: '22px',
        },
      },
    },
  },
  grid: {
    padding: {
      top: -10,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      shadeIntensity: 0.4,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 53, 91],
    },
  },
  colors: [getColor('primary', 500)],
  labels: ['Average Results'],
})
