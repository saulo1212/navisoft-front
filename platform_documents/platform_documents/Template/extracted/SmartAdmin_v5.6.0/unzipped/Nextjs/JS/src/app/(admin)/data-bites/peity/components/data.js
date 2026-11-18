export const getLineOptions = (data, color, strokeWidth = 2) => () => ({
  series: [{
    name: 'Series',
    data
  }],
  chart: {
    type: 'line',
    height: 40,
    width: 110,
    sparkline: {
      enabled: true
    }
  },
  stroke: {
    width: strokeWidth,
    curve: 'straight'
  },
  colors: [color],
  tooltip: {
    enabled: false
  }
});
export const getBarOptions = (data, colors) => () => ({
  series: [{
    name: 'Series',
    data
  }],
  chart: {
    type: 'bar',
    height: 40,
    width: 110,
    sparkline: {
      enabled: true
    }
  },
  colors: colors,
  plotOptions: {
    bar: {
      distributed: true,
      columnWidth: '80%'
    }
  },
  tooltip: {
    enabled: false
  }
});
export const getDonutOptions = (data, colors, size = 40, width = 50) => () => ({
  series: data,
  chart: {
    type: 'donut',
    height: size,
    width: width,
    sparkline: {
      enabled: true
    }
  },
  colors: colors,
  stroke: {
    width: 0
  },
  plotOptions: {
    pie: {
      donut: {
        size: '50%'
      }
    }
  },
  tooltip: {
    enabled: false
  }
});
export const getNegativeBarOptions = data => () => ({
  series: [{
    name: 'Series',
    data
  }],
  chart: {
    type: 'bar',
    height: 40,
    width: 110,
    sparkline: {
      enabled: true
    }
  },
  colors: [opts => {
    return opts.value < 0 ? '#fd3995' : '#1dc9b7';
  }],
  plotOptions: {
    bar: {
      columnWidth: '80%'
    }
  },
  tooltip: {
    enabled: false
  }
});
export const getTransitionBarOptions = data => () => ({
  series: [{
    name: 'Series',
    data
  }],
  chart: {
    type: 'bar',
    height: 40,
    width: 110,
    sparkline: {
      enabled: true
    }
  },
  plotOptions: {
    bar: {
      distributed: true,
      columnWidth: '80%'
    }
  },
  colors: ['#b71c1c', '#c62828', '#d32f2f', '#e53935', '#f44336', '#ef5350', '#e57373', '#ef9a9a', '#ffcdd2', '#ffebee'],
  tooltip: {
    enabled: false
  }
});
export const getAreaOptions = (data, strokeColor, fillColor) => () => ({
  series: [{
    name: 'Series',
    data
  }],
  chart: {
    type: 'area',
    height: 40,
    width: 110,
    sparkline: {
      enabled: true
    }
  },
  stroke: {
    width: 2,
    colors: [strokeColor],
    curve: 'straight'
  },
  colors: [fillColor],
  fill: {
    type: 'solid',
    opacity: 1
  },
  tooltip: {
    enabled: false
  }
});
export const getPieOptions = (data, colors, size = 40) => () => ({
  series: data,
  chart: {
    type: 'pie',
    height: size,
    width: size + 10,
    sparkline: {
      enabled: true
    }
  },
  colors: colors,
  stroke: {
    width: 0
  },
  tooltip: {
    enabled: false
  }
});
export const getCustomDonutOptions = (data, colors, radius, innerRadius) => () => {
  const size = radius * 2;
  const donutSizePct = Math.round(innerRadius / radius * 100);
  return {
    series: data,
    chart: {
      type: 'donut',
      height: size,
      width: size,
      sparkline: {
        enabled: true
      }
    },
    colors: colors,
    stroke: {
      width: 0
    },
    plotOptions: {
      pie: {
        customScale: 1,
        donut: {
          size: `${donutSizePct}%`
        }
      }
    },
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    tooltip: {
      enabled: false
    }
  };
};
export const getUpdatingChartOptions = () => () => ({
  chart: {
    type: 'area',
    height: 40,
    width: 200,
    sparkline: {
      enabled: true
    },
    animations: {
      enabled: false
    }
  },
  stroke: {
    width: 1,
    colors: ['var(--info-500)'],
    curve: 'straight'
  },
  colors: ['var(--info-200)'],
  fill: {
    type: 'solid',
    opacity: 1
  },
  yaxis: {
    min: 0,
    max: 10
  },
  tooltip: {
    enabled: false
  }
});