import { getColor } from '@/utils/getColor';
export const getBasicRadarOptions = () => ({
  series: [{
    name: 'Basic Radar',
    data: [80, 50, 30, 40, 100, 20]
  }],
  chart: {
    height: 350,
    type: 'radar',
    toolbar: {
      show: true
    }
  },
  xaxis: {
    categories: ['January', 'February', 'March', 'April', 'May', 'June']
  },
  colors: [getColor('primary', 500)],
  tooltip: {
    y: {
      formatter: val => String(val)
    }
  },
  markers: {
    size: 4,
    colors: [getColor('primary', 500)],
    strokeColors: '#fff',
    strokeWidth: 2
  }
});
export const getMultiSeriesRadarOptions = () => ({
  series: [{
    name: 'Series 1',
    data: [80, 50, 30, 40, 100, 20]
  }, {
    name: 'Series 2',
    data: [20, 30, 40, 80, 20, 80]
  }, {
    name: 'Series 3',
    data: [44, 76, 78, 13, 43, 10]
  }],
  chart: {
    height: 350,
    type: 'radar',
    dropShadow: {
      enabled: true,
      blur: 1,
      left: 1,
      top: 1
    },
    toolbar: {
      show: true
    }
  },
  stroke: {
    width: 2
  },
  fill: {
    opacity: 0.1
  },
  markers: {
    size: 0
  },
  xaxis: {
    categories: ['January', 'February', 'March', 'April', 'May', 'June']
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('primary', 200)],
  tooltip: {
    y: {
      formatter: val => String(val)
    }
  },
  legend: {
    position: 'top'
  }
});
export const getPolygonFillRadarOptions = () => ({
  series: [{
    name: 'Series 1',
    data: [20, 100, 40, 30, 50, 80, 33]
  }],
  chart: {
    height: 350,
    type: 'radar',
    toolbar: {
      show: true
    }
  },
  dataLabels: {
    enabled: true
  },
  plotOptions: {
    radar: {
      size: 140,
      polygons: {
        strokeColors: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.2),
        fill: {
          // colors: [getColor('bootstrapVars', 'bodyBg', 'rgba', 0.1), '#fff']
        }
      }
    }
  },
  colors: [getColor('primary', 500)],
  markers: {
    size: 4,
    colors: [getColor('primary', 500)],
    strokeColors: '#fff',
    strokeWidth: 2
  },
  tooltip: {
    y: {
      formatter: val => String(val)
    }
  },
  xaxis: {
    categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  yaxis: {
    tickAmount: 7
  }
});