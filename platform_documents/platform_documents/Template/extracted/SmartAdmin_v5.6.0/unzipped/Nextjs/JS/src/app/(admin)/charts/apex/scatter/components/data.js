import { getColor } from '@/utils/getColor';
import braveImg from '@/assets/img/browsers/brave.png';
import chromeImg from '@/assets/img/browsers/chrome.png';
import firefoxImg from '@/assets/img/browsers/firefox.png';
import safariImg from '@/assets/img/browsers/safari.png';
export const getBasicScatterOptions = () => ({
  series: [{
    name: 'Sample A',
    data: [[16.4, 5.4], [21.7, 2.1], [25.4, 3.0], [19.0, 2.5], [10.9, 1.4], [13.6, 3.2], [10.9, 7.1], [10.9, 0], [10.9, 8.7], [16.4, 0], [16.4, 1.8], [13.6, 0.3], [13.6, 0], [29.9, 0], [27.1, 2.3], [16.4, 0], [13.6, 3.7], [10.9, 5.2], [16.4, 6.5], [10.9, 0], [24.5, 7.1], [10.9, 0], [8.1, 4.7], [19.0, 0], [21.7, 1.8], [27.1, 0], [24.5, 0], [27.1, 0], [29.9, 1.5], [27.1, 0.8], [22.1, 2.0]]
  }, {
    name: 'Sample B',
    data: [[36.4, 13.4], [1.7, 11.1], [5.4, 8.0], [9.0, 17.5], [1.9, 4.4], [3.6, 12.2], [1.9, 14.1], [1.9, 9.0], [1.9, 13.7], [1.4, 7.0], [6.4, 8.8], [3.6, 4.3], [1.6, 10.0], [9.9, 2.0], [7.1, 15.3], [1.4, 0], [3.6, 13.7], [1.9, 15.2], [6.4, 16.5], [0.9, 10.0], [4.5, 17.1], [10.9, 10.0], [0.1, 14.7], [9.0, 10.0], [12.7, 11.8], [2.1, 10.0], [2.5, 10.0], [27.1, 10.0], [2.9, 11.5], [7.1, 10.8], [2.1, 12.0]]
  }],
  chart: {
    height: 350,
    type: 'scatter',
    zoom: {
      enabled: true,
      type: 'xy'
    },
    toolbar: {
      show: true
    }
  },
  xaxis: {
    tickAmount: 10
  },
  yaxis: {
    tickAmount: 7
  },
  title: {
    text: 'Basic Scatter Chart',
    align: 'left'
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    row: {
      colors: [getColor('bootstrapVars', 'bodyColor', 'rgba', 0.05), 'transparent'],
      opacity: 0.5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  colors: [getColor('primary', 500), getColor('danger', 500)],
  markers: {
    size: 6
  }
});
export const getCategoryScatterOptions = () => ({
  series: [{
    name: 'TEAM A',
    data: [[1, 5.4], [2, 7.1], [3, 9.0], [4, 9.5], [5, 8.9], [6, 12.2], [7, 14.3], [8, 16.5], [9, 18.0], [10, 15.8]]
  }, {
    name: 'TEAM B',
    data: [[1, 3.2], [2, 4.5], [3, 5.8], [4, 6.3], [5, 7.0], [6, 7.5], [7, 8.0], [8, 8.5], [9, 9.1], [10, 9.8]]
  }, {
    name: 'TEAM C',
    data: [[1, 11.1], [2, 12.5], [3, 11.8], [4, 10.5], [5, 12.0], [6, 13.5], [7, 11.7], [8, 10.8], [9, 13.2], [10, 14.5]]
  }],
  chart: {
    height: 350,
    type: 'scatter',
    zoom: {
      enabled: true,
      type: 'xy'
    },
    toolbar: {
      show: true
    }
  },
  xaxis: {
    type: 'category',
    tickAmount: 10,
    labels: {
      formatter: val => {
        return parseInt(val, 10) + '';
      }
    }
  },
  yaxis: {
    tickAmount: 7,
    title: {
      text: 'Performance Score'
    }
  },
  title: {
    text: 'Scatter Chart with Categories',
    align: 'left'
  },
  legend: {
    position: 'top'
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  colors: [getColor('primary', 500), getColor('danger', 500), getColor('warning', 500)],
  tooltip: {
    y: {
      formatter: val => {
        return val + ' points';
      }
    },
    x: {
      formatter: val => {
        return 'Round ' + val;
      }
    }
  },
  markers: {
    size: 7
  }
});
export const getImageScatterOptions = () => ({
  series: [{
    name: 'Messenger',
    data: [[16.4, 5.4], [21.7, 4.1], [25.4, 3.0], [19.0, 2.5], [10.9, 1.4]]
  }, {
    name: 'LinkedIn',
    data: [[6.4, 5.4], [11.7, 4.1], [15.4, 3.0], [9.0, 2.5], [10.9, 1.4]]
  }, {
    name: 'Facebook',
    data: [[36.4, 13.4], [1.7, 11.1], [5.4, 8.0], [9.0, 17.0], [1.9, 4.4]]
  }, {
    name: 'Instagram',
    data: [[26.4, 16.4], [28.7, 18.1], [29.4, 20.0], [25.0, 22.5], [20.9, 19.4]]
  }],
  chart: {
    height: 350,
    type: 'scatter',
    animations: {
      enabled: false
    },
    zoom: {
      enabled: true,
      type: 'xy'
    },
    toolbar: {
      show: true
    }
  },
  xaxis: {
    tickAmount: 10,
    min: 0,
    max: 40
  },
  yaxis: {
    tickAmount: 7,
    min: 0,
    max: 25,
    title: {
      text: 'Engagement Rate (%)'
    }
  },
  title: {
    text: 'Social Media Engagement (with custom markers)',
    align: 'left'
  },
  colors: [getColor('primary', 500), getColor('danger', 500), getColor('warning', 500), getColor('success', 500)],
  tooltip: {
    y: {
      formatter: val => {
        return val + '%';
      }
    },
    x: {
      formatter: val => {
        return val + 'M users';
      }
    }
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  markers: {
    size: 20,
    shape: 'circle'
  },
  legend: {
    position: 'top'
  }
});
const generateDayWiseTimeSeries = (startDate, count, range) => {
  let i = 0;
  const series = [];
  while (i < count) {
    const x = new Date(startDate.getTime() + i * 86400000);
    const y = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    series.push([x, y]);
    i++;
  }
  return series;
};
export const getDatetimeScatterOptions = () => ({
  series: [{
    name: 'Sales',
    data: generateDayWiseTimeSeries(new Date('01 Jan 2025'), 30, {
      min: 10,
      max: 90
    })
  }, {
    name: 'Web Traffic',
    data: generateDayWiseTimeSeries(new Date('01 Jan 2025'), 30, {
      min: 50,
      max: 150
    })
  }],
  chart: {
    height: 350,
    type: 'scatter',
    zoom: {
      enabled: true,
      type: 'xy'
    },
    toolbar: {
      show: true
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false
    }
  },
  yaxis: {
    title: {
      text: 'Value'
    }
  },
  title: {
    text: 'Scatter Chart with Datetime',
    align: 'left'
  },
  grid: {
    row: {
      colors: [getColor('bootstrapVars', 'bodyColor', 'rgba', 0.05), 'transparent'],
      opacity: 0.5
    },
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  colors: [getColor('primary', 500), getColor('danger', 500)],
  tooltip: {
    x: {
      format: 'dd MMM yyyy'
    }
  },
  markers: {
    size: 6
  }
});
const generateData = (count, yrange) => {
  let i = 0;
  const series = [];
  while (i < count) {
    const x = (Math.random() * 100).toFixed(0);
    const y = (Math.random() * yrange).toFixed(0);
    series.push({
      x: x,
      y: y
    });
    i++;
  }
  return series;
};
export const getImagesScatterOptions = () => ({
  series: [{
    name: 'Brave',
    data: generateData(10, 80)
  }, {
    name: 'Chrome',
    data: generateData(10, 60)
  }, {
    name: 'Firefox',
    data: generateData(10, 40)
  }, {
    name: 'Safari',
    data: generateData(10, 100)
  }],
  chart: {
    height: 350,
    type: 'scatter',
    animations: {
      enabled: false
    },
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  colors: [getColor('primary', 500), getColor('danger', 500), getColor('warning', 500), getColor('success', 500)],
  xaxis: {
    tickAmount: 20,
    min: 0,
    max: 10
  },
  yaxis: {
    tickAmount: 5
  },
  markers: {
    size: 20,
    shape: 'circle',
    strokeWidth: 0,
    hover: {
      size: 25
    }
  },
  fill: {
    type: 'image',
    opacity: 1,
    image: {
      src: [braveImg.src, chromeImg.src, firefoxImg.src, safariImg.src],
      width: 30,
      height: 30
    }
  },
  title: {
    text: 'Social Media Usage Distribution',
    align: 'left'
  },
  legend: {
    position: 'bottom'
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  tooltip: {
    custom: opts => {
      const platforms = ['Brave', 'Chrome', 'Firefox', 'Safari'];
      const data = opts.w.globals.initialSeries[opts.seriesIndex].data[opts.dataPointIndex];
      return '<div class="p-2">' + '<div style="text-align: center; margin-bottom: 5px;"><strong>' + platforms[opts.seriesIndex] + '</strong></div>' + '<span>Usage score: ' + data.y + '</span><br>' + '<span>Satisfaction: ' + data.x + '</span>' + '</div>';
    }
  }
});