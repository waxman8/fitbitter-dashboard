interface HeartRateDataPoint {
  time: string;
  value: number | null;
}

export function calculateSimpleRollingAverage(data: HeartRateDataPoint[], windowSize: number): HeartRateDataPoint[] {
  if (!data || data.length === 0 || windowSize <= 1) {
    return data;
  }

  const smoothedData: HeartRateDataPoint[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const window = data.slice(start, end);
    
    const validValues = window.map(p => p.value).filter(v => v !== null) as number[];

    if (validValues.length > 0) {
      const sum = validValues.reduce((acc, val) => acc + val, 0);
      smoothedData.push({ time: data[i].time, value: sum / validValues.length });
    } else {
      smoothedData.push({ time: data[i].time, value: null });
    }
  }

  return smoothedData;
}