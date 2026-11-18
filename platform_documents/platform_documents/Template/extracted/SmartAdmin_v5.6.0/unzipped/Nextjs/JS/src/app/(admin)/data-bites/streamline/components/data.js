const resolveColor = colorStr => {
  if (!colorStr) return '';
  if (colorStr.startsWith('var(--')) {
    const match = colorStr.match(/var\(--([a-zA-Z0-9-]+)\)/);
    if (match) {
      const varName = match[1];
      if (typeof window !== 'undefined') {
        let resolved = getComputedStyle(document.documentElement).getPropertyValue(`--${varName}`).trim();
        if (!resolved && document.body) {
          resolved = getComputedStyle(document.body).getPropertyValue(`--${varName}`).trim();
        }
        if (resolved) return resolved;
      }
    }
  }
  return colorStr;
};
const sharedTooltip = {
  enabled: true,
  x: {
    show: false
  },
  y: {
    title: {
      formatter: () => ''
    },
    formatter: val => val.toFixed(2)
  }
};
const disableCrosshairs = {
  xaxis: {
    crosshairs: {
      show: false
    }
  }
};
export const getLinesOptions = (data, color, strokeWidth = 2) => () => ({
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
export const getLineOptions = (data, color, fillColor, height, width, lineWidth) => () => {
  const isArea = fillColor && fillColor !== 'transparent';
  return {
    series: [{
      name: 'Series',
      data
    }],
    chart: {
      type: isArea ? 'area' : 'line',
      height,
      width,
      sparkline: {
        enabled: true
      }
    },
    stroke: {
      width: lineWidth,
      colors: [color],
      curve: 'straight'
    },
    colors: [isArea ? fillColor : color],
    fill: isArea ? {
      type: 'solid',
      opacity: 1
    } : undefined,
    tooltip: sharedTooltip,
    xaxis: disableCrosshairs.xaxis
  };
};
export const getBarOptions = (data, barColor, negBarColor, height, width, barWidth) => () => ({
  series: [{
    name: 'Series',
    data
  }],
  chart: {
    type: 'bar',
    height,
    width,
    sparkline: {
      enabled: true
    }
  },
  colors: [opts => {
    const val = opts.value;
    if (val < 0 && negBarColor) return negBarColor;
    return barColor;
  }],
  plotOptions: {
    bar: {
      columnWidth: `${barWidth * 12}%`
    }
  },
  tooltip: sharedTooltip,
  xaxis: disableCrosshairs.xaxis
});
export const getTristateOptions = (data, posColor, negColor, zeroColor, height, width, barWidth) => () => {
  const rangeData = data.map((val, idx) => {
    if (val === -1) return {
      x: idx.toString(),
      y: [-2, 0]
    };
    if (val === 0) return {
      x: idx.toString(),
      y: [-1, 1]
    };
    return {
      x: idx.toString(),
      y: [0, 2]
    };
  });
  return {
    series: [{
      name: 'Series',
      data: rangeData
    }],
    chart: {
      type: 'rangeBar',
      height,
      width,
      sparkline: {
        enabled: true
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
    colors: [opts => {
      const val = data[opts.dataPointIndex];
      if (val === -1) return resolveColor(negColor);
      if (val === 0) return resolveColor(zeroColor);
      return resolveColor(posColor);
    }],
    plotOptions: {
      bar: {
        distributed: true,
        columnWidth: `${barWidth * 8}%`
      }
    },
    yaxis: {
      min: -3,
      max: 3
    },
    tooltip: {
      ...sharedTooltip,
      y: {
        title: {
          formatter: () => ''
        },
        formatter: (val, opts) => {
          const rawVal = data[opts.dataPointIndex];
          return rawVal.toFixed(2);
        }
      }
    },
    xaxis: disableCrosshairs.xaxis
  };
};
export const getDiscreteOptions = (data, lineColor, thresholdColor, thresholdValue, height, width, lineWidth) => () => {
  const resolvedLineColor = resolveColor(lineColor);
  const resolvedThresholdColor = resolveColor(thresholdColor);
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const valRange = maxVal - minVal;
  const yAxisSpan = valRange + 4;
  const tickOffset = yAxisSpan * 0.55 / 2;
  const rangeData = data.map((val, idx) => ({
    x: idx.toString(),
    y: [val - tickOffset, val + tickOffset]
  }));
  return {
    series: [{
      name: 'Series',
      data: rangeData
    }],
    chart: {
      type: 'rangeBar',
      height,
      width,
      sparkline: {
        enabled: true
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
    colors: [opts => {
      const val = data[opts.dataPointIndex];
      return val < thresholdValue ? resolvedThresholdColor : resolvedLineColor;
    }],
    plotOptions: {
      bar: {
        distributed: true,
        columnWidth: `${lineWidth * 15}%`
      }
    },
    yaxis: {
      min: minVal - 2,
      max: maxVal + 2
    },
    annotations: {
      yaxis: [{
        y: thresholdValue,
        borderColor: resolvedThresholdColor,
        strokeDashArray: 0,
        borderWidth: 1
      }]
    },
    tooltip: {
      ...sharedTooltip,
      y: {
        title: {
          formatter: () => ''
        },
        formatter: (val, opts) => {
          const rawVal = data[opts.dataPointIndex];
          return rawVal.toFixed(2);
        }
      }
    },
    xaxis: disableCrosshairs.xaxis
  };
};
export const getPieOptions = (data, colors, height, width) => () => ({
  series: data,
  chart: {
    type: 'pie',
    height,
    width,
    sparkline: {
      enabled: true
    },
    toolbar: {
      show: false
    }
  },
  colors,
  legend: {
    show: false
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 0
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      offsetX: 0,
      offsetY: 0
    }
  },
  tooltip: {
    enabled: true
  }
});