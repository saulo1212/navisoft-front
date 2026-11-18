import { getColor } from '@/utils/getColor'
import { ApexOptions, ApexPlotOptions } from 'apexcharts'

type FunnelFormatterOpts = { w: { globals: { labels: string[] } }; dataPointIndex: number }

export const getFunnelOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Funnel',
      data: [1380, 1100, 690, 580, 380, 170],
    },
  ],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 0,
      horizontal: true,
      distributed: true,
      barHeight: '80%',
      isFunnel: true,
    } as ApexPlotOptions['bar'],
  },
  states: {
    hover: {
      // filter: {
      //   type: 'darken',
      //   value: 0.85,
      // } as { type: string },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number, opt?: FunnelFormatterOpts) => {
      return opt!.w.globals.labels[opt!.dataPointIndex] + ': ' + val
    },
    style: {
      fontSize: '12px',
      fontWeight: 600,
      colors: ['#fff'],
    },
    dropShadow: {
      enabled: false,
    },
  },
  title: {
    text: 'Website Conversion Funnel',
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: '600',
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  subtitle: {
    text: 'Sales Conversion Path Analysis',
    align: 'left',
    style: {
      fontSize: '12px',
      fontWeight: '400',
      color: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.6),
    },
  },
  xaxis: {
    categories: ['Visits', 'Unique Visitors', 'Signup', 'Demo Requests', 'Trials', 'Purchases'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  legend: {
    show: false,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  tooltip: {
    
    y: {
      formatter: (value: number) => {
        return value.toLocaleString()
      },
    },
  },
  colors: [
    getColor('primary', 500),
    getColor('primary', 400),
    getColor('primary', 300),
    getColor('primary', 200),
    getColor('primary', 100),
    getColor('danger', 500),
  ],
  grid: {
    padding: {
      left: 20,
      right: 20,
    },
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.2),
  },
})

export const getPyramidOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Pyramid',
      data: [120, 220, 350, 480, 580, 690, 1100],
    },
  ],
  chart: {
    type: 'bar',
    height: 380,
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      distributed: true,
      barHeight: '85%',
      isFunnel: true,
      flipFunnel: true,
    } as ApexPlotOptions['bar'],
  },
  states: {
    hover: {
      // filter: {
      //   type: 'darken',
      //   value: 0.85,
      // } as { type: string },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number, opt?: FunnelFormatterOpts) => {
      return opt!.w.globals.labels[opt!.dataPointIndex] + ': ' + val
    },
    style: {
      fontSize: '12px',
      fontWeight: 600,
      colors: ['#fff'],
    },
    offsetX: 15,
    dropShadow: {
      enabled: false,
    },
  },
  title: {
    text: 'Organization Structure',
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: '600',
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  subtitle: {
    text: 'Employee Distribution by Level',
    align: 'left',
    style: {
      fontSize: '12px',
      fontWeight: '400',
      color: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.6),
    },
  },
  legend: {
    show: false,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  grid: {
    show: false,
    padding: {
      left: 20,
      right: 20,
    },
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.2),
  },
  xaxis: {
    categories: ['CEO', 'Directors', 'Managers', 'Team Leads', 'Senior Staff', 'Junior Staff', 'Interns'],
    labels: {
      show: false,
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  tooltip: {
    
    y: {
      formatter: (value: number) => {
        return value + ' employees'
      },
    },
  },
  colors: [
    getColor('danger', 500),
    getColor('primary', 100),
    getColor('primary', 200),
    getColor('primary', 300),
    getColor('primary', 400),
    getColor('primary', 500),
    getColor('primary', 600),
  ],
})
