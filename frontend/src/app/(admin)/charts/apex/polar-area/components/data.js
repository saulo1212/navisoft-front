import { getColor } from '@/utils/getColor';
export const getBasicPolarAreaOptions = () => ({
  series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
  chart: {
    height: 350,
    type: 'polarArea',
    toolbar: {
      show: true
    }
  },
  stroke: {
    colors: ['#ffffff']
  },
  fill: {
    opacity: 0.8
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom',
        labels: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex')
        }
      }
    }
  }],
  labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E', 'Category F', 'Category G', 'Category H', 'Category I'],
  colors: [getColor('primary', 50), getColor('primary', 100), getColor('primary', 200), getColor('primary', 300), getColor('primary', 400), getColor('primary', 500), getColor('primary', 600), getColor('info', 50), getColor('info', 100)]
});
export const getMonochromePolarAreaOptions = () => ({
  series: [42, 47, 52, 58, 65],
  chart: {
    height: 350,
    type: 'polarArea',
    toolbar: {
      show: true
    }
  },
  labels: ['Market Research', 'Direct Sales', 'Email Marketing', 'Social Media', 'Referrals'],
  fill: {
    opacity: 1
  },
  stroke: {
    width: 1,
    colors: undefined
  },
  yaxis: {
    show: false
  },
  legend: {
    position: 'bottom'
  },
  plotOptions: {
    polarArea: {
      rings: {
        strokeWidth: 0
      },
      spokes: {
        strokeWidth: 0
      }
    }
  },
  theme: {
    monochrome: {
      enabled: true,
      shadeTo: 'light',
      shadeIntensity: 0.6,
      color: getColor('primary', 500)
    }
  }
});
export const getGradientPolarAreaOptions = () => ({
  series: [30, 40, 35, 50, 49, 60, 70, 91, 125],
  chart: {
    height: 350,
    type: 'polarArea',
    toolbar: {
      show: true
    }
  },
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
  fill: {
    opacity: 1,
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.8,
      opacityTo: 0.5,
      stops: [0, 100]
    }
  },
  stroke: {
    width: 1,
    colors: [getColor('bootstrapVars', 'bodyBg', 'hex')]
  },
  yaxis: {
    show: false
  },
  legend: {
    position: 'bottom'
  },
  plotOptions: {
    polarArea: {
      rings: {
        strokeWidth: 1,
        strokeColor: getColor('bootstrapVars', 'bodyBg', 'hex')
      },
      spokes: {
        strokeWidth: 1,
        connectorColors: getColor('bootstrapVars', 'bodyBg', 'hex')
      }
    }
  },
  tooltip: {
    y: {
      formatter: val => {
        return '$' + val + 'K';
      }
    }
  },
  colors: [getColor('primary', 50), getColor('primary', 100), getColor('primary', 200), getColor('primary', 300), getColor('primary', 400), getColor('primary', 500), getColor('primary', 600), getColor('primary', 700), getColor('primary', 800)]
});